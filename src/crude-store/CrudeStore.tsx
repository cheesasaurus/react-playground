import { Dude } from "../black-box/exposed/models";
import { SocketMessage, SocketMessageType } from "../black-box/interface";
import { MessageBus, MessageHandler, Subscription, Subscriptions } from "../utils";


interface State {
    dudes: {
        entries: {
            [dudeId: number]: Dude;
        },
    },
}

export class CrudeStore {
    private bus = new MessageBus<any>();
    private subscriptions = new Subscriptions();

    private state: State = {
        dudes: {
            entries: {},
        },
    };

    public constructor() {
        const subscription = window.blackBox.socket.on(SocketMessageType.DudeCreated, this.pipeInDude);
        this.subscriptions.add(subscription);
    }

    subscribeSelectDude(dudeId: number, handler: MessageHandler<Dude>): Subscription {
        const dude = this.state.dudes.entries[dudeId];
        if (dude) {
            handler(dude);
        }
        return this.bus.on(`selectDude#${dudeId}`, handler);
    }

    public willNeedDude(dudeId: number): void {
        if (dudeId in this.state.dudes.entries) {
            return;
        }
        window.blackBox.api.dudes.getDude(dudeId).then(response => {
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            const dude = response.data!;
            this.updateDude(dude);
        });
    }

    private pipeInDude = (message: SocketMessage) => {
        const dude = message.data as Dude;
        this.updateDude(dude);
    }

    private updateDude(dude: Dude): void {
        const prev = this.state.dudes.entries[dude.id];
        if (prev && dude.version < prev.version) {
            // incoming data is stale
            return;
        }
        this.state.dudes.entries[dude.id] = dude;
        this.bus.emit(`selectDude#${dude.id}`, dude);
    }

}