import { GameDatabase } from "../../db/GameDatabase";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Reponsible for processing ActionType.Idling actions
 */
export class SystemIdling implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    async tick(tickTimestamp: number): Promise<void> {
        // todo
    }
    
}