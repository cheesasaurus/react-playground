export enum DudeStatType {
    Strength = 'strength',
    Endurance = 'endurance',
    Toughness = 'toughness',
    Agility = 'agility',
    Dexterity = 'dexterity',
    MartialArts = 'martial',
    WeaponUnarmed = 'unarmed',
    WeaponSword = 'sword',
    WeaponAxe = 'axe',
    WeaponHammer = 'hammer',
    WeaponDagger = 'dagger',
    WeaponStaff = 'staff',
    WeaponThrowing = 'throwing',
    WeaponWhip = 'whip',
    WeaponBow = 'bow',
    WeaponCrossbow = 'crossbow',
}

export const DudeStatTypes = [
    DudeStatType.Strength,
    DudeStatType.Endurance,
    DudeStatType.Toughness,
    DudeStatType.Agility,
    DudeStatType.Dexterity,
    DudeStatType.MartialArts,
    DudeStatType.WeaponUnarmed,
    DudeStatType.WeaponSword,
    DudeStatType.WeaponAxe,
    DudeStatType.WeaponHammer,
    DudeStatType.WeaponDagger,
    DudeStatType.WeaponStaff,
    DudeStatType.WeaponThrowing,
    DudeStatType.WeaponWhip,
    DudeStatType.WeaponBow,
    DudeStatType.WeaponCrossbow,
];

const weaponSkillDescription = 'Increases [frequency of attacks] and [chance to hit] with this type of weapon.';

type InfoMap = {
    [statType: string]: {
        type: DudeStatType,
        name: string,
        description: string,
    };
};

export const DudeStatInfo: InfoMap = {
    [DudeStatType.Strength]: {
        type: DudeStatType.Strength,
        name: 'Strength',
        description: 'Increases [melee damage] and [carry capacity].',
    },
    [DudeStatType.Endurance]: {
        type: DudeStatType.Endurance,
        name: 'Endurance',
        description: 'Increases [map movement speed].',
    },
    [DudeStatType.Toughness]: {
        type: DudeStatType.Toughness,
        name: 'Toughness',
        description: 'Increases [resistance to physical damage].',
    },
    [DudeStatType.Agility]: {
        type: DudeStatType.Agility,
        name: 'Agility',
        description: 'Increases [chance to avoid attacks].',
    },
    [DudeStatType.Dexterity]: {
        type: DudeStatType.Dexterity,
        name: 'Dexterity',
        description: 'Increases [chance to hit openings in armor].',
    },
    [DudeStatType.MartialArts]: {
        type: DudeStatType.MartialArts,
        name: 'Martial Arts',
        description: 'Increases [unarmed damage]. Train by fighting without any armor or weapons.',
    },
    [DudeStatType.WeaponUnarmed]: {
        type: DudeStatType.WeaponUnarmed,
        name: 'Unarmed',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponSword]: {
        type: DudeStatType.WeaponSword,
        name: 'Sword',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponAxe]: {
        type: DudeStatType.WeaponAxe,
        name: 'Axe',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponHammer]: {
        type: DudeStatType.WeaponHammer,
        name: 'Hammer',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponDagger]: {
        type: DudeStatType.WeaponDagger,
        name: 'Dagger',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponStaff]: {
        type: DudeStatType.WeaponStaff,
        name: 'Staff',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponThrowing]: {
        type: DudeStatType.WeaponThrowing,
        name: 'Throwing',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponWhip]: {
        type: DudeStatType.WeaponWhip,
        name: 'Whip',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponBow]: {
        type: DudeStatType.WeaponBow,
        name: 'Bow',
        description: weaponSkillDescription,
    },
    [DudeStatType.WeaponCrossbow]: {
        type: DudeStatType.WeaponCrossbow,
        name: 'Crossbow',
        description: weaponSkillDescription,
    },
}

export interface DudeStatModifier {
    type: DudeStatType,
    magnitude: number,
}
