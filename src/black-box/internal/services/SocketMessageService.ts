import { createModelMap } from "../../exposed/models";
import { SocketMessageDataModels, SocketMessageType } from "../../interface";
import { GameDatabase } from "../db/GameDatabase";
import { DudesSnapshot } from "../models/DudesSnapshot";
import { ModelTracker } from "../Simulation/ModelTracker";

export class SocketMessageService {

    public constructor(private db: GameDatabase) {

    }

    public async enqueueMessagesForModelChanges(modelTracker: ModelTracker) {
        if (!modelTracker.haschanges()) {
            return;
        }

        const updatedIds = modelTracker.getUpdatedModelIds();

        const dudes = await this.db.dudes.bulkGet(updatedIds.dudes);
        const equipment = await this.db.equipment.bulkGet(updatedIds.equipment);
        const actions = await this.db.actions.bulkGet(updatedIds.actions);

        const messageData: SocketMessageDataModels = {
            updated: {
                dudes: createModelMap(dudes),
                equipment: createModelMap(equipment),
                actions: createModelMap(actions),
            },
            deleted: modelTracker.getDeletedModelIds(),
        };

        this.db.socketMessageQueue.add({
            id: crypto.randomUUID(),
            type: SocketMessageType.Models,
            data: messageData,
        });
    }

    public async dudesCreated(dudesSnapshot: DudesSnapshot) {
        this.db.socketMessageQueue.add({
            id: crypto.randomUUID(),
            type: SocketMessageType.DudesCreated,
            data: dudesSnapshot,
        });
    }

    public async dudesUpdated(dudesSnapshot: DudesSnapshot) {
        this.db.socketMessageQueue.add({
            id: crypto.randomUUID(),
            type: SocketMessageType.DudesUpdated,
            data: dudesSnapshot,
        });
    }

}
