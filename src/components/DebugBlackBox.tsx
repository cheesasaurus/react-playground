import React from "react";
import { Message, MessageHandlerHandle } from "../black-box/interface";
import { DialogContext } from "./dialog/DialogContext";


interface IProps {

}


interface IState {
    handle?: MessageHandlerHandle;
    counter: number;
}


export class DebugBlackBox extends React.Component<IProps, IState> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    constructor(props: any) {
        super(props);
        this.state = {
            counter: 0,
        };
    }

    componentDidMount() {
        const handle = window.blackBox.socket.on('testtest', this.handleTestMessage);
        this.setState({handle: handle});
    }

    componentWillUnmount() {
        if (this.state.handle) {
            window.blackBox.socket.off(this.state.handle);
        }
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

    openDebugDialog = () => {
        this.context.control.open((<>hello</>));
    };

    handleTestMessage = (message: Message) => {
        console.log(`received message from black box: ${JSON.stringify(message)}`);
    };
    
    render(): React.ReactNode {
        return (
            <>
                <button onClick={this.requestBlackBoxToEmitTestMessage}>
                    emit message from black box
                </button>
                <button onClick={this.openDebugDialog}>
                    open dialog
                </button>
            </>
        )
    }

}
