import { createModelMap, Dude, EquipmentMap, EquipmentSlots, UUID } from "../../exposed/models";
import { ActionMap } from "../../exposed/Models/Action";
import { GameDatabase } from "../db/GameDatabase";
import { DudesSnapshot } from "../models/DudesSnapshot";


export class DudeService {
    public constructor(private db: GameDatabase) {

    }

    public async findEquipmentOnDudes(dudes: Array<Dude|undefined>): Promise<EquipmentMap> {
        const equipmentIds = new Array<UUID>();
        for (const dude of dudes) {
            if (!dude) {
                continue;
            }
            for (const slot of EquipmentSlots) {
                const equipmentId = dude.equipment[slot];
                if (equipmentId) {
                    equipmentIds.push(equipmentId);
                }
            }
        }
        const equipment = await this.db.equipment.bulkGet(equipmentIds);
        return createModelMap(equipment);
    }

    public async findCurrentActions(dudes: Array<Dude|undefined>): Promise<ActionMap> {
        const actionIds = new Array<UUID>();
        for (const dude of dudes) {
            if (dude) {
                actionIds.push(dude.actionId);
            }
        }
        const actions = await this.db.actions.bulkGet(actionIds);
        return createModelMap(actions);
    }

    public async getSnapshot(dudeIds: UUID[]): Promise<DudesSnapshot> {
        const dudes = await this.db.dudes.bulkGet(dudeIds);
        return {
            dudes: createModelMap(dudes),
            equipment: await this.findEquipmentOnDudes(dudes),
            actions: await this.findCurrentActions(dudes),
        };
    }

}



