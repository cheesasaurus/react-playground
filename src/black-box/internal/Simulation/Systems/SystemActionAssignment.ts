import { Abilities } from "../../../exposed/Abilities/Abilities";
import { IdlingAbilityOptions } from "../../../exposed/Abilities/IdlingAbilities";
import { Dude, UnixTimestampMilliseconds } from "../../../exposed/models";
import { Ability } from "../../../exposed/Models/Ability";
import { Action, ActionDataIdling, ActionNone, ActionStatus, ActionType, TargetSelectionType } from "../../../exposed/Models/Action";
import { Entity, EntityNone, EntityType } from "../../../exposed/Models/Entity";
import { randomlySelect } from "../../../exposed/Models/RandomlySelectable";
import { GameDatabase } from "../../db/GameDatabase";
import { ModelTracker } from "../ModelTracker";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Responsible for assigning actions to Dudes.
 */
export class SystemActionAssignment implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    public async tick(tickTimestamp: UnixTimestampMilliseconds, modelTracker: ModelTracker): Promise<void> {
        const db = this.db;

        const dudes = await this.findDudesNeedingAction();
        for (const dude of dudes) {
            const action = await this.prepareAction(tickTimestamp, dude);

            await db.transaction('rw', [db.actions, db.dudes], async () => {
                await db.actions.add(action);
                await db.dudes.update(dude.id, {
                    actionId: action.id,
                });
                modelTracker.updatedDude(dude.id);
                modelTracker.updatedAction(action.id);
            });
        }
    }

    private async findDudesNeedingAction(): Promise<Dude[]> {
        return this.db.dudes
            .where('actionId')
            .equals(ActionNone.id)
            .and(dude => dude.creation.completed)
            .toArray();
    }

    private async prepareAction(tickTimestamp: UnixTimestampMilliseconds, dude: Dude): Promise<Action> {
        const ability = await this.selectAbility(dude);
        const entitySelf = {
            type: EntityType.Dude,
            id: dude.id,
        };
        return {
            id: crypto.randomUUID(),
            type: ActionType.Idling,
            timeStart: tickTimestamp,
            timeComplete: tickTimestamp + ability.durationMillis,
            initiator: entitySelf,
            source: entitySelf,
            target: await this.selectTarget(dude, ability),
            zone: '',
            status: ActionStatus.Pending,
            data: {
                abilityId: ability.id,
            } as ActionDataIdling,
        };
    }

    private async selectAbility(dude: Dude): Promise<Ability> {
        // todo: filter out options on cooldown
        const abilityId = randomlySelect(IdlingAbilityOptions);
        return Abilities[abilityId];
    }

    private async selectTarget(dude: Dude, ability: Ability): Promise<Entity> {
        if (ability.possibleTargets.includes(TargetSelectionType.Self)) {
            return {
                type: EntityType.Dude,
                id: dude.id,
            };
        }
        return EntityNone;
        // todo: some kind of target pool to choose from. probably after zones implemented
    }

}
