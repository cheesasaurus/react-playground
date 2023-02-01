import { ArmorTemplate, Equipment, EquipmentSlot, EquipmentType, UUID, WeaponTemplate } from "../exposed/models";
import { GameDatabase } from "./db/GameDatabase";


export class EquipmentService {
    private db: GameDatabase;

    public constructor(db: GameDatabase) {
        this.db = db;
    }

    public async createWeapon(template: WeaponTemplate, crafterId?: number): Promise<Equipment> {
        const weapon = {
            id: window.crypto.randomUUID(),
            type: EquipmentType.Weapon,
            slot: EquipmentSlot.Weapon,
            templateId: template.id,
            crafterId: crafterId,
        };
        this.db.equipment.add(weapon);
        return weapon;
    }

    public async createArmor(template: ArmorTemplate, crafterId?: number): Promise<Equipment> {
        const armor = {
            id: window.crypto.randomUUID(),
            type: EquipmentType.Armor,
            slot: template.slot,
            templateId: template.id,
            crafterId: crafterId,
        };
        this.db.equipment.add(armor);
        return armor;
    }

    public async getSingleEquipment(id: UUID): Promise<Equipment|undefined> {
        return this.db.equipment.get(id);
    }

}
