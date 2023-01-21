import React from "react";
import { SocketMessage, SocketMessageHandlerHandle } from "../black-box/interface";
import { DialogContext } from "./Dialog/DialogContext";
import { ToDudeList } from "./ToDudeList/DudeList";
import { Workflow } from "./Workflow/Workflow";


interface IProps {

}


interface IState {
    handle?: SocketMessageHandlerHandle;
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

    openDebugDialogA = () => {
        const content = <div style={{width: '1000px', height: '500px'}}>AAAAA</div>
        this.context.control!.open('DebugA', 'This is a Dialog', content);
    };

    openDebugDialogB = () => {
        this.context.control!.open('DebugB', 'This is a Dialog', <>BBBBBBB</>);
    };

    openWorkflowInDialog = () => {
        const nav = {
            prev: {
                visible: true,
                disabled: false,
                text: 'Back',
                onPressed: () => console.log('pressed prev'),
            },
            next: {
                visible: true,
                disabled: false,
                text: 'Next',
                onPressed: () => console.log('pressed next')
            },
        };
        const bingbong = {
            backgroundColor: 'magenta',
            width: '1000px',
            height: '1000px',
        };
        const workflow = (
            <Workflow nav={nav}>
                <p>Hi hello howdy</p>
                <div style={bingbong}>
                    bing bong bing bing bong
                </div>
            </Workflow>
        );
        this.context.control!.open('DebugWorkflow', 'This is a Dialog', workflow, true);
    };

    openDudesInDialog = () => {
        const content = <ToDudeList></ToDudeList>
        this.context.control!.open('DebugDudes', 'This is a Dialog', content, true);
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
                <button onClick={this.openWorkflowInDialog}>
                    open workflow A
                </button>
                <button onClick={this.openDudesInDialog}>
                    dudes in dialog
                </button>
            </>
        )
    }

}
