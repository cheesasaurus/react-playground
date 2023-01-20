import { ReactNode } from "react";
import { docReady, MessageBus, MessageHandler, MessageHandlerHandle } from "../../utils";


interface DialogConfig {
    id: string,
    title: string|undefined,
    content: ReactNode,
}

interface UpdateMessage {
    order: Array<string>
};

export type UpdateHandlerHandle = MessageHandlerHandle<MessageHandler<UpdateMessage>>;

export class DialogManager {
    private order = Array<string>();
    private activeDialogs: {
        [dialogId: string]: DialogConfig;
    } = {};
    private bus: MessageBus<UpdateMessage>;

    public constructor(bus: MessageBus<UpdateMessage>) {
        this.bus = bus;
    }

    public openDialog(dialogId: string, title: string, jsx: ReactNode): void {
        if (dialogId in this.activeDialogs) {
            this._bringToFront(dialogId);
        }
        else {
            this.order.push(dialogId);
        }
        this.activeDialogs[dialogId] = {
            id: dialogId,
            title: title,
            content: jsx,
        };
        this.triggerUpdate();
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

    public _bringToFront(dialogId: string): void {
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
    public open: (dialogId: string, title: string, content: React.ReactNode) => void;
    public close: (dialogId: string) => void;
    public bringToFront: (dialogId: string) => void;
    public getOrder: () => Array<string>;
    public getDialog: (dialogId: string) => DialogConfig;
    public onUpdate: (handler: MessageHandler<UpdateMessage>) => UpdateHandlerHandle;
    public offUpdate: (handle: UpdateHandlerHandle) => void;

    public constructor(bus: MessageBus<UpdateMessage>, manager: DialogManager) {
        // The control is intended to be used in react context.
        // Closures are used to avoid [unwanted react updates due to manager properties changing].
        this.open = (dialogId: string, title: string, content: React.ReactNode) => {
            manager.openDialog(dialogId, title, content);
        };
        this.close = (dialogId: string) => manager.closeDialog(dialogId);
        this.bringToFront = (dialogId: string) => manager.bringToFront(dialogId);
        this.getOrder = () => manager.getOrder();
        this.getDialog = (dialogId: string) => manager.getDialog(dialogId);
        this.onUpdate = (handler: MessageHandler<UpdateMessage>): UpdateHandlerHandle => {
            return bus.on('updated', handler);
        }
        this.offUpdate = (handle: UpdateHandlerHandle): void => {
            bus.off(handle);
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
