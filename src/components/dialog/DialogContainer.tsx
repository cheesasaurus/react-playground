import React from "react";
import { Subscriptions } from "../../utils";
import { Dialog } from "./Dialog";
import { DialogMonitor } from "./DialogManagement";


interface Props {
    dialogMonitor: DialogMonitor;
    dragBoundary?: React.RefObject<HTMLElement>;
}

interface State {
    order: Array<string>;
}


export class DialogContainer extends React.Component<Props, State> {
    private subscriptions = new Subscriptions;

    public constructor(props: Props) {
        super(props);
        this.state = {
            order: [],
        };
    }

    public componentDidMount(): void {
        const subscription = this.props.dialogMonitor.onUpdate((m) => {
            this.setState({order: m.order});
        });
        this.subscriptions.add(subscription);
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe();
    }

    public render(): React.ReactNode {
        const control = this.props.dialogMonitor;
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