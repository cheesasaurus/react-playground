import React, { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { DialogContext } from "./DialogContext";


interface Props {

}

interface State {
    dialogContents: ReactNode;
}


export class DialogContainer extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    public constructor(props: Props) {
        super(props);
        this.state = {
            dialogContents: undefined,
        };
    }

    public componentDidMount(): void {
        this.context.control.onOpenRequested((jsx) => this.setState({
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
        const showDialog = this.state.dialogContents !== undefined;

        return (
            <>
                {showDialog ? <Dialog>{this.state.dialogContents}</Dialog> : undefined}
                {/* todo: might do multiple dialogs later */}
            </>
        );
    }
    
}