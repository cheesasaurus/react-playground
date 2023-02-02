import { UUID } from "../models";


export enum EntityType {
    None = 'None',
    Dude = 'Dude',
}

export interface Entity {
    type: EntityType,
    id: UUID,
}

export const EntityNone: Entity = {
    type: EntityType.None,
    id: '2aea191f-f122-4833-9100-7b9c2cfa4435',
}
