import { UnixTimestampMilliseconds, UUID } from "../models";
import { Entity, EntityNone } from "./Entity";


export interface Action {
    id: UUID,
    type: ActionType,
    timeStart: UnixTimestampMilliseconds,
    timeComplete: UnixTimestampMilliseconds,
    initiator: Entity,
    source: Entity,
    target: Entity,
    zone: UUID,
    status: ActionStatus,
    data: unknown,
}

export interface ActionMap {
    [id: UUID]: Action,
}

export enum ActionStatus {
    Pending = 'Pending',
    Error = 'Error',
    Succeeded = 'Succeeded',
    Failed = 'Failed',
    Interrupted = 'Interrupted',
    Cancelled = 'Cancelled',
}


export const ActionZoneDebug = {
    id: '9ddc1acc-6da7-43d2-b0e0-eef0f696ecaf',
    name: 'Zone: Debug',
}


export enum ActionType {
    Idling = 'Idling',
    Attacking = 'Attacking',
    None = 'None',
}

/**
 * Represents "no action" since indexeddb can't index undefined/null
 */
export const ActionNone: Action = {
    id: 'f7925c95-524d-4114-94ba-2f9ffe0b189d',
    type: ActionType.None,
    timeStart: 0,
    timeComplete: 0,
    initiator: EntityNone,
    source: EntityNone,
    target: EntityNone,
    zone: '',
    status: ActionStatus.Pending,
    data: {},
}


export enum TargetSelectionType {
    Self = 'Self',
    Ally = 'Ally',
    Enemy = 'Enemy',
    ChainSame = 'ChainSame',
}
