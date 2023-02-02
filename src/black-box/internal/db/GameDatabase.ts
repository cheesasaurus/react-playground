import Dexie from 'dexie';
import { Dude, Equipment, SimulationData, UUID } from '../../exposed/models';
import { Action, ActionNone } from '../../exposed/Models/Action';
import { SocketMessage } from '../../interface';

export class GameDatabase extends Dexie {
    dudes!: Dexie.Table<Dude, UUID>;
    equipment!: Dexie.Table<Equipment, UUID>;
    actions!: Dexie.Table<Action, UUID>;
    socketMessageQueue!: Dexie.Table<SocketMessage, UUID>;
    simulation!: Dexie.Table<SimulationData, number>

    constructor() {
        super('GameDatabase');
        // https://dexie.org/docs/Version/Version.stores()
        this.version(6).stores({
            dudes: 'id, &name, actionId',
            equipment: 'id',
            actions: 'id, timeComplete, status',
            socketMessageQueue: 'id',
            simulation: 'id',
        });

        this.on('ready', async () => {
            await this.populate();
        });
    }

    private async populate() {
        const simulationData = await this.simulation.toCollection().first();
        if (!simulationData) {
            await this.simulation.add({
                id: 1,
                isPaused: true,
                tickOffset: 0,
                pauseTimestamp: 0,
                lastTickWithOffset: 0,
            });
        }

        await this.actions.put(ActionNone);
    }

}
