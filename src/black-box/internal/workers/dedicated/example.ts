/* eslint-disable no-restricted-globals */

self.onmessage = (e) => {
    if (e.data === 'ping') {
        self.postMessage('pong');
    }
}

export {};
