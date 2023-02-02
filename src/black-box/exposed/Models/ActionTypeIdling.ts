import { UUID } from "../models";
import { TargetSelectionType } from "./Action";


export interface ActionDataIdling {
    option: UUID,
}


export interface IdlingOption {
    id: UUID,
    description: {
        present: string,
        past: string,
    },
    possibleTargets: TargetSelectionType[],
    weight: number,
    durationMillis: number,
    cooldownMillis: number,
    chainInto: UUID[], // next options to choose if action is successful
}

interface IdlingOptionMap {
    [id: UUID]: IdlingOption,
}


export const IdlingOptionsInitial: IdlingOption[] = [
    {
        id: '989d95ae-aea3-4b5a-8260-06bf049c0a3c',
        description: {
            present: 'picking his nose',
            past: '{sourceName} picked his nose.',
        },
        possibleTargets: [TargetSelectionType.Self],
        weight: 1,
        durationMillis: 3000,
        cooldownMillis: 10000,
        chainInto: ['778ae508-5bf6-4919-8b3b-c917e7539e76'],
    },
    {
        id: 'bc84e61d-c8e8-4da0-b96f-f34d2dde1f79',
        description: {
            present: 'twiddling his thumbs',
            past: '{sourceName} twiddled his thumbs.',
        },
        possibleTargets: [TargetSelectionType.Self],
        weight: 1,
        durationMillis: 3000,
        cooldownMillis: 10000,
        chainInto: [],
    },
    {
        id: '364687cc-26d6-45db-bf7a-936f17d86435',
        description: {
            present: 'watching a squirrel',
            past: '{sourceName} admired a squirrel running up a tree.',
        },
        possibleTargets: [TargetSelectionType.Self],
        weight: 1,
        durationMillis: 3000,
        cooldownMillis: 10000,
        chainInto: [],
    },
    {
        id: 'b55047ed-ad6d-4868-9ba7-b204948baa79',
        description: {
            present: 'eating a snack',
            past: '{sourceName} ate a snack.',
        },
        possibleTargets: [TargetSelectionType.Self],
        weight: 1,
        durationMillis: 3000,
        cooldownMillis: 10000,
        chainInto: [],
    },

];


export const IdlingOptionsFollowup: IdlingOption[] = [
    {
        id: '778ae508-5bf6-4919-8b3b-c917e7539e76',
        description: {
            present: 'flicking a booger',
            past: '{sourceName} flicked a booger at {targetName}.',
        },
        possibleTargets: [TargetSelectionType.Ally, TargetSelectionType.Enemy],
        weight: 1,
        durationMillis: 3000,
        cooldownMillis: 10000,
        chainInto: [],
    },
];


export const IdlingOptions: IdlingOptionMap = {};
const registerOption = (option: IdlingOption) => IdlingOptions[option.id] = option;
IdlingOptionsInitial.forEach(registerOption);
IdlingOptionsFollowup.forEach(registerOption);
