import styles from './DudeInfo.module.css';
import React, { CSSProperties } from "react";
import { Dude, EquipmentSlot } from '../../black-box/exposed/models';


interface Props {
    dude: Dude;
    slot: EquipmentSlot;
    isDropTarget: boolean;
}

interface State {

}


export class EquipmentSlotEl extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    private dragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            command: 'SwapEquipmentWithOtherDude',
            dudeId: this.props.dude.id,
            slot: this.props.slot,
        }));
    };

    public render(): React.ReactNode {
        const cssStyles: CSSProperties = {

        };
        if (this.props.isDropTarget) {
            cssStyles.borderColor = 'gold';
        }

        return (
            <div
                className={styles['equipment-slot']} style={cssStyles}
                draggable
                onDragStart={this.dragStart}
            >
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