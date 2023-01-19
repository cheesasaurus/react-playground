

type OpenCallback = (content: React.ReactNode) => void;
type CloseCallback = () => void;


export interface IDialogControl {
    open(content: React.ReactNode): void;
    close(): void;
    onOpenRequested(callback: OpenCallback): void
    onCloseRequested(callback: CloseCallback): void
}


export class DialogControl {
    private openCallback: OpenCallback | undefined;
    private closeCallback: CloseCallback | undefined;

    public open = (content: React.ReactNode) => {
        if (this.openCallback) {
            this.openCallback(content);
        }
    };

    public close = () => {
        console.log('closing...');
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
