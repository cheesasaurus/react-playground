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
            <div className={styles['equipment-slot']}>
                <div>{this.renderHintIcon()}</div>
                {this.props.dude.equipment[this.props.slot]?.template.name}
            </div>
        );
    }

    private renderHintIcon(): React.ReactNode {
        switch (this.props.slot) {
            case EquipmentSlot.Weapon:
                return '⚔';
            case EquipmentSlot.Hat:
                return '🎩';
            case EquipmentSlot.Shirt:
                return '👕';
            case EquipmentSlot.Gloves:
                return '🧤';
            case EquipmentSlot.Pants:
                return '👖';
            case EquipmentSlot.Boots:
                return '🧦';
            case EquipmentSlot.Lumberjack:
                return '🪓';
            case EquipmentSlot.Mining:
                return '⛏';
            case EquipmentSlot.Skinning:
                return '🔪';
        }
    }

}