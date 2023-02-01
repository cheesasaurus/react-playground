import Dexie from 'dexie';
import { Dude, Equipment, UUID } from '../../exposed/models';

export class GameDatabase extends Dexie {
    dudes!: Dexie.Table<Dude, UUID>;
    equipment!: Dexie.Table<Equipment, UUID>;

    constructor() {
        super('GameDatabase');
        // https://dexie.org/docs/Version/Version.stores()
        this.version(2).stores({
            dudes: 'id, &name',
            equipment: 'id',
        });
    }

}
