import { DudeStatType } from "../DudeStats";
import { DudeModifierPreset } from "../models";

export enum Profession {
    Monk ='Monk',
    Soldier = 'Soldier',
    Lumberjack ='Lumberjack',
    Smith = 'Smith',
    Assassin = 'Assassin',
    Hermit = 'Hermit',
    Beggar = 'Beggar',
    Stablehand = 'Stablehand',
    Hunter = 'Hunter',
    Tinkerer = 'Engineer',
}


export const ProfessionPresets: Array<DudeModifierPreset<Profession>> = [
    {
        id: Profession.Monk,
        name: 'Monk',
        description: 'Kung fu!',
        statModifiers: [
            {
                type: DudeStatType.WeaponUnarmed,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Soldier,
        name: 'Soldier',
        description: 'Fighting in wars.',
        statModifiers: [
            {
                type: DudeStatType.WeaponSword,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Lumberjack,
        name: 'Lumberjack',
        description: 'Chopping trees.',
        statModifiers: [
            {
                type: DudeStatType.WeaponAxe,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Smith,
        name: 'Smith',
        description: 'Making metal stuff.',
        statModifiers: [
            {
                type: DudeStatType.WeaponHammer,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Assassin,
        name: 'Assassin',
        description: 'Stabbing dudes in their sleep.',
        statModifiers: [
            {
                type: DudeStatType.WeaponDagger,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Hermit,
        name: 'Hermit',
        description: 'Alone out in the hills.',
        statModifiers: [
            {
                type: DudeStatType.WeaponStaff,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Beggar,
        name: 'Beggar',
        description: 'Anything helps, god bless.',
        statModifiers: [
            {
                type: DudeStatType.WeaponThrowing,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Stablehand,
        name: 'Stablehand',
        description: 'Grooming horses.',
        statModifiers: [
            {
                type: DudeStatType.WeaponWhip,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Hunter,
        name: 'Hunter',
        description: 'Hunting wild animals.',
        statModifiers: [
            {
                type: DudeStatType.WeaponBow,
                magnitude: 5,
            },
        ],
    },
    {
        id: Profession.Tinkerer,
        name: 'Tinkerer',
        description: '.',
        statModifiers: [
            {
                type: DudeStatType.WeaponCrossbow,
                magnitude: 5,
            },
        ],
    },
];

export const ProfessionPresetsMap: {[id: string]: DudeModifierPreset<Profession>} = {};
for (const preset of ProfessionPresets) {
    ProfessionPresetsMap[preset.id] = preset;
}
