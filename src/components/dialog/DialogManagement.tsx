import { ReactNode } from "react";
import { docReady, MessageBus, MessageHandler, Subscription } from "../../utils";
import { DudeInfo } from "../DudeInfo/DudeInfo";
import { WorkflowCreateDude } from "../WorkflowCreateDude/WorkflowCreateDude";
import { DialogConfig } from "./DialogConfig";


interface ActiveDialog {
    id: string,
    content: ReactNode,
    config: DialogConfig,
    
}

interface UpdateMessage {
    order: Array<string>
};


export class DialogManager {
    private order = Array<string>();
    private activeDialogs: {
        [dialogId: string]: ActiveDialog;
    } = {};
    private bus: MessageBus<UpdateMessage>;

    public constructor(bus: MessageBus<UpdateMessage>) {
        this.bus = bus;
    }

    public async openDialog(dialogId: string, jsx: ReactNode, config: DialogConfig): Promise<void> {
        // Allow any event propagation to complete before actually opening the dialog.
        // E.g. In case this dialog is being opened due to the user clicking something from another semi-active dialog:
        // That dialog should be brought to the foreground, and then this dialog should be opened above it.
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (dialogId in this.activeDialogs) {
                    this._bringToFront(dialogId);
                }
                else {
                    this.order.push(dialogId);
                }
                this.activeDialogs[dialogId] = {
                    id: dialogId,
                    content: jsx,
                    config: config,
                };
                this.triggerUpdate();
                resolve();
            }, 0);
        });
    }

    public closeDialog(dialogId: string): void {
        this._closeDialog(dialogId);
        this.triggerUpdate();
    }

    private _closeDialog(dialogId: string): void {
        if (!(dialogId in this.activeDialogs)) {
            return;
        }
        delete this.activeDialogs[dialogId];
        this.order.splice(this.order.indexOf(dialogId), 1);
    }

    public bringToFront(dialogId: string): void {
        this._bringToFront(dialogId);
        this.triggerUpdate();
    }

    private _bringToFront(dialogId: string): void {
        if (!(dialogId in this.activeDialogs)) {
            return;
        }
        this.order.splice(this.order.indexOf(dialogId), 1);
        this.order.push(dialogId);
    }

    public updateTitle(dialogId: string, title: string) {
        if (!(dialogId in this.activeDialogs)) {
            return;
        }
        this.activeDialogs[dialogId].config.title = title;
        this.triggerUpdate();
    }

    public closeFrontmostDialogWhenKeyPressed(key: string): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const order = this.order;
            if (e.key === key && order.length > 0) {
                const frontmostDialogId = order[order.length - 1];
                this._closeDialog(frontmostDialogId);
                this.triggerUpdate();
            }
        });
    }

    public getOrder() {
        return this.order;
    }

    public getDialog(dialogId: string) {
        return this.activeDialogs[dialogId];
    }

    private triggerUpdate() {
        this.bus.emit('updated', {
            order: this.order,
        });
    }

}


export class DialogMonitor {
    private manager: DialogManager;
    private bus: MessageBus<UpdateMessage>;

    public constructor(manager: DialogManager, bus: MessageBus<UpdateMessage>, ) {
        this.bus = bus;
        this.manager = manager;
    }

    public onUpdate(handler: MessageHandler<UpdateMessage>): Subscription {
        return this.bus.on('updated', handler);
    }

    public getDialog(dialogId: string) {
        return this.manager.getDialog(dialogId)
    }

    public getOrder() {
        return this.manager.getOrder();
    }
}


export class DialogControl {
    private manager: DialogManager;

    public constructor(manager: DialogManager) {
        this.manager = manager;
    }

    public open(dialogId: string, content: React.ReactNode, config: DialogConfig) {
        this.manager.openDialog(dialogId, content, config);
    }

    public bringToFront(dialogId: string) {
        this.manager.bringToFront(dialogId)
    }

    public close(dialogId: string) {
        this.manager.closeDialog(dialogId);
    }

    public openDudeCreator(dudeId?: number): void {
        const dialogId = `WorkflowCreateDude#${dudeId || ''}`;
        const initialTitle = 'Create a Dude';

        const onWorkflowCompleted = () => {
            this.manager.closeDialog(dialogId);
        };
        const onNameDetermined = (dudeName: string) => {
            const newTitle = `${initialTitle}: ${dudeName}`;
            this.manager.updateTitle(dialogId, newTitle);
        };
        const content = (
            <WorkflowCreateDude
                dudeId={dudeId}
                onWorkflowCompleted={onWorkflowCompleted}
                onNameDetermined={onNameDetermined}
            />
        );
        this.manager.openDialog(dialogId, content, {
            title: 'Create a Dude',
            useRawContent: true,
            width: 1000,
            height: 500,
        });
    }

    public openDudeInfo(dudeId: number): void {
        const dialogId = `DudeInfo#${dudeId}`;
        const initialTitle = 'Dude Info';

        const onNameDetermined = (dudeName: string) => {
            const newTitle = `Dude Info: ${dudeName}`;
            this.manager.updateTitle(dialogId, newTitle);
        };
        const content = (
            <DudeInfo
                dudeId={dudeId}
                onNameDetermined={onNameDetermined}
            />
        );
        this.manager.openDialog(dialogId, content, {
            title: initialTitle,
        });

    }

}


export const factoryDialogManagement = () => {
    const bus = new MessageBus<UpdateMessage>();
    const dialogManager = new DialogManager(bus);
    const dialogControl = new DialogControl(dialogManager);
    const dialogMonitor = new DialogMonitor(dialogManager, bus);
    docReady(() => dialogManager.closeFrontmostDialogWhenKeyPressed('Escape'));
    return {dialogControl, dialogMonitor};
};
