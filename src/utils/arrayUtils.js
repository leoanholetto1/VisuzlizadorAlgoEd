// Utilitários para arrays e animações

export function generateRandomArray(config = {}) {
    const { size = 20, min = 20, max = 320 } = config;
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * (max - min)) + min);
    }
    return array;
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const DEFAULT_CONFIG = {
    arraySize: 20,
    minValue: 20,
    maxValue: 320,
    defaultSpeed: 700,
    maxDelay: 1000
};
