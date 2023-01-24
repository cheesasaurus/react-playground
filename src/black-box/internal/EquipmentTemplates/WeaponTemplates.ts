import { DamageType, WeaponTemplate, WeaponType } from "../../exposed/models";


interface IWeaponTemplates {
    [setName: string]: {
        [ezKey: string]: WeaponTemplate;
    }
}

export const WeaponTemplates: IWeaponTemplates = {
    starterSet: {
        sword: {
            id: 'a3e59fb6-cd6c-4f1a-b2cf-4f21749770e2',
            type: WeaponType.Sword,
            name: 'Rusty Sword',
            damage: 5,
            damageType: DamageType.slash,
        },
        axe: {
            id: '1ffb3460-6b1a-49da-87e0-847a421d7c5e',
            type: WeaponType.Axe,
            name: 'Rusty Axe',
            damage: 5,
            damageType: DamageType.pierce,
        },
        hammer: {
            id: '2dadc767-dab3-4f2d-9d1a-ef1d1b0ed677',
            type: WeaponType.Hammer,
            name: 'Rusty Hammer',
            damage: 5,
            damageType: DamageType.bash,
        },
        dagger: {
            id: 'b914ce4c-dc8a-47bc-9edc-9aa7471c6a52',
            type: WeaponType.Dagger,
            name: 'Rusty Sword',
            damage: 5,
            damageType: DamageType.slash,
        },
        staff: {
            id: 'db90eff3-bac8-42d7-a650-6f51865862c0',
            type: WeaponType.Staff,
            name: 'Big Stick',
            damage: 5,
            damageType: DamageType.bash,
        },
        throwing: {
            id: '0c5666d0-2d00-4318-99be-b6f3414a4cea',
            type: WeaponType.Throwing,
            name: 'Stone',
            damage: 5,
            damageType: DamageType.bash,
        },
        whip: {
            id: 'fd58d335-5d0a-4bec-b6ae-c5d181e44308',
            type: WeaponType.Whip,
            name: 'Frayed Whip',
            damage: 5,
            damageType: DamageType.bash,
        },
        bow: {
            id: 'd5108581-b6cd-47a5-82c1-ec23d18b6af8',
            type: WeaponType.Bow,
            name: 'Practice Bow',
            damage: 5,
            damageType: DamageType.pierce,
        },
        crossbow: {
            id: 'f9eba708-9de7-4d32-9bbe-e775ac926b97',
            type: WeaponType.Crossbow,
            name: 'Shoddy Crossbow',
            damage: 5,
            damageType: DamageType.pierce,
        },
    },
};
