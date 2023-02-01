import { GameDatabase } from "../../db/GameDatabase";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Responsible for assigning actions to Dudes.
 */
export class SystemActionAssignment implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    async tick(tickTimestamp: number): Promise<void> {
        // todo
    }

}