import { Abilities } from "../../../exposed/Abilities/Abilities";
import { UnixTimestampMilliseconds } from "../../../exposed/models";
import { Ability } from "../../../exposed/Models/Ability";
import { Action, ActionDataIdling, ActionStatus, ActionType, TargetSelectionType } from "../../../exposed/Models/Action";
import { Entity, EntityNone } from "../../../exposed/Models/Entity";
import { randomlySelect } from "../../../exposed/Models/RandomlySelectable";
import { GameDatabase } from "../../db/GameDatabase";
import { ModelTracker } from "../ModelTracker";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Reponsible for processing ActionType.Idling actions
 */
export class SystemIdling implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    public async tick(tickTimestamp: number, modelTracker: ModelTracker): Promise<void> {
        const db = this.db;
        const dueActions = await this.findDueActions(tickTimestamp);
        const newActions = Array<Action>();
        for (const action of dueActions) {
            // just mark it as successful for now
            console.info('completed action', action);
            action.status = ActionStatus.Succeeded;
            modelTracker.updatedAction(action.id);

            const chainIntoAction = await this.prepareActionToChainInto(tickTimestamp, action);
            if (chainIntoAction) {
                newActions.push(chainIntoAction);
                modelTracker.updatedAction(chainIntoAction.id);
            }
        }
        await db.actions.bulkPut([...dueActions, ...newActions]);
        db.transaction('rw', [db.dudes], async () => {
            for (const newAction of newActions) {
                const dudeId = newAction.source.id;
                // todo: upgrade dexie?
                // https://dexie.org/docs/Table/Table.bulkUpdate()
                await db.dudes.update(dudeId, {
                    actionId: newAction.id, 
                });
            }
        });
    }

    private async findDueActions(tickTimestamp: number): Promise<Action[]> {
        return this.db.actions
            .where('timeComplete').belowOrEqual(tickTimestamp)
            .and(action => action.status === ActionStatus.Pending)
            .and(action => action.type === ActionType.Idling)
            .toArray();
    }

    private async prepareActionToChainInto(tickTimestamp: UnixTimestampMilliseconds, completedAction: Action): Promise<Action|undefined> {
        const data = completedAction.data as ActionDataIdling;
        const completedAbility = Abilities[data.abilityId];
        const nextOptions = completedAbility?.onComplete?.immediatelyChainInto;
        if (!nextOptions || nextOptions.length === 0) {
            return undefined;
        }
        // todo: filter out options on cooldown
        const abilityId = randomlySelect(nextOptions);
        const ability = Abilities[abilityId];
        return {
            id: crypto.randomUUID(),
            type: ActionType.Idling,
            timeStart: tickTimestamp,
            timeComplete: tickTimestamp + ability.durationMillis,
            initiator: completedAction.initiator,
            source: completedAction.source,
            target: await this.selectTargetForChain(completedAction, ability),
            zone: '',
            status: ActionStatus.Pending,
            data: {
                abilityId: ability.id,
            } as ActionDataIdling,
        };
    }

    private async selectTargetForChain(completedAction: Action, ability: Ability): Promise<Entity> {
        if (ability.possibleTargets.includes(TargetSelectionType.ChainSame)) {
            return completedAction.target;
        }
        else if (ability.possibleTargets.includes(TargetSelectionType.Self)) {
            return completedAction.source;
        }
        return EntityNone;
        // todo: some kind of target pool to choose from. probably after zones implemented
    }
    
}
