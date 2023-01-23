import styles from './DudeInfo.module.css';
import React from "react";
import { Dude, EquipmentSlot } from "../../black-box/exposed/models";
import { EquipmentSlotEl } from './EquipmentSlot';
import { CrudeStore } from '../../crude-store/CrudeStore';
import { Subscriptions } from '../../utils';
import { DragDropCommands, DragDropCommandTypes } from '../../DragDropCommands';


interface Props {
    dudeId: number,
    crudeStore: CrudeStore,
    onNameDetermined?(dudeName: string): void,
}

interface State {
    dude?: Dude,
    equipmentDropSlot?: EquipmentSlot | undefined;
}


export class DudeInfo extends React.Component<Props, State> {
    private subscriptions = new Subscriptions();

    public constructor(props: Props) {
        super(props);
        this.state = {
            dude: undefined,
            equipmentDropSlot: undefined,
        };
    }

    public componentDidMount(): void {
        this.props.crudeStore.willNeedDude(this.props.dudeId);
        const subscription = this.props.crudeStore.subscribeSelectDude(this.props.dudeId, (dude: Dude) => {
            this.setState({
                dude: dude,
            });

            if (this.props.onNameDetermined) {
                this.props.onNameDetermined(dude.name);
            }
        });
        this.subscriptions.add(subscription);
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe();
    }

    private onDragEnter = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        this.onDragOver(e);
    }

    private onDragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const dat = JSON.parse(e.dataTransfer.getData('application/json'));
        if (dat?.command === DragDropCommandTypes.SendEquipmentFromDude) {
            if (dat.dudeId === this.props.dudeId) {
                return;
            }
            this.setState({
                equipmentDropSlot: dat.slot,
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

        const dat = JSON.parse(e.dataTransfer.getData('application/json'));
        if (dat?.command === DragDropCommandTypes.SendEquipmentFromDude) {
            DragDropCommands.sendEquipmentFromDude()
                .fromPayload(dat)
                .toOtherDude(this.props.dudeId)
                .execute();
        }
    }


    public render(): React.ReactNode {
        if (!this.state.dude) {
            return <>{'Loading...'}</>
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
        return (
            <EquipmentSlotEl
                slot={slot}
                dude={this.state.dude!}
                isDropTarget={slot === this.state.equipmentDropSlot}
            />
        );
    }

}
