import { IApi, IBlackBox, IDebugService, ISocket, Message, MessageHandler, MessageHandlerHandle, MessageQueue } from "./interface";

// In practice, the black box would be [native code] and already available via some global variable.
// But for this proof of concept I'm making my own in javascript.


export class BlackBox implements IBlackBox {
    private messageQueue = new Array<Message>();
    public socket = new Socket(this.messageQueue);
    public api = new Api(this.messageQueue);
}


class Socket implements ISocket {
    private handlersByType: {[type: string]: Set<MessageHandler>};
    private messageQueue: MessageQueue;

    constructor(messageQueue: MessageQueue) {
        this.handlersByType = {};
        this.messageQueue = messageQueue;
        setInterval(this.consumeQueue, 5);
    }

    private consumeQueue = () => {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message && message.type in this.handlersByType) {
                for (const handler of this.handlersByType[message.type]) {
                    handler(message);
                }          
            }
        }
    };

    public on = (messageType: string, messageHandler: MessageHandler): MessageHandlerHandle => {
        if (!(messageType in this.handlersByType)) {
            this.handlersByType[messageType] = new Set([messageHandler]);
        }
        else {
            this.handlersByType[messageType].add(messageHandler);
        }

        return {
            messageType: messageType,
            handler: messageHandler
        };
    };

    public off = (handle: MessageHandlerHandle): void => {
        this.handlersByType[handle.messageType].delete(handle.handler);
    };

}


class Api implements IApi {
    debug: DebugService;

    constructor(messageQueue: MessageQueue) {
        this.debug = new DebugService(messageQueue);
    }

}


class DebugService implements IDebugService {
    private messageQueue: MessageQueue;

    constructor(messageQueue: MessageQueue) {
        this.messageQueue = messageQueue;
    }

    public async emitMessageFromBlackBox(message: Message): Promise<void> {
        this.messageQueue.push(message);
    }

}
