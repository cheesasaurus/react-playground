import { UnixTimestampMilliseconds } from "../../exposed/models";
import { GameDatabase } from "../db/GameDatabase";
import { ISimulationSystem } from "./Systems/ISimulationSystem";
import { SystemActionAssignment } from "./Systems/SystemActionAssignment";
import { SystemIdling } from "./Systems/SystemIdling";


export class Simulation {
    private isTicking: boolean = false;
    private isPaused: boolean = false;
    private timestampOffset: number = 0;
    private pauseTimestamp: UnixTimestampMilliseconds = 0;
    private systems: ISimulationSystem[];
    

    public constructor(private db: GameDatabase) {
        this.systems = [
            new SystemIdling(this.db),
            new SystemActionAssignment(this.db),
        ];
    }

    public async pause(): Promise<void> {
        if (this.isPaused) {
            return;
        }
        this.pauseTimestamp = Date.now();
    }

    public async unPause(): Promise<void> {
        if (!this.isPaused) {
            return;
        }
        this.isPaused = false;
        const pauseDuration = Date.now() - this.pauseTimestamp;
        this.timestampOffset += pauseDuration;
    }

    public async tick(): Promise<void> {
        if (this.isPaused || this.isTicking) {
            return;
        }
        this.isTicking = true;
        const tickTimestamp: UnixTimestampMilliseconds = Date.now() - this.timestampOffset;
        for (const system of this.systems) {
            await system.tick(tickTimestamp);
        }
        this.isTicking = false;
    }

}
