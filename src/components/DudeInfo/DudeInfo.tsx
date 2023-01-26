import styles from './DudeInfo.module.css';
import React from "react";
import { Dude, EquipmentMap, EquipmentSlot, EquipmentSlots, UUID } from "../../black-box/exposed/models";
import { EquipmentSlotEl } from './EquipmentSlot';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { DudesThunks } from '../../store/slices/db/thunks/dudes';
import { DragPayloadSendEquipmentFromDude, DragPayloadType } from '../../store/slices/dragDrop/dragPayloads';
import { dragEnded, dragStarted } from '../../store/slices/dragDrop/dragDropSlice';


interface Props {
    dudeId: UUID;
    onNameDetermined?(dudeName: string): void;
}

interface PropsInternal extends Props {
    dude: Dude|undefined;
    equipment: EquipmentMap;
    dragDrop: {
        isDragging: boolean,
        payloadType: DragPayloadType | undefined,
        payload: any,
    };
    loadDude: () => void;
    startDraggingEquipment: (slot: EquipmentSlot) => void,
    dragEnded: () => void,
}

interface ComponentState {
    equipmentDropSlot?: EquipmentSlot | undefined;
    lastNameBubbled: string;
}

const mapStateToProps = (state: RootState, props: Props) => {
    const dude = state.db.entities.dudes[props.dudeId];
    let equipment = findEquipmentOnDude(state, dude);
    return {
        dude,
        equipment,
        dragDrop: state.dragDrop,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch, props: Props) => {
    return {
        loadDude: () => dispatch(DudesThunks.fetchOneById(props.dudeId)),
        startDraggingEquipment: (slot: EquipmentSlot) => {
            dispatch(dragStarted({
                payloadType: DragPayloadType.SendEquipmentFromDude,
                payload: {
                    dudeId: props.dudeId,
                    slot: slot,
                }
            }));
        },
        dragEnded: () => dispatch(dragEnded()),
    };
};


// todo: put this somewhere
function findEquipmentOnDude(state: RootState, dude: Dude): EquipmentMap {
    const equipment: EquipmentMap = {};
    if (dude === undefined) {
        return equipment;
    }
    for (const slot of EquipmentSlots) {
        const equipmentId = dude.equipment[slot];
        if (equipmentId) {
            equipment[equipmentId] = state.db.entities.equipment[equipmentId];
        }
    }
    return equipment;
}



export const DudeInfo = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<PropsInternal, ComponentState> {

        public constructor(props: PropsInternal) {
            super(props);
            this.state = {
                equipmentDropSlot: undefined,
                lastNameBubbled: '',
            };
        }

        public componentDidMount(): void {
            this.bubbleDudeName();
            this.props.loadDude();
        }

        public componentDidUpdate(prevProps: Readonly<PropsInternal>, prevState: Readonly<ComponentState>, snapshot?: any): void {
            this.bubbleDudeName();
        }

        private bubbleDudeName(): void {
            if (!this.props.dude || !this.props.onNameDetermined) {
                return;
            }
            const name = this.props.dude.name;
            if (name !== this.state.lastNameBubbled) {
                this.setState({
                    lastNameBubbled: name,
                });
                this.props.onNameDetermined(name);
            }
        }

        private onDragEnter = (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            this.onDragOver(e);
        }

        private onDragOver = (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            if (this.props.dragDrop.payloadType === DragPayloadType.SendEquipmentFromDude) {
                const payload = this.props.dragDrop.payload as DragPayloadSendEquipmentFromDude;
                if (payload.dudeId === this.props.dudeId) {
                    return;
                }
                this.setState({
                    equipmentDropSlot: payload.slot,
                });
                e.dataTransfer.dropEffect = 'move';
            }
        }

        private onDragLeave = (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            this.setState({
                equipmentDropSlot: undefined,
            });
        }

        private onDrop = (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            this.setState({
                equipmentDropSlot: undefined,
            });

            if (this.props.dragDrop.payloadType === DragPayloadType.SendEquipmentFromDude) {
                const payload = this.props.dragDrop.payload as DragPayloadSendEquipmentFromDude;
                if (payload.dudeId !== this.props.dudeId) {
                    window.blackBox.api.dudes.swapEquipmentWithOtherDude(
                        payload.slot,
                        payload.dudeId,
                        this.props.dudeId
                    );
                }
            }
        }

        public render(): React.ReactNode {
            if (!this.props.dude) {
                return 'Loading...'
            }

            return (
                <div>
                    <div>action bar goes here</div>
                    <div>hp bar goes here</div>
                    <div>status effects bar goes here</div>
                    <section
                        className={styles['section-equipment']}
                        onDragOver={this.onDragOver}
                        onDrop={this.onDrop}
                        onDragEnter={this.onDragEnter}
                        onDragLeave={this.onDragLeave}
                    >
                        <div className={styles['equipment-left-bar']}>
                            {this.renderEquipmentSlot(EquipmentSlot.Hat)}
                            {this.renderEquipmentSlot(EquipmentSlot.Shirt)}
                            {this.renderEquipmentSlot(EquipmentSlot.Gloves)}
                            {this.renderEquipmentSlot(EquipmentSlot.Pants)}
                            {this.renderEquipmentSlot(EquipmentSlot.Boots)}
                        </div>
                        <div className={styles['equipment-right-bar']}>
                            {this.renderEquipmentSlot(EquipmentSlot.Weapon)}
                            <div className={styles['equipment-slot-spacer']}/>
                            {this.renderEquipmentSlot(EquipmentSlot.Lumberjack)}
                            {this.renderEquipmentSlot(EquipmentSlot.Mining)}
                            {this.renderEquipmentSlot(EquipmentSlot.Skinning)}
                        </div>
                    </section>
                </div>
            );
        }

        private renderEquipmentSlot(slot: EquipmentSlot) {
            const dude = this.props.dude!;
            const equipmentId = dude.equipment[slot];
            const equipment = equipmentId ? this.props.equipment[equipmentId] : undefined;
            
            return (
                <EquipmentSlotEl
                    slot={slot}
                    equipment={equipment}
                    isDropTarget={slot === this.state.equipmentDropSlot}
                    startDraggingEquipment={this.props.startDraggingEquipment}
                    onDragEnd={this.props.dragEnded}
                />
            );
        }

    }
);
