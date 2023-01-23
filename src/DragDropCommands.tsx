import { Dude, EquipmentSlot } from "./black-box/exposed/models";


export enum DragDropCommandTypes {
    SwapEquipmentWithOtherDude = 'SwapEquipmentWithOtherDude',
};


function swapEquipmentWithOtherDude() {
    return {
        setEquipmentSlot: (slot: EquipmentSlot) => ({
            setFirstDude: (dudeId: number) => ({
                attachPayloadTo(e: React.DragEvent<HTMLElement>) {
                    const payload = JSON.stringify({
                        command: DragDropCommandTypes.SwapEquipmentWithOtherDude,
                        dudeId: dudeId,
                        slot: slot,
                    });
                    e.dataTransfer.setData('application/json', payload);
                },
            }),
        }),
        fromPayload: (payload: any) => ({
            setOtherDude: (otherDudeId: number) => ({
                execute() {
                    if (payload.dudeId === otherDudeId) {
                        return;
                    }
                    window.blackBox.api.dudes.swapEquipmentWithOtherDude(
                        payload.slot,
                        payload.dudeId,
                        otherDudeId
                    );
                },
            }),
        }),
    };
}


export const DragDropCommands = {
    swapEquipmentWithOtherDude: swapEquipmentWithOtherDude,
};
