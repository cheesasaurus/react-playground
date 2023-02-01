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

export type UUID = string;

export type UnixTimestampMilliseconds = number;


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

export const EquipmentSlots = [
    EquipmentSlot.Weapon,
    EquipmentSlot.Hat,
    EquipmentSlot.Shirt,
    EquipmentSlot.Gloves,
    EquipmentSlot.Pants,
    EquipmentSlot.Boots,
    EquipmentSlot.Lumberjack,
    EquipmentSlot.Mining,
    EquipmentSlot.Skinning,
];


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
    id: UUID,
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
        [EquipmentSlot.Weapon]: UUID | undefined,
        [EquipmentSlot.Hat]: UUID | undefined,
        [EquipmentSlot.Shirt]: UUID | undefined,
        [EquipmentSlot.Gloves]: UUID| undefined,
        [EquipmentSlot.Pants]: UUID | undefined,
        [EquipmentSlot.Boots]: UUID | undefined,
        [EquipmentSlot.Lumberjack]: UUID | undefined,
        [EquipmentSlot.Mining]: UUID | undefined,
        [EquipmentSlot.Skinning]: UUID | undefined,
    },
    stats: DudeStatMap,
    actionId: UUID | undefined,
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
    [id: UUID]: Dude;
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
    id: UUID,
    type: WeaponType,
    name: string,
    damage: number,
    damageType: DamageType,
}


export interface ArmorTemplate {
    id: UUID,
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


export enum EquipmentType {
    Weapon = 'Weapon',
    Armor = 'Armor',
}

export interface Equipment {
    id: UUID,
    type: EquipmentType,
    slot: EquipmentSlot,
    templateId: UUID,
    crafterId?: number,
}

export interface EquipmentMap {
    [id: UUID]: Equipment,
}

