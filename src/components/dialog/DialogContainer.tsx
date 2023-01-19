import React, { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { DialogContext } from "./DialogContext";


interface Props {

}

interface State {
    order: Array<string>;
    activeDialogs: {
        [dialogId: string]: {
            id: string,
            title: string|undefined,
            content: ReactNode,
        }
    }
    
}


export class DialogContainer extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    public constructor(props: Props) {
        super(props);
        this.state = {
            order: [],
            activeDialogs: {},
        };
    }

    public componentDidMount(): void {
        this.context.control.onOpenRequested((dialogId, title, jsx) => {
            this.setState({
                order: this.newOrder(dialogId),
                activeDialogs: {
                    ...this.state.activeDialogs,
                    [dialogId]: {
                        id: dialogId,
                        title: title,
                        content: jsx,
                    },
                },
            });
        });

        this.context.control.onCloseRequested((dialogId) => {
            const copy = {...this.state.activeDialogs};
            delete copy[dialogId];
            this.setState({
                order: this.state.order.filter(id => id !== dialogId),
                activeDialogs: copy,
            })
        });

        this.context.control.onBringToFrontRequested((dialogId) => {
            if (!(dialogId in this.state.activeDialogs)) {
                console.warn(`Attempted to bringToFront the nonexistent dialog#${dialogId}`);
                return;
            }
            this.setState({
                order: this.newOrder(dialogId),
            });
        });
    }

    private newOrder(frontmostDialogId: string) {
        const newOrder = this.state.order.filter(id => id !== frontmostDialogId);
        newOrder.push(frontmostDialogId);
        return newOrder;
    };

    public componentWillUnmount(): void {
        this.context.control.onOpenRequested(undefined);
        this.context.control.onCloseRequested(undefined);
        this.context.control.onBringToFrontRequested(undefined);
    }

    public render(): React.ReactNode {
        const dialogs = this.state.order.map(dialogId => {
            const dialog = this.state.activeDialogs[dialogId];
            return (
                <Dialog
                    key={dialog.id}
                    id={dialog.id}
                    title={dialog.title}
                >
                    {dialog.content}
                </Dialog>
            );
        });

        return <>{dialogs}</>;
    }
    
}