import { Dude } from "../../../exposed/models";
import { GameDatabase } from "../../db/GameDatabase";
import { ModelTracker } from "../ModelTracker";
import { ISimulationSystem } from "./ISimulationSystem";


/**
 * Responsible for assigning actions to Dudes.
 */
export class SystemActionAssignment implements ISimulationSystem {

    public constructor(private db: GameDatabase) {

    }

    public async tick(tickTimestamp: number, modelTracker: ModelTracker): Promise<void> {
        
        // todo
    }

    private async prepareDudesNeedingAction(): Promise<Dude[]> {
        // todo

        return [];
    }

}