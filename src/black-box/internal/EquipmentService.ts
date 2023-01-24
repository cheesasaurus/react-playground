import { ArmorTemplate, Equipment, EquipmentSlot, EquipmentType, WeaponTemplate } from "../exposed/models";


export class EquipmentService {
    private localStorageKey = 'db.equipment';
    private entries = {};

    public constructor() {
        this.load();
    }

    private save(): void {
        const obj = {
            entries: this.entries,
        };
        localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    }

    private load(): void {
        const saved = localStorage.getItem(this.localStorageKey);
        if (saved) {
            const obj = JSON.parse(saved);
            this.entries = obj.entries;
        }
    }

    public createWeapon(template: WeaponTemplate, crafterId?: number): Equipment {
        const id = window.crypto.randomUUID();
        const weapon = {
            id: id,
            type: EquipmentType.Weapon,
            slot: EquipmentSlot.Weapon,
            templateId: template.id,
            crafterId: crafterId,
        };
        this.save();
        return weapon;
    }

    public createArmor(template: ArmorTemplate, crafterId?: number): Equipment {
        const id = window.crypto.randomUUID();
        const armor = {
            id: id,
            type: EquipmentType.Armor,
            slot: template.slot,
            templateId: template.id,
            crafterId: crafterId,
        };
        this.save();
        return armor;
    }

}
