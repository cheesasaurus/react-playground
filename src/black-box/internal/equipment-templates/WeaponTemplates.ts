import { DamageType, WeaponType } from "../../exposed/models";

export const WeaponTemplates = {
    starterSet: {
        idRange: [1, 100],
        sword: {
            id: 1,
            type: WeaponType.Sword,
            name: 'Rusty Sword',
            damage: 5,
            damageType: DamageType.slash,
        },
        bow: {
            id: 2,
            type: WeaponType.Bow,
            name: 'Practice Bow',
            damage: 5,
            damageType: DamageType.pierce,
        },
        staff: {
            id: 3,
            type: WeaponType.Staff,
            name: 'Big stick',
            damage: 5,
            damageType: DamageType.bash,
        }
    }
};
