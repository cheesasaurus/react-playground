import React from "react";
import { Provider } from "react-redux";
import { SocketMessage, SocketMessageDataDudes, SocketMessageType } from "../black-box/interface";
import { Subscriptions } from "../utils";
import { dudesPipedIn } from "./slices/db/dbSlice";
import { store } from './store';


interface Props {
    children: React.ReactNode;
}

export class StoreProvider extends React.Component<Props> {
    private subscriptions = new Subscriptions();

    private pipeInDudes = (message: SocketMessage) => {
        const data = message.data as SocketMessageDataDudes;
        store.dispatch(dudesPipedIn(data));
    }

    public componentDidMount(): void {
        const subs = [
            window.blackBox.socket.on(SocketMessageType.DudesCreated, this.pipeInDudes),
            window.blackBox.socket.on(SocketMessageType.DudesUpdated, this.pipeInDudes),
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
