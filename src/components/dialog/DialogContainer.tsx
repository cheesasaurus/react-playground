import React, { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { DialogContext } from "./DialogContext";


interface Props {

}

interface State {
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
            activeDialogs: {},
        };
    }

    public componentDidMount(): void {
        this.context.control.onOpenRequested((dialogId, title, jsx) => {
            const dialog = {
                id: dialogId,
                title: title,
                content: jsx,
            };
            this.setState({
                activeDialogs: {
                    ...this.state.activeDialogs,
                    [dialog.id]: dialog,
                },
            });
        });

        this.context.control.onCloseRequested((dialogId) => {
            const copy = {...this.state.activeDialogs};
            delete copy[dialogId];
            this.setState({
                activeDialogs: copy,
            })
        });
    }

    public componentWillUnmount(): void {
        this.context.control.onOpenRequested(undefined);
        this.context.control.onCloseRequested(undefined);
    }

    public render(): React.ReactNode {
        const dialogs = Object.values(this.state.activeDialogs)
            .map((dialog) => (
                <Dialog
                    key={dialog.id}
                    id={dialog.id}
                    title={dialog.title}
                >
                    {dialog.content}
                </Dialog>
            ));

        return <>{dialogs}</>;
    }
    
}