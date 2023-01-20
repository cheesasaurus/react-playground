
export function docReady(fn: () => void): void {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


type MessageHandler<Message> = (message: Message) => void;

interface MessageHandlerHandle<handler> {
    messageType: string;
    handler: handler;
}


export class MessageBus<Message> {
    private handlersByType: {[type: string]: Set<MessageHandler<Message>>};

    constructor() {
        this.handlersByType = {};
    }

    public on = (messageType: string, messageHandler: MessageHandler<Message>): MessageHandlerHandle<MessageHandler<Message>> => {
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

    public off = (handle: MessageHandlerHandle<MessageHandler<Message>>): void => {
        this.handlersByType[handle.messageType].delete(handle.handler);
    };

    public emit = (messageType: string, message: Message) => {
        if (messageType in this.handlersByType) {
            for (const handler of this.handlersByType[messageType]) {
                handler(message);
            }          
        }
    };

}