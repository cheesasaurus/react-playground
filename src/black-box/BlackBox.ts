import { MessageBus, Subscription } from "../utils";
import { DudeService } from "./internal/DudeService";
import { EquipmentService } from "./internal/EquipmentService";
import { IApi, IBlackBox, IDebugService, ISocket, SocketMessage, SocketMessageHandler, SocketMessageQueue } from "./interface";
import { GameDatabase } from "./internal/db/GameDatabase";

// In practice, the black box would be [native code] and already available via some global variable.
// But for this proof of concept I'm making my own in javascript.


export class BlackBox implements IBlackBox {
    private messageQueue = new Array<SocketMessage>();
    public socket = new Socket(this.messageQueue);
    public api = new Api(this.messageQueue);
}


class Socket implements ISocket {
    private messageQueue: SocketMessageQueue;
    private bus = new MessageBus<SocketMessage>();

    constructor(messageQueue: SocketMessageQueue) {
        this.messageQueue = messageQueue;
        setInterval(this.consumeQueue, 5);
    }

    private consumeQueue = () => {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) {
                this.bus.emit(message?.type, message);
            }
        }
    };

    public on = (messageType: string, messageHandler: SocketMessageHandler): Subscription => {
        return this.bus.on(messageType, messageHandler);
    };

}


class Api implements IApi {
    debug: DebugService;
    dudes: DudeService;

    constructor(messageQueue: SocketMessageQueue) {
        const db = new GameDatabase();
        const equipmentService = new EquipmentService(db);
        this.debug = new DebugService(messageQueue);
        this.dudes = new DudeService(db, messageQueue, equipmentService);
    }

}


class DebugService implements IDebugService {
    private messageQueue: SocketMessageQueue;

    constructor(messageQueue: SocketMessageQueue) {
        this.messageQueue = messageQueue;
    }

    public async emitMessageFromBlackBox(message: SocketMessage): Promise<void> {
        this.messageQueue.push(message);
    }

}
