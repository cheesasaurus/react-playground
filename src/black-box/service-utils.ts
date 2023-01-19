function randomInt(min:number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
  

export function delayedResponse<E>(response: E): Promise<E> {
    const delayMs = randomInt(10, 250);

    return new Promise((resolve) => {
        setTimeout(() => resolve(response), delayMs);
    });
}