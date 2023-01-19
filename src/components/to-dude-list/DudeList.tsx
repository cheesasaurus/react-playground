import styles from './DudeList.module.css';
import './DudeList.module.css';
import React, { ChangeEvent, KeyboardEvent } from "react";
import { Dude, DudeMap } from "../../black-box/models";
import { DudeListItem } from "./DudeListItem";


interface Props {

}


interface State {
    dudes: DudeMap;
    pendingDudeName: string;
    creatingDude: boolean;
}


export class ToDudeList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            dudes: {},
            pendingDudeName: '',
            creatingDude: false,
        };
    }

    public async componentDidMount(): Promise<void> {
        const response = await window.blackBox.api.dudes.getDudes();
        if (response.errors) {
            response.errors.forEach(console.error)
            return;
        }
        this.setState({dudes: response.data!});
    }
    
    private pendingDudeNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({pendingDudeName: e.target.value});
    };

    private nameFillerKeyPressed = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            this.createDude();
        }
    };

    private createDude = () => {
        this.setState({creatingDude: true});
        window.blackBox.api.dudes.createDude(this.state.pendingDudeName)
            .then((result) => {
                this.setState({creatingDude: false});
                if (result.errors) {
                    console.warn(result.errors);
                    // todo: error message(s)
                    // going to move dude creation workflow to a popup so don't bother with it now
                }
                else {
                    const dude = result.data!;
                    this.setState({
                        pendingDudeName: '',
                        dudes: {
                            ...this.state.dudes,
                            [dude.id]: dude,
                        }
                    });
                }
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
                        <label>
                            name: <input
                                type='text'
                                value={this.state.pendingDudeName}
                                onChange={this.pendingDudeNameChanged}
                                onKeyDown={this.nameFillerKeyPressed}
                            />
                        </label>
                        <button onClick={this.createDude} disabled={this.state.creatingDude}>
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
