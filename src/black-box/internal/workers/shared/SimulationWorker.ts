import { GameDatabase } from "../../db/GameDatabase";
import { Simulation } from "../../Simulation/Simulation";


/* eslint-disable no-restricted-globals */
declare var self: SharedWorkerGlobalScope;

const ports = new Array<MessagePort>();
const db = new GameDatabase();
const simulation = new Simulation(db);
setInterval(() => simulation.tick(), 10);

self.onconnect = (e) => {
    e.ports.forEach(port => {
        ports.push(port);

        port.onmessage = async (e) => {
            switch (e.data) {
                case 'Pause':
                    await simulation.pause();
                    port.postMessage('PauseSuccess');
                    return;
                case 'Play':
                    await simulation.unPause();
                    port.postMessage('PlaySuccess');
                    return;
            }
        }        

        port.start();
    });
}
