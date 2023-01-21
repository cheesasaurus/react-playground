import { ReactNode } from "react";
import { docReady, MessageBus, MessageHandler, Subscription } from "../../utils";
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


export class DialogControl {
    public open: (dialogId: string, content: React.ReactNode, config: DialogConfig) => void;
    public close: (dialogId: string) => void;
    public bringToFront: (dialogId: string) => void;
    public getOrder: () => Array<string>;
    public getDialog: (dialogId: string) => ActiveDialog;
    public onUpdate: (handler: MessageHandler<UpdateMessage>) => Subscription;

    public constructor(bus: MessageBus<UpdateMessage>, manager: DialogManager) {
        // The control is intended to be used in react context.
        // Closures are used to avoid [unwanted react updates due to manager properties changing].
        this.open = (dialogId: string, content: React.ReactNode, config: DialogConfig) => {
            manager.openDialog(dialogId, content, config);
        };
        this.close = (dialogId: string) => manager.closeDialog(dialogId);
        this.bringToFront = (dialogId: string) => manager.bringToFront(dialogId);
        this.getOrder = () => manager.getOrder();
        this.getDialog = (dialogId: string) => manager.getDialog(dialogId);
        this.onUpdate = (handler: MessageHandler<UpdateMessage>): Subscription => {
            return bus.on('updated', handler);
        }
    }

}

export const factoryDialogControl = () => {
    const bus = new MessageBus<UpdateMessage>();
    const dialogManager = new DialogManager(bus);
    const dialogControl = new DialogControl(bus, dialogManager);
    docReady(() => dialogManager.closeFrontmostDialogWhenKeyPressed('Escape'));
    return dialogControl;
};
