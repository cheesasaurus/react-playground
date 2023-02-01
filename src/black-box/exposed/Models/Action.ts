import { UnixTimestampMilliseconds, UUID } from "../models";
import { Entity } from "./Entity";


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
}


export enum TargetSelectionType {
    Self = 'Self',
    Ally = 'Ally',
    Enemy = 'Enemy',
    ChainSame = 'ChainSame',
}
