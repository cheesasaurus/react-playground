import { EquipmentSlot, UUID } from "../../../black-box/exposed/models";


export enum DragPayloadType {
    SendEquipmentFromDude = 'SendEquipmentFromDude',
}


export interface DragPayloadSendEquipmentFromDude {
    dudeId: UUID,
    slot: EquipmentSlot,
}
