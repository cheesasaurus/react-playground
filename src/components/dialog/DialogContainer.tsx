import React, { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { DialogContext } from "./DialogContext";


interface Props {

}

interface State {
    dialogTitle: string|undefined;
    dialogContents: ReactNode;
}


export class DialogContainer extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    public constructor(props: Props) {
        super(props);
        this.state = {
            dialogTitle: undefined,
            dialogContents: undefined,
        };
    }

    public componentDidMount(): void {
        this.context.control.onOpenRequested((title, jsx) => this.setState({
            dialogTitle: title,
            dialogContents: jsx,
        }));
        this.context.control.onCloseRequested(() => this.setState({
            dialogContents: undefined,
        }));
    }

    public componentWillUnmount(): void {
        this.context.control.onOpenRequested(undefined);
        this.context.control.onCloseRequested(undefined);
    }

    public render(): React.ReactNode {
        const dialogs = [];
        if (this.state.dialogContents !== undefined) {
            dialogs.push(
                // todo: multiple dialogs with keys
                <Dialog
                    key={23}
                    title={this.state.dialogTitle}
                >
                    {this.state.dialogContents}
                </Dialog>
            );
        }

        return <>{dialogs}</>;
    }
    
}