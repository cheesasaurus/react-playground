import { UnixTimestampMilliseconds } from "../../../exposed/models";
import { ModelTracker } from "../ModelTracker";

export interface ISimulationSystem {
    tick(tickTimestamp: UnixTimestampMilliseconds, modelTracker: ModelTracker): Promise<void>;
}