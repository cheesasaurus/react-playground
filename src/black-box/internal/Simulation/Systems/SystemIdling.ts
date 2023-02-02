import { Action, ActionStatus, ActionType } from "../../../exposed/Models/Action";
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
        await db.transaction('rw', [db.actions], async () => {
            const actions = await this.findDueActions(tickTimestamp);
            actions.forEach(action => {
                // just mark it as successful for now
                console.info('completed action', action);
                action.status = ActionStatus.Succeeded;
                modelTracker.updatedAction(action.id);
            });
            await db.actions.bulkPut(actions);
        });
    }

    private async findDueActions(tickTimestamp: number): Promise<Action[]> {
        return this.db.actions
            .where('timeComplete').belowOrEqual(tickTimestamp)
            .and(action => action.status === ActionStatus.Pending)
            .and(action => action.type === ActionType.Idling)
            .toArray();
    }
    
}
