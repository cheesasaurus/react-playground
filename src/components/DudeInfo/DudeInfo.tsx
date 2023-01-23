import styles from './DudeInfo.module.css';
import React from "react";
import { Dude, EquipmentSlot } from "../../black-box/exposed/models";
import { EquipmentSlotEl } from './EquipmentSlot';


interface Props {
    dudeId: number,
    onNameDetermined?(dudeName: string): void,
}

interface State {
    dude?: Dude,
}


export class DudeInfo extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.state = {
            dude: undefined,
        };
    }

    public componentDidMount(): void {
        window.blackBox.api.dudes.getDude(this.props.dudeId).then(response => {
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            const dude = response.data!;
            this.setState({
                dude: dude,
            });

            if (this.props.onNameDetermined) {
                this.props.onNameDetermined(dude.name);
            }
        });
    }


    public render(): React.ReactNode {
        if (!this.state.dude) {
            return <>{'Loading...'}</>
        }
        const dude = this.state.dude;
        return (
            <div>
                <div>action bar goes here</div>
                <div>hp bar goes here</div>
                <div>status effects bar goes here</div>
                <section className={styles['section-equipment']}>
                    <div className={styles['equipment-left-bar']}>
                        <EquipmentSlotEl slot={EquipmentSlot.Hat} dude={dude}/>
                        <EquipmentSlotEl slot={EquipmentSlot.Shirt} dude={dude}/>
                        <EquipmentSlotEl slot={EquipmentSlot.Gloves} dude={dude}/>
                        <EquipmentSlotEl slot={EquipmentSlot.Pants} dude={dude}/>
                        <EquipmentSlotEl slot={EquipmentSlot.Boots} dude={dude}/>
                    </div>
                    <div className={styles['equipment-right-bar']}>
                        <EquipmentSlotEl slot={EquipmentSlot.Weapon} dude={dude}/>
                        <div className={styles['equipment-slot-spacer']}/>
                        <EquipmentSlotEl slot={EquipmentSlot.Lumberjack} dude={dude}/>
                        <EquipmentSlotEl slot={EquipmentSlot.Mining} dude={dude}/>
                        <EquipmentSlotEl slot={EquipmentSlot.Skinning} dude={dude}/>
                    </div>
                </section>
            </div>
        );
    }

}
