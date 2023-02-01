import React from "react";
import { SocketMessage } from "../black-box/interface";
import { Subscriptions } from "../utils";
import { DialogControlContext } from "./Dialog/DialogContext";


interface IProps {

}


interface IState {
    counter: number;
    simulationPaused: boolean;
    simulationRequestPending: boolean;
}


export class DebugBlackBox extends React.Component<IProps, IState> {
    public static contextType = DialogControlContext;
    declare context: React.ContextType<typeof DialogControlContext>;

    private subscriptions = new Subscriptions();
    private exampleWorker: Worker | undefined;

    constructor(props: any) {
        super(props);
        this.state = {
            counter: 0,
            simulationPaused: true,
            simulationRequestPending: false,
        };
    }

    componentDidMount() {
        const subscription = window.blackBox.socket.on('testtest', this.handleTestMessage);
        this.subscriptions.add(subscription);

        this.exampleWorker = new Worker(new URL('../black-box/internal/workers/dedicated/example.ts', import.meta.url));
        this.exampleWorker.onmessage = (message) => {
            console.log('received message from worker:', message);
        }
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
        this.exampleWorker?.terminate();
    }

    requestBlackBoxToEmitTestMessage = () => {
        window.blackBox.api.debug.emitMessageFromBlackBox({
            id: crypto.randomUUID(),
            type: 'testtest',
            data: {
                cheese: 'cheddar',
                number: this.state.counter,
            }
        });
        this.setState({counter: this.state.counter + 1});
    };

    openDebugDialogA = () => {
        const content = <div style={{width: '1000px', height: '500px'}}>AAAAA</div>
        this.context!.open('DebugA', content, {
            title: 'This is dialog A',
        });
    };

    openDebugDialogB = () => {
        this.context!.open('DebugB', <>BBBBBBB</>, {
            title: 'This is dialog B',
        });
    };

    handleTestMessage = (message: SocketMessage) => {
        console.log(`received message from black box: ${JSON.stringify(message)}`);
    };

    pingWorker = () => {
        this.exampleWorker?.postMessage('ping');
    };

    simulationPlay = async () => {
        this.setState({
            simulationRequestPending: true,
        });
        await window.blackBox.api.simulation.play();
        this.setState({
            simulationRequestPending: false,
            simulationPaused: false,
        });
    };

    simulationPause = async () => {
        this.setState({
            simulationRequestPending: true,
        });
        await window.blackBox.api.simulation.pause();
        this.setState({
            simulationRequestPending: false,
            simulationPaused: true,
        });
    }
    
    render(): React.ReactNode {
        const disablePlayBtn = this.state.simulationRequestPending || !this.state.simulationPaused;
        const disablePauseBtn = this.state.simulationRequestPending || this.state.simulationPaused;

        return (
            <>
                <button onClick={this.requestBlackBoxToEmitTestMessage}>
                    emit message from black box
                </button>
                <button onClick={this.pingWorker}>
                    ping worker
                </button>
                <button onClick={this.openDebugDialogA}>
                    open dialog A
                </button>
                <button onClick={this.openDebugDialogB}>
                    open dialog B
                </button>
                <button onClick={this.simulationPlay} disabled={disablePlayBtn}>
                    simulation: play
                </button>
                <button onClick={this.simulationPause} disabled={disablePauseBtn}>
                    simulation: pause
                </button>
            </>
        )
    }

}
