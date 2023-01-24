import { ArmorTemplate, Equipment, EquipmentSlot, EquipmentType, WeaponTemplate } from "../exposed/models";


export class EquipmentService {
    private localStorageKey = 'db.equipment';

    public constructor() {
        this.load();
    }

    private save(): void {
        const obj = {
            
        };
        localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    }

    private load(): void {
        const saved = localStorage.getItem(this.localStorageKey);
        if (saved) {
            const obj = JSON.parse(saved);
            
        }
    }

    public createWeapon(template: WeaponTemplate, crafterId?: number): Equipment {
        const id = window.crypto.randomUUID();
        const weapon = {
            id: id,
            type: EquipmentType.Weapon,
            slot: EquipmentSlot.Weapon,
            template: template,
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
            template: template,
            crafterId: crafterId,
        };
        this.save();
        return armor;
    }

}
