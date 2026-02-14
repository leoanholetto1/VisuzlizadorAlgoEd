// Algoritmos de Busca

export async function linearSearch(arr, target, callbacks) {
    const { onCompare, onFound, onNotFound, getDelay, shouldStop } = callbacks;

    for (let i = 0; i < arr.length; i++) {
        if (shouldStop()) return;

        onCompare(i);
        await getDelay();

        if (arr[i] === target) {
            onFound(i);
            return;
        }
    }

    onNotFound();
}
