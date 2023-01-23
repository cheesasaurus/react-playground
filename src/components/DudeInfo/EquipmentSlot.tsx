import styles from './DudeInfo.module.css';
import React from "react";
import { Dude, EquipmentSlot } from '../../black-box/exposed/models';


interface Props {
    dude: Dude;
    slot: EquipmentSlot;
}

interface State {

}


export class EquipmentSlotEl extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    public render(): React.ReactNode {
        return (
            <div className={styles['equipment-slot']}></div>
        );
    }

}