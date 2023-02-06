import { ModelMap, UUID } from "../models";
import { TargetSelectionType } from "./Action";
import { RandomlySelectable } from "./RandomlySelectable";


export interface Ability {
    id: UUID,
    description: {
        present: string,
        past: string,
    },
    possibleTargets: TargetSelectionType[],
    durationMillis: number,
    cooldownMillis: number,
    onComplete?: AbilityCommands,
}

export type AbilityMap = ModelMap<Ability>;


export interface AbilityCommands {
    meleeHitCheck?: {
        hitDurationMillis: number,
        missDurationMillis: number,
        accuracyFactor: number,
        damageFactor: number,
        onHitStart?: {

        },
        onHitEnd?: {
            interruptFactor?: number,
            chainInto?: RandomlySelectable[],
        },
        onMissStart?: {

        },
        onMissEnd?: {
            chainInto?: RandomlySelectable[],
        }
    },
    spawnProjectiles?: AbilityCommandSpawnProjectile[],
    spawnWeaponProjectiles?: AbilityCommandSpawnWeaponProjectile[],
    immediatelyChainInto?: RandomlySelectable[],
}


export interface AbilityCommandSpawnProjectile {
    target: TargetSelectionType,
    accuracyFactor: number,
    damageFactor: number,
    speedFactor: number,
    projectileTemplate: UUID,
}


export interface AbilityCommandSpawnWeaponProjectile {
    target: TargetSelectionType,
    accuracyFactor: number,
    damageFactor: number,
    speedFactor: number,
}
