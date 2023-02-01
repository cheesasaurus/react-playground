import { MessageBus, Subscription } from "../utils";
import { DudeService } from "./internal/DudeService";
import { EquipmentService } from "./internal/EquipmentService";
import { IApi, IBlackBox, IDebugService, ISocket, SocketMessage, SocketMessageHandler } from "./interface";
import { GameDatabase } from "./internal/db/GameDatabase";

// In practice, the black box would be [native code] and already available via some global variable.
// But for this proof of concept I'm making my own in javascript.


export class BlackBox implements IBlackBox {
    private db = new GameDatabase();
    public socket = new Socket();
    public api = new Api(this.db);
}


class Socket implements ISocket {
    private bus = new MessageBus<SocketMessage>();
    private worker = new Worker(new URL('./internal/workers/dedicated/SocketWorker.ts', import.meta.url));

    constructor() {
        this.worker.onmessage = (workerMessage: MessageEvent<SocketMessage>) => {
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
    dudes: DudeService;

    constructor(db: GameDatabase) {
        const equipmentService = new EquipmentService(db);
        this.debug = new DebugService(db);
        this.dudes = new DudeService(db, equipmentService);
    }

}


class DebugService implements IDebugService {

    constructor(private db: GameDatabase) {

    }

    public async emitMessageFromBlackBox(message: SocketMessage): Promise<void> {
        await this.db.socketMessageQueue.add(message);
    }

}
