import { GameDatabase } from "../../db/GameDatabase"


/* eslint-disable no-restricted-globals */

const db = new GameDatabase();

async function consumeQueue() {
    let message = await db.socketMessageQueue.toCollection().first();
    while (message) {
        await db.socketMessageQueue.delete(message.id);
        try {
            self.postMessage(message);
        }
        catch (err) {
            console.error(err);
        }
        message = await db.socketMessageQueue.toCollection().first();
    }
}

setInterval(consumeQueue, 5);