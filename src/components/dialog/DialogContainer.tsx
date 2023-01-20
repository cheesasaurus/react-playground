import React from "react";
import { Dialog } from "./Dialog";
import { DialogContext } from "./DialogContext";
import { UpdateHandlerHandle } from "./DialogControl";


interface Props {
    dragBoundary?: React.RefObject<HTMLElement>;
}

interface State {
    order: Array<string>;
}


export class DialogContainer extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    private updateHandle: UpdateHandlerHandle | undefined;

    public constructor(props: Props) {
        super(props);
        this.state = {
            order: [],
        };
    }

    public componentDidMount(): void {
        this.updateHandle = this.context.control?.onUpdate((m) => {
            this.setState({order: m.order});
        });
    }

    public componentWillUnmount(): void {
        if (this.updateHandle) {
            this.context.control?.offUpdate(this.updateHandle);
        }
    }

    public render(): React.ReactNode {
        const control = this.context.control!;
        const dialogs = control.getOrder().map(dialogId => {
            const dialog = control.getDialog(dialogId);
            return (
                <Dialog
                    key={dialog.id}
                    id={dialog.id}
                    title={dialog.title}
                    useRawContent={dialog.useRawContent}
                    dragBoundary={this.props.dragBoundary}
                >
                    {dialog.content}
                </Dialog>
            );
        });

        return <>{dialogs}</>;
    }
    
}