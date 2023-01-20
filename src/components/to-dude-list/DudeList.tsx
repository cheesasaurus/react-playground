import styles from './DudeList.module.css';
import './DudeList.module.css';
import React from "react";
import { Dude, DudeMap } from "../../black-box/models";
import { DudeListItem } from "./DudeListItem";
import { SocketMessageHandlerHandle, SocketMessageType } from '../../black-box/interface';
import { WorkflowCreateDude } from '../workflow-create-dude/WorkflowCreateDude';
import { DialogContext } from '../dialog/DialogContext';


interface Props {

}


interface State {
    dudes: DudeMap;
    pendingDudeName: string;
    creatingDude: boolean;
}


export class ToDudeList extends React.Component<Props, State> {
    public static contextType = DialogContext;
    declare context: React.ContextType<typeof DialogContext>;

    private socketHandles = Array<SocketMessageHandlerHandle>();

    constructor(props: Props) {
        super(props);
        this.state = {
            dudes: {},
            pendingDudeName: '',
            creatingDude: false,
        };
    }

    public async componentDidMount(): Promise<void> {
        const handle = window.blackBox.socket.on(SocketMessageType.DudeCreated, (message) => {
            const dude = message.data as Dude;
            this.setState({
                dudes: {
                    ...this.state.dudes,
                    [dude.id]: dude,
                }
            });
        });
        this.socketHandles.push(handle);
        const response = await window.blackBox.api.dudes.getDudes();
        if (response.errors) {
            response.errors.forEach(console.error)
            return;
        }
        this.setState({dudes: response.data!});
    }

    public componentWillUnmount(): void {
        for (const handle of this.socketHandles) {
            window.blackBox.socket.off(handle);
        }
        this.socketHandles = [];
    }

    private createDude = () => {
        const dialogControl = this.context.control!;
        const dialogId = 'WorkflowCreateDude';
        const onWorkflowCompleted = () => {
            dialogControl.close(dialogId);
        };
        const content = <WorkflowCreateDude onWorkflowCompleted={onWorkflowCompleted}></WorkflowCreateDude>;
        dialogControl.open(dialogId, 'Create a Dude', content, true);
    }

    public render(): React.ReactNode {
        const dudes = Object.values(this.state.dudes);

        let dudelessMessage;
        if (dudes.length === 0) {
            dudelessMessage = (
                <div className={styles['dudeless']}>
                    <span>You don't have any dudes yet.</span>
                </div>
            );
        }

        return (
            <div className={styles['container']}>
                <header className={styles['header']}>
                    <div style={{fontSize: '30px', fontWeight: 'bold'}}>My Dudes</div>
                    <div>
                        <button onClick={this.createDude}>
                            Create Dude
                        </button>
                    </div>
                </header>
                <section className={styles['dude-list']}>
                    {dudes.map(dude => <DudeListItem key={dude.id} dude={dude}/>)}
                    {dudelessMessage}
                </section>
            </div>
        );
    }
}
