import { createModelMap } from "../models";
import { Ability } from "../Models/Ability";
import { TargetSelectionType } from "../Models/Action";
import { RandomlySelectable } from "../Models/RandomlySelectable";

export const IdlingAbilityOptions: RandomlySelectable[] = [
    {
        id: '989d95ae-aea3-4b5a-8260-06bf049c0a3c',
        weight: 1,
    },
    {
        id: 'bc84e61d-c8e8-4da0-b96f-f34d2dde1f79',
        weight: 1,
    },
    {
        id: '364687cc-26d6-45db-bf7a-936f17d86435',
        weight: 1,
    },
    {
        id: 'b55047ed-ad6d-4868-9ba7-b204948baa79',
        weight: 1,
    },
];

export const IdlingAbilities = createModelMap<Ability>([
    {
        id: '989d95ae-aea3-4b5a-8260-06bf049c0a3c',
        description: {
            present: 'picking his nose',
            past: '{sourceName} picked his nose.',
        },
        possibleTargets: [TargetSelectionType.Self],
        durationMillis: 3000,
        cooldownMillis: 10000,
        onComplete: {
            immediatelyChainInto: [
                {
                    id: '778ae508-5bf6-4919-8b3b-c917e7539e76',
                    weight: 1,
                }
            ],
        },
    },
    {
        id: 'bc84e61d-c8e8-4da0-b96f-f34d2dde1f79',
        description: {
            present: 'twiddling his thumbs',
            past: '{sourceName} twiddled his thumbs.',
        },
        possibleTargets: [TargetSelectionType.Self],
        durationMillis: 3000,
        cooldownMillis: 10000,
    },
    {
        id: '364687cc-26d6-45db-bf7a-936f17d86435',
        description: {
            present: 'watching a squirrel',
            past: '{sourceName} admired a squirrel running up a tree.',
        },
        possibleTargets: [TargetSelectionType.Self],
        durationMillis: 3000,
        cooldownMillis: 10000,
    },
    {
        id: 'b55047ed-ad6d-4868-9ba7-b204948baa79',
        description: {
            present: 'eating a snack',
            past: '{sourceName} ate a snack.',
        },
        possibleTargets: [TargetSelectionType.Self],
        durationMillis: 3000,
        cooldownMillis: 10000,
    },
    {
        id: '778ae508-5bf6-4919-8b3b-c917e7539e76',
        description: {
            present: 'flicking a booger',
            past: '{sourceName} flicked a booger at {targetName}.',
        },
        possibleTargets: [TargetSelectionType.Ally, TargetSelectionType.Enemy],
        durationMillis: 3000,
        cooldownMillis: 10000,
        onComplete: {
            spawnProjectiles: [{
                target: TargetSelectionType.ChainSame,
                accuracyFactor: 1,
                damageFactor: 1,
                speedFactor: 1,
                projectileTemplate: '7796600d-767d-429a-944c-59fba2568828',
            }],
        }
    },
]);
