import { randomInt } from "../../../../utils";
import { Dude, UnixTimestampMilliseconds } from "../../../exposed/models";
import { Action, ActionNone, ActionStatus, ActionType, TargetSelectionType } from "../../../exposed/Models/Action";
import { ActionDataIdling, IdlingOption, IdlingOptionsInitial } from "../../../exposed/Models/ActionTypeIdling";
import { Entity, EntityNone, EntityType } from "../../../exposed/Models/Entity";
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
        const option = await this.selectOption(dude);
        const entitySelf = {
            type: EntityType.Dude,
            id: dude.id,
        };
        return {
            id: crypto.randomUUID(),
            type: ActionType.Idling,
            timeStart: tickTimestamp,
            timeComplete: tickTimestamp + option.durationMillis,
            initiator: entitySelf,
            source: entitySelf,
            target: await this.selectTarget(dude, option),
            zone: '',
            status: ActionStatus.Pending,
            data: {
                option: option.id,
            } as ActionDataIdling,
        };
    }

    private async selectOption(dude: Dude): Promise<IdlingOption> {
        let weightSum = 0;
        const weightedSelection = [];
        for (const option of IdlingOptionsInitial) {
            // todo: don't choose options on cooldown
            weightSum += option.weight;
            weightedSelection.push({
                upperInclusive: weightSum,
                option: option,
            });
        }
        const rolledInt = randomInt(1, weightSum);
        const selection = weightedSelection.find(e => rolledInt <= e.upperInclusive);
        if (!selection) {
            throw Error('Failed to select an option');
        }
        return selection.option;
    }

    private async selectTarget(dude: Dude, option: IdlingOption): Promise<Entity> {
        if (option.possibleTargets.includes(TargetSelectionType.Self)) {
            return {
                type: EntityType.Dude,
                id: dude.id,
            };
        }
        return EntityNone;
        // todo: some kind of target pool to choose from. probably after zones implemented
    }

}
