import { DudeStatType } from "../DudeStats";
import { DudeModifierPreset } from "../models";


export enum Race {
    Human = 'Human',
    Dwarf = 'Dwarf',
    Elf = 'Elf',
    Orc = 'Orc',
    CatPerson = 'CatPerson',
}


export const RacePresets: Array<DudeModifierPreset<Race>> = [
    {
        id: Race.Human,
        name: 'Human',
        description: 'Regular dudes.',
        statModifiers: [
            {
                type: DudeStatType.WeaponSword,
                magnitude: 5,
            },
            {
                type: DudeStatType.Endurance,
                magnitude: 3,
            },
        ],
    },
    {
        id: Race.Dwarf,
        name: 'Dwarf',
        description: 'Really short dudes.',
        statModifiers: [
            {
                type: DudeStatType.WeaponHammer,
                magnitude: 5,
            },
            {
                type: DudeStatType.Strength,
                magnitude: 3,
            },
        ],
    },
    {
        id: Race.Elf,
        name: 'Elf',
        description: 'Dudes with pointy ears.',
        statModifiers: [
            {
                type: DudeStatType.WeaponBow,
                magnitude: 5,
            },
            {
                type: DudeStatType.Dexterity,
                magnitude: 3,
            },
        ],
    },
    {
        id: Race.Orc,
        name: 'Orc',
        description: 'Ugly dudes.',
        statModifiers: [
            {
                type: DudeStatType.WeaponAxe,
                magnitude: 5,
            },
            {
                type: DudeStatType.Toughness,
                magnitude: 3,
            },
        ],
    },
    {
        id: Race.CatPerson,
        name: 'Cat people',
        description: 'because why not',
        statModifiers: [
            {
                type: DudeStatType.WeaponUnarmed,
                magnitude: 5,
            },
            {
                type: DudeStatType.Agility,
                magnitude: 3,
            },
        ],
    },
];


export const RacePresetsMap: {[id: string]: DudeModifierPreset<Race>} = {};
for (const preset of RacePresets) {
    RacePresetsMap[preset.id] = preset;
}
