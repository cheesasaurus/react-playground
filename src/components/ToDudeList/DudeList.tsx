import styles from './DudeList.module.css';
import './DudeList.module.css';
import React from "react";
import { Dude, DudeMap } from "../../black-box/exposed/models";
import { DudeListItem } from "./DudeListItem";
import { SocketMessage, SocketMessageType } from '../../black-box/interface';
import { WorkflowCreateDude } from '../WorkflowCreateDude/WorkflowCreateDude';
import { DialogControlContext } from '../Dialog/DialogContext';
import { Subscriptions } from '../../utils';
import { DudeListItemCreationPending } from './DudeListItemCreationPending';


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
        this.subscribeToDudeCreation();
        this.subscribeToDudeUpdates();
        const response = await window.blackBox.api.dudes.getDudes();
        if (response.errors) {
            response.errors.forEach(console.error)
            return;
        }
        this.setState({dudes: response.data!});
    }

    private subscribeToDudeCreation() {
        const subscription = window.blackBox.socket.on(SocketMessageType.DudeCreated, this.pipeInDude);
        this.subscriptions.add(subscription);
    }

    private subscribeToDudeUpdates() {
        const subscription = window.blackBox.socket.on(SocketMessageType.DudeUpdated, this.pipeInDude);
        this.subscriptions.add(subscription);
    }

    private pipeInDude = (message: SocketMessage) => {
        const dude = message.data as Dude;
        this.setState({
            dudes: {
                ...this.state.dudes,
                [dude.id]: dude,
            }
        });
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe();
    }

    private beginDudeCreation = () => this.openDudeCreationDialog();

    private resumeDudeCreation = (dudeId?: number) => this.openDudeCreationDialog(dudeId);

    private openDudeInfo = (dudeId?: number) => {
        // todo: dude info
    };

    private openDudeCreationDialog(dudeId?: number): void {
        const dialogControl = this.context!;
        dialogControl.openDudeCreator(dudeId);
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
                    {dudes.map(dude => this.renderDudeListItem(dude))}
                    {dudelessMessage}
                </section>
            </div>
        );

    }
    
    private renderDudeListItem(dude: Dude): React.ReactNode {
        if (!dude.creation.completed) {
            return (
                <DudeListItemCreationPending
                    key={dude.id}
                    dude={dude}
                    resumeDudeCreation={this.resumeDudeCreation}
                />
            );
        }
        
        return (
            <DudeListItem
                key={dude.id}
                dude={dude}
                openDudeInfo={this.openDudeInfo}
            />
        );
    }

}
