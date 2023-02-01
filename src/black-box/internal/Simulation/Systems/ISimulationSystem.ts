import { UnixTimestampMilliseconds } from "../../../exposed/models";

export interface ISimulationSystem {
    tick(tickTimestamp: UnixTimestampMilliseconds): Promise<void>;
}