import Dexie from 'dexie';
import { Dude, Equipment, UUID } from '../../exposed/models';
import { SocketMessage } from '../../interface';

export class GameDatabase extends Dexie {
    dudes!: Dexie.Table<Dude, UUID>;
    equipment!: Dexie.Table<Equipment, UUID>;
    socketMessageQueue!: Dexie.Table<SocketMessage, UUID>;

    constructor() {
        super('GameDatabase');
        // https://dexie.org/docs/Version/Version.stores()
        this.version(3).stores({
            dudes: 'id, &name',
            equipment: 'id',
            socketMessageQueue: 'id',
        });
    }

}
