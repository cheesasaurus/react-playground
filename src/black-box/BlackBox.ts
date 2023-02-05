import { MessageBus, Subscription } from "../utils";
import { DudeApi } from "./api/DudeApi";
import { EquipmentService } from "./internal/services/EquipmentService";
import { IApi, IBlackBox, IDebugApi, ISocket, SocketMessage, SocketMessageHandler } from "./interface";
import { GameDatabase } from "./internal/db/GameDatabase";
import { SimulationApi } from "./api/SimulationApi";
import { DudeService } from "./internal/services/DudeService";
import { SocketMessageService } from "./internal/services/SocketMessageService";
import { DudeNameService } from "./internal/services/DudeNameService";

// In practice, the black box would be [native code] and already available via some global variable.
// But for this proof of concept I'm making my own in javascript.


export class BlackBox implements IBlackBox {
    private db = new GameDatabase();
    public socket = new Socket();
    public api = new Api(this.db);
}


class Socket implements ISocket {
    private bus = new MessageBus<SocketMessage>();
    private worker = new SharedWorker(new URL('./internal/workers/shared/SocketWorker.ts', import.meta.url));

    constructor() {
        this.worker.port.onmessage = (workerMessage: MessageEvent<SocketMessage>) => {
            const socketMessage = workerMessage.data;
            this.bus.emit(socketMessage?.type, socketMessage);
        }
    }

    public on = (messageType: string, messageHandler: SocketMessageHandler): Subscription => {
        return this.bus.on(messageType, messageHandler);
    };

}


class Api implements IApi {
    debug: DebugService;
    dudes: DudeApi;
    simulation: SimulationApi;

    constructor(db: GameDatabase) {
        const equipmentService = new EquipmentService(db);
        const dudeService = new DudeService(db);
        const dudeNameService = new DudeNameService(db);
        const socketMessageService = new SocketMessageService(db);
        this.debug = new DebugService(db);
        this.dudes = new DudeApi(db, equipmentService, dudeService, dudeNameService, socketMessageService);
        this.simulation = new SimulationApi(db);
    }

}


class DebugService implements IDebugApi {

    constructor(private db: GameDatabase) {

    }

    public async emitMessageFromBlackBox(message: SocketMessage): Promise<void> {
        await this.db.socketMessageQueue.add(message);
    }

}
