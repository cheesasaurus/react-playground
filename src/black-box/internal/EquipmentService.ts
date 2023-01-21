import { Armor, ArmorTemplate, Weapon, WeaponTemplate } from "../exposed/models";


export class EquipmentService {
    private autoIncrement = 1;
    private localStorageKey = 'db.equipment';

    public constructor() {
        this.load();
    }

    private save(): void {
        const obj = {
            autoIncrement: this.autoIncrement,
        };
        localStorage.setItem(this.localStorageKey, JSON.stringify(obj));
    }

    private load(): void {
        const saved = localStorage.getItem(this.localStorageKey);
        if (saved) {
            const obj = JSON.parse(saved);
            this.autoIncrement = obj.autoIncrement;
        }
    }

    public createWeapon(template: WeaponTemplate, crafterId: number): Weapon {
        const id = this.autoIncrement++;
        const weapon = {
            id: id,
            template: template,
            crafterId: crafterId,
        };
        this.save();
        return weapon;
    }

    public createArmor(template: ArmorTemplate, crafterId: number): Armor {
        const id = this.autoIncrement++;
        const armor = {
            id: id,
            template: template,
            crafterId: crafterId,
        };
        this.save();
        return armor;
    }

}
