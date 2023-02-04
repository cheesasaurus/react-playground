import React from "react";
import { Provider } from "react-redux";
import { SocketMessage, SocketMessageDataDudes, SocketMessageDataSimulation, SocketMessageType } from "../black-box/interface";
import { Subscriptions } from "../utils";
import { dudesPipedIn } from "./slices/db/dbSlice";
import { simulationUpdated } from "./slices/simulation/simulationSlice";
import { SimulationThunks } from "./slices/simulation/SimulationThunks";
import { store } from './store';


interface Props {
    children: React.ReactNode;
}

export class StoreProvider extends React.Component<Props> {
    private subscriptions = new Subscriptions();

    public componentDidMount(): void {
        const subs = [
            window.blackBox.socket.on(SocketMessageType.DudesCreated, this.pipeInDudes),
            window.blackBox.socket.on(SocketMessageType.DudesUpdated, this.pipeInDudes),
            window.blackBox.socket.on(SocketMessageType.SimulationStatus, this.pipeInSimulationStatus),
        ];
        subs.forEach(sub => this.subscriptions.add(sub));

        store.dispatch(SimulationThunks.fetchData());
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

    private pipeInDudes = (message: SocketMessage) => {
        const data = message.data as SocketMessageDataDudes;
        store.dispatch(dudesPipedIn(data));
    }

    private pipeInSimulationStatus = (message: SocketMessage) => {
        const data = message.data as SocketMessageDataSimulation;
        store.dispatch(simulationUpdated(data.simulation));
    }

}
