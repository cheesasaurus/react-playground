import { DudeStatType } from "./DudeStats";

export interface ModelMap<Model> {
    [key: number|string]: Model;
}

export function *iterateModelMap<Model>(modelMap: ModelMap<Model>): Generator<Model> {
    for (const key in modelMap) {
        if (modelMap.hasOwnProperty(key)) {
            yield modelMap[key];
        }
    }
}


export interface Dude {
    id: number,
    name: string,
    hp: HP,
    luckyNumber: number | undefined,
    starterWeapon: WeaponType,
    creationCompleted: boolean,
    equipment: {
        weapon: Weapon | undefined,
    },
    stats: DudeStatMap,
}

export interface DudeStat {
    level: {
        actual: number,
        boosted: number,
    },
    xp: number,
}

export type DudeStatMap = {
    [key in DudeStatType]: DudeStat;
};

export interface HP {
    max: number,
    current: number,
}

export interface DudeMap extends ModelMap<Dude> {
    [id: number]: Dude;
}


export enum DamageType {
    bash = 'bash',
    slash = 'slash',
    pierce = 'pierce',
    magic = 'magic',
}


export enum WeaponType {
    Sword = 'sword',
    Bow = 'bow',
    Staff = 'staff',
}


export interface WeaponTemplate {
    id: number,
    type: WeaponType,
    name: string,
    damage: number,
    damageType: DamageType,
}


export interface Weapon {
    id: number,
    template: WeaponTemplate,
    crafterId?: number,
}
