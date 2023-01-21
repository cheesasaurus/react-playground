import React from "react";
import { Dialog } from "./Dialog";
import { DialogControlContext } from "./DialogContext";
import { DialogControl, UpdateHandlerHandle } from "./DialogControl";


interface Props {
    dialogControl: DialogControl;
    dragBoundary?: React.RefObject<HTMLElement>;
}

interface State {
    order: Array<string>;
}


export class DialogContainer extends React.Component<Props, State> {
    private updateHandle: UpdateHandlerHandle | undefined;

    public constructor(props: Props) {
        super(props);
        this.state = {
            order: [],
        };
    }

    public componentDidMount(): void {
        this.updateHandle = this.props.dialogControl.onUpdate((m) => {
            this.setState({order: m.order});
        });
    }

    public componentWillUnmount(): void {
        if (this.updateHandle) {
            this.props.dialogControl.offUpdate(this.updateHandle);
        }
    }

    public render(): React.ReactNode {
        const control = this.props.dialogControl;
        const dialogs = control.getOrder().map(dialogId => {
            const dialog = control.getDialog(dialogId);
            return (
                <Dialog
                    key={dialog.id}
                    id={dialog.id}
                    config={dialog.config}
                    dragBoundary={this.props.dragBoundary}
                >
                    {dialog.content}
                </Dialog>
            );
        });

        return <>{dialogs}</>;
    }
    
}