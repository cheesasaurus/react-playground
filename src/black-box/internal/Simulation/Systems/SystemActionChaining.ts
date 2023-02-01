import { GameDatabase } from "../../db/GameDatabase";
import { ModelTracker } from "../ModelTracker";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Responsible for chaining additional actions to Dudes.
 */
export class SystemActionChaining implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    public async tick(tickTimestamp: number, modelTracker: ModelTracker): Promise<void> {
        // todo
    }
    
}