import { GameDatabase } from "../../db/GameDatabase"


/* eslint-disable no-restricted-globals */
declare var self: SharedWorkerGlobalScope;


const db = new GameDatabase();
const ports = new Array<MessagePort>();
// todo: how to cleanup disconnected ports? MessagePort spec doesn't have anything about this.
// Keepalive? but that might cause issues with inactive tabs. probably need reconnect logic, etc
// it's getting really tempting to set up a real back end...
// but then hosting a demo goes from a free/cheap static page, to needing a server

async function consumeQueue() {
    let message = await db.socketMessageQueue.toCollection().first();
    while (message) {
        await db.socketMessageQueue.delete(message.id);
        try {
            for (const port of ports) {
                port.postMessage(message);
            }
        }
        catch (err) {
            console.error(err);
        }
        message = await db.socketMessageQueue.toCollection().first();
    }
}

self.onconnect = (e) => {
    e.ports.forEach(port => {
        ports.push(port);
        port.start();
    });
}

setInterval(consumeQueue, 5);