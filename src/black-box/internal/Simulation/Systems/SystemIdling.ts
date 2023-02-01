import { GameDatabase } from "../../db/GameDatabase";
import { ModelTracker } from "../ModelTracker";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Reponsible for processing ActionType.Idling actions
 */
export class SystemIdling implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    async tick(tickTimestamp: number, modelTracker: ModelTracker): Promise<void> {
        // todo
    }
    
}