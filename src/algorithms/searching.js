// Algoritmos de Busca

export async function linearSearch(arr, target, callbacks) {
    const { onCompare, onFound, onNotFound, getDelay, shouldStop } = callbacks;

    let i = 0;
    while (i < arr.length) {
        if (shouldStop()) return;

        onCompare(i);
        await getDelay();

        if (arr[i] === target) {
            onFound(i);
            return;
        }
        i++;
    }

    onNotFound();
}
