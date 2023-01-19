

/**
 * @return dialogId
 */
type OpenCallback = (dialogId: string, title: string, content: React.ReactNode) => void;

type CloseCallback = (dialogId: string) => void;

type BringToFrontCallback = (dialogId: string) => void;


export class DialogControl {
    private openCallback: OpenCallback | undefined;
    private closeCallback: CloseCallback | undefined;
    private bringToFrontCallback: BringToFrontCallback | undefined;

    public open = (dialogId: string, title: string, content: React.ReactNode) => {
        if (this.openCallback) {
            this.openCallback(dialogId, title, content);
        }
    };

    public close = (dialogId: string) => {
        if (this.closeCallback) {
            this.closeCallback(dialogId);
        }
    };

    public bringToFront = (dialogId: string) => {
        if (this.bringToFrontCallback) {
            this.bringToFrontCallback(dialogId);
        }
    };

    public onOpenRequested(callback: OpenCallback|undefined): void {
        this.openCallback = callback;
    }

    public onCloseRequested(callback: CloseCallback|undefined): void {
        this.closeCallback = callback;
    }

    public onBringToFrontRequested(callback: BringToFrontCallback|undefined): void {
        this.bringToFrontCallback = callback;
    }

}
