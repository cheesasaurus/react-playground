import { SimulationData, UnixTimestampMilliseconds } from "../../exposed/models";
import { GameDatabase } from "../db/GameDatabase";
import { ModelTracker } from "./ModelTracker";
import { ISimulationSystem } from "./Systems/ISimulationSystem";
import { SystemActionAssignment } from "./Systems/SystemActionAssignment";
import { SystemActionChaining } from "./Systems/SystemActionChaining";
import { SystemActionPruning } from "./Systems/SystemActionPruning";
import { SystemIdling } from "./Systems/SystemIdling";


export class Simulation {
    private isTicking: boolean = false;
    private isReady: boolean = false;
    private systems: ISimulationSystem[];
    

    public constructor(private db: GameDatabase) {
        this.systems = [
            new SystemIdling(this.db),
            new SystemActionChaining(this.db),
            new SystemActionPruning(this.db),
            new SystemActionAssignment(this.db),
        ];
        this.init();
    }

    private async init(): Promise<void> {
        const data = await this.loadData();
        if (!data.isPaused) {
            // The simulation was stopped some other way (e.g. closing browser).
            // We will treat it as if it was paused.
            const now = Date.now();
            const millisSinceLastTick = now - (data.lastTickWithOffset + data.tickOffset);
            data.tickOffset += millisSinceLastTick;
            data.pauseTimestamp = now;
            this.db.simulation.put(data);
        }
        this.isReady = true;
    }

    private async loadData(): Promise<SimulationData> {
        const data = await this.db.simulation.toCollection().first();
        if (!data) {
            throw Error('Missing simulation data');
        }
        return data;
    }

    private throwIfNotReady() {
        if (!this.isReady) {
            throw Error('Simulation is not ready');
        }
    }

    public async pause(): Promise<void> {
        this.throwIfNotReady();
        const data = await this.loadData();
        if (data.isPaused) {
            return;
        }
        data.isPaused = true;
        data.pauseTimestamp = Date.now();
        this.db.simulation.put(data);
    }

    public async unPause(): Promise<void> {
        this.throwIfNotReady();
        const data = await this.loadData();
        if (!data.isPaused) {
            return;
        }
        data.isPaused = false;
        const pauseDuration = Date.now() - data.pauseTimestamp;
        data.tickOffset += pauseDuration;
        this.db.simulation.put(data);
    }

    public async tick(): Promise<void> {
        if (!this.isReady || this.isTicking) {
            return;
        }
        const data = await this.loadData();
        if (data.isPaused) {
            return;
        }
        this.isTicking = true;

        const tickTimestamp: UnixTimestampMilliseconds = Date.now() - data.tickOffset;
        data.lastTickWithOffset = tickTimestamp;
        this.db.simulation.put(data);

        const modelTracker = new ModelTracker();

        for (const system of this.systems) {
            await system.tick(tickTimestamp, modelTracker);
        }
        this.isTicking = false;
    }

}
