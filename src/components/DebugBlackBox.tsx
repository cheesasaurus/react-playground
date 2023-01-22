import React from "react";
import { SocketMessage } from "../black-box/interface";
import { Subscription, Subscriptions } from "../utils";
import { DialogControlContext } from "./Dialog/DialogContext";
import { ToDudeList } from "./ToDudeList/DudeList";
import { Workflow } from "./Workflow/Workflow";


interface IProps {

}


interface IState {
    counter: number;
}


export class DebugBlackBox extends React.Component<IProps, IState> {
    public static contextType = DialogControlContext;
    declare context: React.ContextType<typeof DialogControlContext>;

    private subscriptions = new Subscriptions();

    constructor(props: any) {
        super(props);
        this.state = {
            counter: 0,
        };
    }

    componentDidMount() {
        const subscription = window.blackBox.socket.on('testtest', this.handleTestMessage);
        this.subscriptions.add(subscription);
    }

    componentWillUnmount() {
        this.subscriptions.unsubscribe();
    }

    requestBlackBoxToEmitTestMessage = () => {
        window.blackBox.api.debug.emitMessageFromBlackBox({
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
    
    render(): React.ReactNode {
        return (
            <>
                <button onClick={this.requestBlackBoxToEmitTestMessage}>
                    emit message from black box
                </button>
                <button onClick={this.openDebugDialogA}>
                    open dialog A
                </button>
                <button onClick={this.openDebugDialogB}>
                    open dialog B
                </button>
            </>
        )
    }

}
