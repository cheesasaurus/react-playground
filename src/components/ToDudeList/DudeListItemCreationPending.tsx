import styles from './DudeList.module.css';
import { Dude, UUID } from "../../black-box/exposed/models";
import React from 'react';


interface Props {
    dude: Dude;
    resumeDudeCreation: (dudeId: UUID) => void;
}

interface State {

}


export class DudeListItemCreationPending extends React.Component<Props, State> {

    private onClick = () => {
        const dude = this.props.dude;
        this.props.resumeDudeCreation(dude.id);
    };

    public render(): React.ReactNode {
        const dude = this.props.dude;
        return (
            <div className={styles['dude']} onClick={this.onClick}>
                <div className={styles['dude-name']} title={dude.name}>{dude.name}</div>
                <span>Finish creating this dude</span>
            </div>
        );
    }
    
}


