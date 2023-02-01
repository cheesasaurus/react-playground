import { GameDatabase } from "../../db/GameDatabase";
import { Simulation } from "../../Simulation/Simulation";


/* eslint-disable no-restricted-globals */

const db = new GameDatabase();
const simulation = new Simulation(db);
simulation.pause();
setInterval(() => simulation.tick(), 10);

self.onmessage = async (e) => {
    switch (e.data) {
        case 'Pause':
            await simulation.pause();
            self.postMessage('PauseSuccess');
            return;
        case 'Play':
            await simulation.unPause();
            self.postMessage('PlaySuccess');
            return;
    }
}

