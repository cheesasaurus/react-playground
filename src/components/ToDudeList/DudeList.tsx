import styles from './DudeList.module.css';
import './DudeList.module.css';
import React from "react";
import { Dude, DudeMap } from "../../black-box/exposed/models";
import { DudeListItem } from "./DudeListItem";
import { SocketMessageType } from '../../black-box/interface';
import { WorkflowCreateDude } from '../WorkflowCreateDude/WorkflowCreateDude';
import { DialogControlContext } from '../Dialog/DialogContext';
import { Subscription, Subscriptions } from '../../utils';


interface Props {

}


interface State {
    dudes: DudeMap;
    pendingDudeName: string;
    creatingDude: boolean;
}


export class ToDudeList extends React.Component<Props, State> {
    public static contextType = DialogControlContext;
    declare context: React.ContextType<typeof DialogControlContext>;

    private subscriptions = new Subscriptions();

    constructor(props: Props) {
        super(props);
        this.state = {
            dudes: {},
            pendingDudeName: '',
            creatingDude: false,
        };
    }

    public async componentDidMount(): Promise<void> {
        const subscription = window.blackBox.socket.on(SocketMessageType.DudeCreated, (message) => {
            const dude = message.data as Dude;
            this.setState({
                dudes: {
                    ...this.state.dudes,
                    [dude.id]: dude,
                }
            });
        });
        this.subscriptions.add(subscription);
        const response = await window.blackBox.api.dudes.getDudes();
        if (response.errors) {
            response.errors.forEach(console.error)
            return;
        }
        this.setState({dudes: response.data!});
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe();
    }

    private beginDudeCreation = () => this.openDudeCreationDialog();

    private resumeDudeCreation = (dudeId?: number) => this.openDudeCreationDialog(dudeId);

    private openDudeCreationDialog(dudeId?: number): void {
        const dialogControl = this.context!;
        const dialogId = 'WorkflowCreateDude';
        const onWorkflowCompleted = () => {
            dialogControl.close(dialogId);
        };
        const content = (
            <WorkflowCreateDude
                onWorkflowCompleted={onWorkflowCompleted}
                dudeId={dudeId}
            />
        );
        dialogControl.open(dialogId, content, {
            title: 'Create a Dude',
            useRawContent: true,
        });
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
                        <button onClick={this.beginDudeCreation}>
                            Create Dude
                        </button>
                    </div>
                </header>
                <section className={styles['dude-list']}>
                    {dudes.map(dude => (
                        <DudeListItem
                            key={dude.id}
                            dude={dude}
                            resumeDudeCreation={this.resumeDudeCreation}
                        />
                    ))}
                    {dudelessMessage}
                </section>
            </div>
        );
    }
}
