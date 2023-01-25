import React from "react";
import { Provider } from "react-redux";
import { Dude } from "../black-box/exposed/models";
import { SocketMessage, SocketMessageType } from "../black-box/interface";
import { Subscriptions } from "../utils";
import { dudesLoaded } from "./slices/db/dbSlice";
import { store } from './store';


interface Props {
    children: React.ReactNode;
}

export class StoreProvider extends React.Component<Props> {
    private subscriptions = new Subscriptions();

    constructor(props: Props) {
        super(props);
    }

    private pipeInDude = (message: SocketMessage) => {
        const dude = message.data as Dude;
        store.dispatch(dudesLoaded({
            dudes: {
                [dude.id]: dude,
            },
            equipment: {
                // todo: message should have the dude's current equipment
            },
        }));
    }

    public componentDidMount(): void {
        const subs = [
            window.blackBox.socket.on(SocketMessageType.DudeCreated, this.pipeInDude),
            window.blackBox.socket.on(SocketMessageType.DudeUpdated, this.pipeInDude),
        ];
        subs.forEach(sub => this.subscriptions.add(sub));
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe();
    }

    public render(): React.ReactNode {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        );
    }

}
