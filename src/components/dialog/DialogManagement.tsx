import { ReactNode } from "react";
import { CrudeStoreContext } from "../../crude-store/CrudeStoreProvider";
import { MessageBus, MessageHandler, Subscription } from "../../utils";
import { DudeInfo } from "../DudeInfo/DudeInfo";
import { WorkflowCreateDude } from "../WorkflowCreateDude/WorkflowCreateDude";
import { DialogConfig } from "./DialogConfig";


interface ActiveDialog {
    id: string,
    domId: string,
    content: ReactNode,
    config: DialogConfig,
}

export interface MessageDialogsUpdated {
    order: Array<string>
};


export class DialogManager {
    private order = Array<string>();
    private activeDialogs: {
        [dialogId: string]: ActiveDialog;
    } = {};
    private bus: MessageBus<MessageDialogsUpdated>;

    public constructor(bus: MessageBus<MessageDialogsUpdated>) {
        this.bus = bus;
    }

    public async openDialog(dialogId: string, jsx: ReactNode, config: DialogConfig): Promise<void> {
        // Allow any event propagation to complete before actually opening the dialog.
        // E.g. In case this dialog is being opened due to the user clicking something from another semi-active dialog:
        // That dialog should be brought to the foreground, and then this dialog should be opened above it.
        return new Promise((resolve) => {
            setTimeout(() => {
                if (dialogId in this.activeDialogs) {
                    this._bringToFront(dialogId);
                }
                else {
                    this.openNewDialog(dialogId, jsx, config);
                }
                this.triggerUpdate();
                resolve();
            }, 0);
        });
    }

    private openNewDialog(dialogId: string, jsx: ReactNode, config: DialogConfig): void {
        const cascadeTarget = this.findCascadeTarget(config.cascadeGroup);
        if (cascadeTarget) {
            const {x, y} = this.cascadePos(cascadeTarget);
            config.initialX = x;
            config.initialY = y;
        }

        this.order.push(dialogId);
        this.activeDialogs[dialogId] = {
            id: dialogId,
            domId: `dialog#${dialogId}`,
            content: jsx,
            config: config,
        };
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

    private findCascadeTarget(cascadeGroup?: string): HTMLElement|null {
        if (!cascadeGroup) {
            return null;
        }
        for (let i = this.order.length - 1; i >= 0; i--) {
            const dialogId = this.order[i];
            const dialog = this.activeDialogs[dialogId];
            if (dialog.config.cascadeGroup === cascadeGroup) {
                return document.getElementById(dialog.domId);
            }
        }
        return null;
    }

    private cascadePos(el: HTMLElement): {x: number, y: number} {
        const maxX = document.documentElement.clientWidth - 250;
        const maxY = document.documentElement.clientHeight - 250;
        const rect = el.getBoundingClientRect();

        const offset = 30;

        let x = rect.left;
        if (x > maxX) {
            x -= offset;
        }
        else {
            x += offset;
        }

        let y = rect.top;
        if (y > maxY) {
            y -= offset;
        }
        else {
            y += offset;
        }

        return {x, y};
    }

}


export class DialogMonitor {
    private manager: DialogManager;
    private bus: MessageBus<MessageDialogsUpdated>;

    public constructor(manager: DialogManager, bus: MessageBus<MessageDialogsUpdated>, ) {
        this.bus = bus;
        this.manager = manager;
    }

    public onUpdate(handler: MessageHandler<MessageDialogsUpdated>): Subscription {
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

    public openDudeCreator(dudeId?: string): void {
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
            <CrudeStoreContext.Consumer>
                {crudeStore => (
                    <WorkflowCreateDude
                        crudeStore={crudeStore!}
                        dudeId={dudeId}
                        onWorkflowCompleted={onWorkflowCompleted}
                        onNameDetermined={onNameDetermined}
                />
                )}
            </CrudeStoreContext.Consumer>
            
        );
        this.manager.openDialog(dialogId, content, {
            title: 'Create a Dude',
            cascadeGroup: 'WorkflowCreateDude',
            useRawContent: true,
            width: 1000,
            height: 500,
        });
    }

    public openDudeInfo(dudeId: string): void {
        const dialogId = `DudeInfo#${dudeId}`;
        const initialTitle = 'Dude Info';

        const onNameDetermined = (dudeName: string) => {
            const newTitle = `Dude Info: ${dudeName}`;
            this.manager.updateTitle(dialogId, newTitle);
        };
        const content = (
            <CrudeStoreContext.Consumer>
                {crudeStore => (
                    <DudeInfo
                        dudeId={dudeId}
                        onNameDetermined={onNameDetermined}
                        crudeStore={crudeStore!}
                    />
                )}
            </CrudeStoreContext.Consumer>
        );
        this.manager.openDialog(dialogId, content, {
            title: initialTitle,
            cascadeGroup: 'DudeInfo',
            width: 450,
        });

    }

}
