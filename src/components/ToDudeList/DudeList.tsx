import styles from './DudeList.module.css';
import './DudeList.module.css';
import React from "react";
import { Dude, DudeMap } from "../../black-box/exposed/models";
import { DudeListItem } from "./DudeListItem";
import { DialogControlContext } from '../Dialog/DialogContext';
import { DudeListItemCreationPending } from './DudeListItemCreationPending';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { DudesThunks } from '../../store/slices/db/thunks/dudes';


interface Props {

}

interface InnerProps extends Props {
    dudes: DudeMap;
    loadDudes: () => void;
}


const mapStateToProps = (state: RootState, ownProps: Props) => ({
    dudes: state.db.entities.dudes,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loadDudes() {
        dispatch(DudesThunks.fetchAll());
    },
});



export const ToDudeList = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<InnerProps> {
        public static contextType = DialogControlContext;
        declare context: React.ContextType<typeof DialogControlContext>;

        public async componentDidMount(): Promise<void> {
            this.props.loadDudes();
        }

        private beginDudeCreation = () => this.openDudeCreationDialog();

        private resumeDudeCreation = (dudeId?: string) => this.openDudeCreationDialog(dudeId);

        private openDudeInfo = (dudeId: string) => {
            const dialogControl = this.context!;
            dialogControl.openDudeInfo(dudeId);
        };

        private openDudeCreationDialog(dudeId?: string): void {
            const dialogControl = this.context!;
            dialogControl.openDudeCreator(dudeId);
        }

        public render(): React.ReactNode {
            const dudes = Object.values(this.props.dudes);

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
);
