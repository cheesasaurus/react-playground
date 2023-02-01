import Dexie from 'dexie';
import { Equipment, UUID } from '../../exposed/models';

export class GameDatabase extends Dexie {
    equipment!: Dexie.Table<Equipment, UUID>;

    constructor() {
        super('GameDatabase');
        // https://dexie.org/docs/Version/Version.stores()
        this.version(1).stores({
            equipment: 'id',
        });
    }

}
