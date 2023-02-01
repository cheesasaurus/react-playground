import { UUID } from "../models";


export enum EntityType {
    Dude = 'Dude',
}

export interface Entity {
    type: EntityType,
    id: UUID,
}
