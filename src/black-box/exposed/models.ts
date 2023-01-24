import { Profession } from "./DudeModifierPresets/Professions";
import { Race } from "./DudeModifierPresets/Races";
import { DudeStatModifier, DudeStatType } from "./DudeStats";

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


export enum EquipmentSlot {
    Weapon = 'weapon',
    Hat = 'hat',
    Shirt = 'shirt',
    Gloves = 'gloves',
    Pants = 'pants',
    Boots = 'boots',
    Lumberjack = 'lumberjack',
    Mining = 'mining',
    Skinning = 'skinning'
}


export enum BodyPart {
    Head = 'head',
    Chest = 'chest',
    Torso = 'torso',
    LeftArm = 'leftArm',
    RightArm = 'rightArm',
    LeftLeg = 'leftLeg',
    RightLeg = 'rightLeg',
}


export interface Dude {
    id: number,
    version: number,
    name: string,
    hp: HP,
    race: Race,
    profession: Profession,
    creation: {
        completed: boolean,
        step: number,
    },
    equipment: {
        [EquipmentSlot.Weapon]: Weapon | undefined,
        [EquipmentSlot.Hat]: Armor | undefined,
        [EquipmentSlot.Shirt]: Armor | undefined,
        [EquipmentSlot.Gloves]: Armor | undefined,
        [EquipmentSlot.Pants]: Armor | undefined,
        [EquipmentSlot.Boots]: Armor | undefined,
        [EquipmentSlot.Lumberjack]: undefined,
        [EquipmentSlot.Mining]: undefined,
        [EquipmentSlot.Skinning]: undefined,
    },
    stats: DudeStatMap,
    actionId: number | undefined,
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

export interface DudeModifierPreset<IdType extends string> {
    id: IdType;
    name: string;
    description: string;
    statModifiers: Array<DudeStatModifier>;
}


export enum DamageType {
    bash = 'bash',
    slash = 'slash',
    pierce = 'pierce',
}


export enum WeaponType {
    Unarmed = 'unarmed',
    Sword = 'sword',
    Axe = 'axe',
    Hammer = 'hammer',
    Dagger = 'dagger',
    Staff = 'staff',
    Throwing = 'throwing',
    Whip = 'whip',
    Bow = 'bow',
    Crossbow = 'crossbow',
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


export interface ArmorTemplate {
    id: number,
    slot: EquipmentSlot,
    name: string,
    defense: number,
    agilityPenalty: number, // percentage of agility lost
    effectiveness: {
        [key in DamageType]: number; // percentage of `defense` that applies vs that damage type
    },
    coverage: {
        [BodyPart.Head]?: number; // percentage of body part covered
        [BodyPart.Chest]?: number;
        [BodyPart.Torso]?: number;
        [BodyPart.LeftArm]?: number;
        [BodyPart.RightArm]?: number;
        [BodyPart.LeftLeg]?: number,
        [BodyPart.RightLeg]?: number;
    },

}


export interface Armor {
    id: number,
    template: ArmorTemplate,
    crafterId?: number,
}


/**
 * Equipment that is not currently equipped
 */
export interface LooseEquipment {
    id: number,
    slot: EquipmentSlot,
    instance: Weapon | Armor,
}

