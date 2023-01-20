import { MessageBus } from "../utils";
import { DudeService } from "./DudeService";
import { EquipmentService } from "./EquipmentService";
import { IApi, IBlackBox, IDebugService, ISocket, SocketMessage, SocketMessageHandler, SocketMessageHandlerHandle, MessageQueue } from "./interface";

// In practice, the black box would be [native code] and already available via some global variable.
// But for this proof of concept I'm making my own in javascript.


export class BlackBox implements IBlackBox {
    private messageQueue = new Array<SocketMessage>();
    public socket = new Socket(this.messageQueue);
    public api = new Api(this.messageQueue);
}


class Socket implements ISocket {
    private messageQueue: MessageQueue;
    private bus = new MessageBus<SocketMessage>();

    constructor(messageQueue: MessageQueue) {
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

    public on = (messageType: string, messageHandler: SocketMessageHandler): SocketMessageHandlerHandle => {
        return this.bus.on(messageType, messageHandler);
    };

    public off = (handle: SocketMessageHandlerHandle): void => {
        this.bus.off(handle);
    };

}


class Api implements IApi {
    debug: DebugService;
    dudes: DudeService;

    constructor(messageQueue: MessageQueue) {
        const equipmentService = new EquipmentService();
        this.debug = new DebugService(messageQueue);
        this.dudes = new DudeService(messageQueue, equipmentService);
    }

}


class DebugService implements IDebugService {
    private messageQueue: MessageQueue;

    constructor(messageQueue: MessageQueue) {
        this.messageQueue = messageQueue;
    }

    public async emitMessageFromBlackBox(message: SocketMessage): Promise<void> {
        this.messageQueue.push(message);
    }

}
