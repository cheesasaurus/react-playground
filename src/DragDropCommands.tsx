import { EquipmentSlot } from "./black-box/exposed/models";


export enum DragDropCommandTypes {
    SendEquipmentFromDude = 'SendEquipmentFromDude',
};


function sendEquipmentFromDude() {
    return {
        setEquipmentSlot: (slot: EquipmentSlot) => ({
            setDude: (dudeId: string) => ({
                attachPayloadTo(e: React.DragEvent<HTMLElement>) {
                    const payload = JSON.stringify({
                        command: DragDropCommandTypes.SendEquipmentFromDude,
                        dudeId: dudeId,
                        slot: slot,
                    });
                    e.dataTransfer.setData('application/json', payload);
                },
            }),
        }),
        fromPayload: (payload: any) => ({
            toOtherDude: (otherDudeId: string) => ({
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
    sendEquipmentFromDude: sendEquipmentFromDude,
};
