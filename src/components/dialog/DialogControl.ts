

type OpenCallback = (title: string, content: React.ReactNode) => void;
type CloseCallback = () => void;


export interface IDialogControl {
    open(title: string, content: React.ReactNode): void;
    close(): void;
    onOpenRequested(callback: OpenCallback): void
    onCloseRequested(callback: CloseCallback): void
}


export class DialogControl implements IDialogControl {
    private openCallback: OpenCallback | undefined;
    private closeCallback: CloseCallback | undefined;

    public open = (title: string, content: React.ReactNode) => {
        if (this.openCallback) {
            this.openCallback(title, content);
        }
    };

    public close = () => {
        if (this.closeCallback) {
            this.closeCallback();
        }
    };

    public onOpenRequested(callback: OpenCallback|undefined): void {
        this.openCallback = callback;
    }

    public onCloseRequested(callback: CloseCallback|undefined): void {
        this.closeCallback = callback;
    }
}
