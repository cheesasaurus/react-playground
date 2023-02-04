import { SocketMessageService } from "../../services/SocketMessageService";
import { ModelTracker } from "../ModelTracker";
import { ISimulationSystem } from "./ISimulationSystem";


export class SystemBroadCastModelChanges implements ISimulationSystem {

    constructor(private socketMessageService: SocketMessageService) {

    }

    public async tick(tickTimestamp: number, modelTracker: ModelTracker): Promise<void> {
        return this.socketMessageService.enqueueMessagesForModelChanges(modelTracker);
    }

}