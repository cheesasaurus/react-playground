import React from "react";
import { Subscription } from "../../utils";
import { Dialog } from "./Dialog";
import { DialogControl } from "./DialogControl";


interface Props {
    dialogControl: DialogControl;
    dragBoundary?: React.RefObject<HTMLElement>;
}

interface State {
    order: Array<string>;
}


export class DialogContainer extends React.Component<Props, State> {
    private subscriptions = new Array<Subscription>();

    public constructor(props: Props) {
        super(props);
        this.state = {
            order: [],
        };
    }

    public componentDidMount(): void {
        const subscription = this.props.dialogControl.onUpdate((m) => {
            this.setState({order: m.order});
        });
        this.subscriptions.push(subscription);
    }

    public componentWillUnmount(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions = [];
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