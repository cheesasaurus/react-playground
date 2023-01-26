import styles from './DudeInfo.module.css';
import React, { CSSProperties } from "react";
import { Equipment, EquipmentSlot } from '../../black-box/exposed/models';
import { DragDropCommands } from '../../DragDropCommands';
import { EquipmentTemplateLookup } from '../../black-box/internal/EquipmentTemplates/EquipmentTemplateLookup';


interface Props {
    dudeId: string;
    equipment: Equipment|undefined,
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
        DragDropCommands.sendEquipmentFromDude()
            .setEquipmentSlot(this.props.slot)
            .setDude(this.props.dudeId)
            .attachPayloadTo(e);
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
                onDragStart={this.dragStart}
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