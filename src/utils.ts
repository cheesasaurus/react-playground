
export function docReady(fn: () => void): void {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


type cssClassNamesConfig = {
    [className: string]: boolean
};

/**
 * Helper to use multiple css classes.
 * 
 * example:
 * 
 *  cssClassNames({
 *      aaa: true,
 *      bbb: false,
 *      ccc: true
 *  });
 *  // returns the string 'aaa ccc'
 */
export function cssClassNames(cfg: cssClassNamesConfig): string {
    const classNames = [];
    for (const className in cfg) {
        if (cfg.hasOwnProperty(className) && cfg[className]) {
            classNames.push(className);
        }
    }
    return classNames.join(' ');
}


export interface Subscription {
    unsubscribe(): void;
}

export class Subscriptions implements Subscription {
    private subscriptions = new Array<Subscription>();

    public add(subscription: Subscription): void {
        this.subscriptions.push(subscription);
    }

    public unsubscribe(): void {
        for (let i = this.subscriptions.length - 1; i >= 0; i--) {
            this.subscriptions[i].unsubscribe();
            // in case there was an error unsubscribing, the subscription should not be removed from the array
            this.subscriptions.pop();
        }
    }
}


export type MessageHandler<Message> = (message: Message) => void;


export class MessageBus<Message> {
    private handlersByType: {[type: string]: Set<MessageHandler<Message>>};

    constructor() {
        this.handlersByType = {};
    }

    public on = (messageType: string, messageHandler: MessageHandler<Message>): Subscription => {
        if (!(messageType in this.handlersByType)) {
            this.handlersByType[messageType] = new Set([messageHandler]);
        }
        else {
            this.handlersByType[messageType].add(messageHandler);
        }

        // build Subsription
        let subscribed = true;
        return {
            unsubscribe: () => {
                if (subscribed) {
                    this.handlersByType[messageType].delete(messageHandler);
                    subscribed = false;
                }
            }
        };
    };

    public emit = (messageType: string, message: Message) => {
        if (messageType in this.handlersByType) {
            for (const handler of this.handlersByType[messageType]) {
                handler(message);
            }          
        }
    };

}