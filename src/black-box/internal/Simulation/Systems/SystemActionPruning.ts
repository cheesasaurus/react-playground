import { Dude, UUID } from "../../../exposed/models";
import { Action, ActionNone, ActionStatus } from "../../../exposed/Models/Action";
import { EntityType } from "../../../exposed/Models/Entity";
import { GameDatabase } from "../../db/GameDatabase";
import { ModelTracker } from "../ModelTracker";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Responsible for pruning Actions that are no longer needed.
 */
export class SystemActionPruning implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    public async tick(tickTimestamp: number, modelTracker: ModelTracker): Promise<void> {
        const db = this.db;
        await db.transaction('rw', [db.actions, db.dudes], async () => {
            const actions = await this.findActionsToDelete();
            const actionIds = actions.map(action => action.id);
            const actionIdSet = new Set(actionIds);

            const dudeSources = await this.findDudeSources(actions);
            for (const dude of dudeSources) {
                if (!actionIdSet.has(dude.actionId)) {
                    // the dude already has another action assigned.
                    continue;
                }
                dude.actionId = ActionNone.id;
                dude.version++;
            }
            await db.dudes.bulkPut(dudeSources);
            await db.actions.bulkDelete(actionIds);

            actions.forEach(action => modelTracker.deletedAction(action.id));
            dudeSources.forEach(dude => modelTracker.updatedDude(dude.id));
        });
    }

    private async findActionsToDelete(): Promise<Action[]> {
        return this.db.actions
            .where('status')
            .anyOf([
                ActionStatus.Succeeded,
                ActionStatus.Failed,
                ActionStatus.Interrupted,
                ActionStatus.Cancelled,
            ])
            .toArray();
    }

    private async findDudeSources(actions: Action[]): Promise<Dude[]> {
        const dudeIds: UUID[] = [];
        actions.forEach(action => {
            if (action.source.type === EntityType.Dude) {
                dudeIds.push(action.source.id);
            }
        });

        return this.db.dudes.where('id')
            .anyOf(dudeIds)
            .toArray();
    }

}