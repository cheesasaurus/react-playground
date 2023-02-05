import { DudeMap, EquipmentMap } from "../../exposed/models";
import { ActionMap } from "../../exposed/Models/Action";

export interface DudesSnapshot {
    dudes: DudeMap;
    equipment: EquipmentMap;
    actions: ActionMap;
}
