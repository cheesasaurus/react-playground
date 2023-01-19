

/**
 * @return dialogId
 */
type OpenCallback = (dialogId: string, title: string, content: React.ReactNode) => void;

type CloseCallback = (dialogId: string) => void;


export class DialogControl {
    private openCallback: OpenCallback | undefined;
    private closeCallback: CloseCallback | undefined;

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

    public onOpenRequested(callback: OpenCallback|undefined): void {
        this.openCallback = callback;
    }

    public onCloseRequested(callback: CloseCallback|undefined): void {
        this.closeCallback = callback;
    }
}
