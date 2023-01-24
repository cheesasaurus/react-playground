import { Dude, DudeMap } from "../black-box/exposed/models";
import { SocketMessage, SocketMessageType } from "../black-box/interface";
import { MessageBus, MessageHandler, Subscription, Subscriptions } from "../utils";


interface State {
    dudes: {
        entries: DudeMap,
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
        const subs = [
            window.blackBox.socket.on(SocketMessageType.DudeCreated, this.pipeInDude),
            window.blackBox.socket.on(SocketMessageType.DudeUpdated, this.pipeInDude),
        ];
        subs.forEach(sub => this.subscriptions.add(sub));
    }

    subscribeSelectDude(dudeId: string, handler: MessageHandler<Dude>): Subscription {
        const dude = this.state.dudes.entries[dudeId];
        if (dude) {
            handler(dude);
        }
        return this.bus.on(`selectDude#${dudeId}`, handler);
    }

    subscribeSelectAllDudes(handler: MessageHandler<DudeMap>): Subscription {
        const dudes = this.state.dudes.entries;
        handler(dudes);
        return this.bus.on(`selectAllDudes`, handler);
    }

    public async willNeedDude(dudeId: string): Promise<void> {
        if (dudeId in this.state.dudes.entries) {
            return;
        }
        window.blackBox.api.dudes.getDude(dudeId).then(response => {
            if (response.errors) {
                console.error(response.errors);
                return;
            }
            const dude = response.data!;
            this.updateAndTriggerDude(dude);
            this.triggerDudeContainer();
        });
    }

    public async willNeedAllDudes(): Promise<void> {
        const response = await window.blackBox.api.dudes.getDudes();
        if (response.errors) {
            response.errors.forEach(console.error)
            return;
        }
        const dudeMap = response.data!
        for (const dudeId in dudeMap) {
            if (dudeMap.hasOwnProperty(dudeId)) {
                this.updateAndTriggerDude(dudeMap[dudeId]);
            }
        }
        this.triggerDudeContainer();
    }

    private pipeInDude = (message: SocketMessage) => {
        const dude = message.data as Dude;
        this.updateAndTriggerDude(dude);
        this.triggerDudeContainer();
    }

    private updateAndTriggerDude(dude: Dude): void {
        const prev = this.state.dudes.entries[dude.id];
        if (prev && dude.version < prev.version) {
            // incoming data is stale
            return;
        }
        this.state.dudes.entries[dude.id] = dude;
        this.bus.emit(`selectDude#${dude.id}`, dude);
    }

    private triggerDudeContainer() {
        this.bus.emit(`selectAllDudes`, this.state.dudes.entries);
    }

}