import { SimulationData, UnixTimestampMilliseconds } from "../../exposed/models";
import { SocketMessageDataSimulation, SocketMessageType } from "../../interface";
import { GameDatabase } from "../db/GameDatabase";
import { SocketMessageService } from "../services/SocketMessageService";
import { ModelTracker } from "./ModelTracker";
import { ISimulationSystem } from "./Systems/ISimulationSystem";
import { SystemActionAssignment } from "./Systems/SystemActionAssignment";
import { SystemActionChaining } from "./Systems/SystemActionChaining";
import { SystemActionPruning } from "./Systems/SystemActionPruning";
import { SystemBroadCastModelChanges } from "./Systems/SystemBroadcastModelChanges";
import { SystemIdling } from "./Systems/SystemIdling";


export class Simulation {
    private isTicking: boolean = false;
    private isReady: boolean = false;
    private systems: ISimulationSystem[];
    

    public constructor(
        private db: GameDatabase,
        private socketMessageService: SocketMessageService,
    ) {
        this.systems = [
            new SystemIdling(this.db),
            new SystemActionChaining(this.db),
            new SystemActionPruning(this.db),
            new SystemActionAssignment(this.db),
            new SystemBroadCastModelChanges(this.socketMessageService),
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
            data.isPaused = true;
            await this.putData(data);
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

    private async putData(data: SimulationData): Promise<void> {
        await this.db.simulation.put(data);
        await this.pushStatusToSocketMessageQueue(data);
    }

    private throwIfNotReady() {
        if (!this.isReady) {
            throw Error('Simulation is not ready');
        }
    }

    public async pause(): Promise<void> {
        this.throwIfNotReady();
        const db = this.db;
        await db.transaction('rw', [db.simulation, db.socketMessageQueue], async () => {
            const data = await this.loadData();
            if (data.isPaused) {
                return;
            }
            data.isPaused = true;
            data.pauseTimestamp = Date.now();
            await this.putData(data);
        });
    }

    public async unPause(): Promise<void> {
        this.throwIfNotReady();
        const db = this.db;
        await db.transaction('rw', [db.simulation, db.socketMessageQueue], async () => {
            const data = await this.loadData();
            if (!data.isPaused) {
                return;
            }
            data.isPaused = false;
            const pauseDuration = Date.now() - data.pauseTimestamp;
            data.tickOffset += pauseDuration;
            await this.putData(data);
        });
    }

    public async tick(): Promise<void> {
        if (!this.isReady || this.isTicking) {
            return;
        }

        let tickTimestamp: UnixTimestampMilliseconds;
        this.isTicking = true;

        const db = this.db;
        const shouldDoTick = await db.transaction('rw', [db.simulation], async () => {
            const data = await this.loadData();
            if (data.isPaused) {
                return false;
            }
            tickTimestamp = Date.now() - data.tickOffset;
            data.lastTickWithOffset = tickTimestamp;
            await this.db.simulation.put(data);
            return true;
        });

        if (!shouldDoTick) {
            this.isTicking = false;
            return;
        }

        const modelTracker = new ModelTracker();

        for (const system of this.systems) {
            await system.tick(tickTimestamp!, modelTracker);
        }
        this.isTicking = false;
    }

    private async pushStatusToSocketMessageQueue(data: SimulationData) {
        await this.db.socketMessageQueue.add({
            id: crypto.randomUUID(),
            type: SocketMessageType.SimulationStatus,
            data: {
                simulation: data,
            } as SocketMessageDataSimulation,
        });
    }

}
