import { ISimulationService } from "../interface";

export class SimulationService implements ISimulationService {
    private worker = new SharedWorker(new URL('./workers/shared/SimulationWorker.ts', import.meta.url));

    private busy: boolean = false;
    private ackPlay?: () => void;
    private ackPause?: () => void;

    constructor() {
        this.worker.port.onmessage = (message) => {
            switch (message.data) {
                case 'PlaySuccess':
                    if (this.ackPlay) {
                        this.ackPlay();
                        this.ackPlay = undefined;
                        this.busy = false;
                    }
                    return;
                case 'PauseSuccess':
                    if (this.ackPause) {
                        this.ackPause();
                        this.ackPause = undefined;
                        this.busy = false;
                    }
                    return;
            }
        }
    }

    public async play(): Promise<void> {
        if (this.busy) {
            throw Error('SimulationService is busy.');
        }
        this.busy = true;
        this.worker.port.postMessage('Play');
        return new Promise((resolve, reject) => {
            this.ackPlay = resolve;
        });
    }

    public async pause(): Promise<void> {
        if (this.busy) {
            throw Error('SimulationService is busy.');
        }
        this.busy = true;
        this.worker.port.postMessage('Pause');
        return new Promise((resolve, reject) => {
            this.ackPause = resolve;
        });
    }

}
