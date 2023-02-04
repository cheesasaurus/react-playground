import { PseudoThread } from "../../../../utils";
import { GameDatabase } from "../../db/GameDatabase";
import { SocketMessageService } from "../../services/SocketMessageService";
import { Simulation } from "../../Simulation/Simulation";


/* eslint-disable no-restricted-globals */
declare var self: SharedWorkerGlobalScope;

const ports = new Array<MessagePort>();
const inputThread = new PseudoThread();
inputThread.start();

const db = new GameDatabase();
const socketMessageService = new SocketMessageService(db);
const simulation = new Simulation(db, socketMessageService);
setInterval(() => simulation.tick(), 10);

self.onconnect = (e) => {
    e.ports.forEach(port => {
        ports.push(port);

        port.onmessage = async (e) => {
            switch (e.data) {
                case 'Pause':
                    inputThread.push(async () => {
                        await simulation.pause();
                        port.postMessage('PauseSuccess');
                    });
                    return;
                case 'Play':
                    inputThread.push(async () => {
                        await simulation.unPause();
                        port.postMessage('PlaySuccess');
                    });
                    return;
            }
        }        

        port.start();
    });
}
