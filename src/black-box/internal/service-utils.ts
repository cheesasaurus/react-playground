import { randomInt } from "../../utils";


export function delayedResponse<E>(response: E): Promise<E> {
    const delayMs = randomInt(10, 250);

    return new Promise((resolve) => {
        setTimeout(() => resolve(response), delayMs);
    });
}
