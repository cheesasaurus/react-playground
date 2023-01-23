import styles from './DudeList.module.css';
import './DudeList.module.css';
import React from "react";
import { Dude, DudeMap } from "../../black-box/exposed/models";
import { DudeListItem } from "./DudeListItem";
import { DialogControlContext } from '../Dialog/DialogContext';
import { Subscriptions } from '../../utils';
import { DudeListItemCreationPending } from './DudeListItemCreationPending';
import { CrudeStore } from '../../crude-store/CrudeStore';


interface Props {
    crudeStore: CrudeStore
}


interface State {
    dudes: DudeMap;
}


export class ToDudeList extends React.Component<Props, State> {
    public static contextType = DialogControlContext;
    declare context: React.ContextType<typeof DialogControlContext>;

    private subscriptions = new Subscriptions();

    constructor(props: Props) {
        super(props);
        this.state = {
            dudes: {},
        };
    }

    public async componentDidMount(): Promise<void> {
        this.props.crudeStore.willNeedAllDudes();
        const subscription = this.props.crudeStore.subscribeSelectAllDudes((dudeMap: DudeMap) => {
            this.setState({dudes: dudeMap});
        });
        this.subscriptions.add(subscription);
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe();
    }

    private beginDudeCreation = () => this.openDudeCreationDialog();

    private resumeDudeCreation = (dudeId?: number) => this.openDudeCreationDialog(dudeId);

    private openDudeInfo = (dudeId: number) => {
        const dialogControl = this.context!;
        dialogControl.openDudeInfo(dudeId);
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
