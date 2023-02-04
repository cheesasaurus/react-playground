
/**
 * Get a random int between `min` and `max`, inclusive
 */
export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const distinctPossibilityCount = 1 + max - min;
    return min + Math.floor(Math.random() * distinctPossibilityCount);
}

/**
 * Format a number with a sign
 * 
 * EXAMPLES
 * negative:  '-123'
 * zero:        '+0'
 * positive:  '+123'
 */
export function signedNumber(number: number): string {
    return (number < 0 ? '' : '+') + number;
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

    /**
     * Subscribe to a particular messageType 
     */
    public on(messageType: string, messageHandler: MessageHandler<Message>): Subscription {
        if (!(messageType in this.handlersByType)) {
            this.handlersByType[messageType] = new Set([messageHandler]);
        }
        else {
            this.handlersByType[messageType].add(messageHandler);
        }

        // build Subscription
        let subscribed = true;
        return {
            unsubscribe: () => {
                if (subscribed) {
                    this.handlersByType[messageType].delete(messageHandler);
                    subscribed = false;
                }
            }
        };
    }

    /**
     * Publish a message 
     */
    public emit(messageType: string, message: Message): void {
        if (messageType in this.handlersByType) {
            for (const handler of this.handlersByType[messageType]) {
                handler(message);
            }
        }
    }

}


type AsyncTask = () => Promise<void>;
export class PseudoThread {
    private queue = new Array<AsyncTask>();
    private ticking = false;
    private intervalHandle: ReturnType<typeof setInterval> | undefined;

    public push(task: AsyncTask) {
        this.queue.push(task);
    }

    public start() {
        this.intervalHandle = setInterval(() => {
            if (!this.ticking) {
                this.tick();
            }
        }, 7);
    }

    public kill() {
        this.queue = [];
        clearInterval(this.intervalHandle);
    }

    private async tick() {
        this.ticking = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            await task!();
        }
        this.ticking = false;
    }

}
