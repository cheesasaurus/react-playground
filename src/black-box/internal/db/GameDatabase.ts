import Dexie from 'dexie';
import { Dude, Equipment, UUID } from '../../exposed/models';
import { Action } from '../../exposed/Models/Action';
import { SocketMessage } from '../../interface';

export class GameDatabase extends Dexie {
    dudes!: Dexie.Table<Dude, UUID>;
    equipment!: Dexie.Table<Equipment, UUID>;
    actions!: Dexie.Table<Action, UUID>;
    socketMessageQueue!: Dexie.Table<SocketMessage, UUID>;

    constructor() {
        super('GameDatabase');
        // https://dexie.org/docs/Version/Version.stores()
        this.version(4).stores({
            dudes: 'id, &name',
            equipment: 'id',
            actions: 'id, timeComplete, status',
            socketMessageQueue: 'id',
        });
    }

}
