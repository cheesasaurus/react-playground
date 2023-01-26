import styles from './DudeInfo.module.css';
import React, { CSSProperties } from "react";
import { Equipment, EquipmentSlot } from '../../black-box/exposed/models';
import { EquipmentTemplateLookup } from '../../black-box/internal/EquipmentTemplates/EquipmentTemplateLookup';


interface Props {
    equipment: Equipment|undefined,
    slot: EquipmentSlot;
    isDropTarget: boolean;
    startDraggingEquipment: (slot: EquipmentSlot) => void,
    onDragEnd: () => void,
}

interface State {

}


export class EquipmentSlotEl extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    private onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        this.props.startDraggingEquipment(this.props.slot);
    };

    private onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        this.props.onDragEnd();
    };

    public render(): React.ReactNode {
        const cssStyles: CSSProperties = {

        };
        if (this.props.isDropTarget) {
            cssStyles.borderColor = 'gold';
        }

        const equipment = this.props.equipment;
        const template = equipment ? EquipmentTemplateLookup[equipment.templateId]: undefined;

        return (
            <div
                className={styles['equipment-slot']} style={cssStyles}
                draggable
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                <div>{this.renderHintIcon()}</div>
                {template?.name}
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