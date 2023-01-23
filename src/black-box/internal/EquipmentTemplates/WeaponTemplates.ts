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
        axe: {
            id: 2,
            type: WeaponType.Axe,
            name: 'Rusty Axe',
            damage: 5,
            damageType: DamageType.pierce,
        },
        hammer: {
            id: 3,
            type: WeaponType.Hammer,
            name: 'Rusty Hammer',
            damage: 5,
            damageType: DamageType.bash,
        },
        dagger: {
            id: 4,
            type: WeaponType.Dagger,
            name: 'Rusty Sword',
            damage: 5,
            damageType: DamageType.slash,
        },
        staff: {
            id: 5,
            type: WeaponType.Staff,
            name: 'Big Stick',
            damage: 5,
            damageType: DamageType.bash,
        },
        throwing: {
            id: 6,
            type: WeaponType.Throwing,
            name: 'Stone',
            damage: 5,
            damageType: DamageType.bash,
        },
        whip: {
            id: 7,
            type: WeaponType.Whip,
            name: 'Frayed Whip',
            damage: 5,
            damageType: DamageType.bash,
        },
        bow: {
            id: 8,
            type: WeaponType.Bow,
            name: 'Practice Bow',
            damage: 5,
            damageType: DamageType.pierce,
        },
        crossbow: {
            id: 9,
            type: WeaponType.Crossbow,
            name: 'Shoddy Crossbow',
            damage: 5,
            damageType: DamageType.pierce,
        }
    }
};
