import styles from './DudeList.module.css';
import { Dude, UUID } from "../../black-box/exposed/models";
import { HitPoints } from './HitPoints';
import React from 'react';
import { Action } from '../../black-box/exposed/Models/Action';
import { SimulationState } from '../../store/slices/simulation/simulationSlice';
import { ActionMeter } from '../ActionMeter/ActionMeter';


interface Props {
    dude: Dude;
    action: Action;
    simulation: SimulationState;
    openDudeInfo: (dudeId: UUID) => void;
}

interface State {

}


export class DudeListItem extends React.Component<Props, State> {

    onClick = () => {
        this.props.openDudeInfo(this.props.dude.id);
    };

    public render(): React.ReactNode {
        const dude = this.props.dude;
        return (
            <div className={styles['dude']} onClick={this.onClick}>
                <div className={styles['dude-name']} title={dude.name}>{dude.name}</div>
                <div className={styles['dude-hp']}>
                    <HitPoints hp={dude.hp}></HitPoints>
                </div>
                <ActionMeter
                    action={this.props.action}
                    simulation={this.props.simulation}
                />
            </div>
        );
    }
    
}


