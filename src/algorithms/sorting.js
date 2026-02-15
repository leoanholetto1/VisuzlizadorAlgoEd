export async function bubbleSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, getDelay, shouldStop } = callbacks;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (shouldStop()) return;
            onCompare(j, j + 1);
            await getDelay();

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                onSwap([...arr]);
            }
        }
        onSorted(n - 1 - i);
    }
}

export async function selectionSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, getDelay, shouldStop } = callbacks;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
            if (shouldStop()) return;
            onCompare(minIdx, j);
            await getDelay();

            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            onSwap([...arr]);
        }
        onSorted(i);
    }
}

export async function insertionSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, getDelay, shouldStop } = callbacks;
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0) {
            if (shouldStop()) return;
            onCompare(j, j + 1);
            await getDelay();

            if (arr[j] > key) {
                arr[j + 1] = arr[j];
                onSwap([...arr]);
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        onSorted(i);
    }
}

export async function gnomeSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, getDelay, shouldStop } = callbacks;
    const n = arr.length;
    let i = 0;

    while (i < n) {
        if (shouldStop()) return;
        onCompare(i, i - 1);
        await getDelay();

        if (i === 0 || arr[i] >= arr[i - 1]) {
            i++;
        } else {
            [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
            onSwap([...arr]);
            i--;
        }
    }
    onSorted(n - 1);
}

export async function combSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, getDelay, shouldStop } = callbacks;
    let gap = arr.length;
    let swapped = true;

    while (gap > 1 || swapped) {
        if (shouldStop()) return;
        gap = Math.floor(gap / 1.3);
        swapped = false;

        for (let i = 0; i < arr.length - gap; i++) {
            if (shouldStop()) return;
            onCompare(i, i + gap);
            await getDelay();

            if (arr[i] > arr[i + gap]) {
                [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                onSwap([...arr]);
                swapped = true;
            }
        }
    }
    onSorted(arr.length - 1);
}

export async function mergeSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, getDelay, shouldStop } = callbacks;
    const n = arr.length;

    async function merge(start, mid, end) {
        if (shouldStop()) return;

        const leftSize = mid - start + 1;
        const rightSize = end - mid;

        const leftArray = new Array(leftSize);
        const rightArray = new Array(rightSize);

        for (let i = 0; i < leftSize; i++) leftArray[i] = arr[start + i];
        for (let j = 0; j < rightSize; j++) rightArray[j] = arr[mid + 1 + j];

        let i = 0, j = 0, k = start;

        const leftRange = [];
        for (let x = start; x <= mid; x++) leftRange.push(x);
        const rightRange = [];
        for (let x = mid + 1; x <= end; x++) rightRange.push(x);

        onCompare(...leftRange, ...rightRange);
        await getDelay();

        while (i < leftSize && j < rightSize) {
            if (shouldStop()) return;

            onCompare(start + i, mid + 1 + j);

            if (leftArray[i] <= rightArray[j]) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            onSwap([...arr]);
            await getDelay();
            k++;
        }

        while (i < leftSize) {
            if (shouldStop()) return;
            arr[k] = leftArray[i];
            onSwap([...arr]);
            await getDelay();
            i++;
            k++;
        }

        while (j < rightSize) {
            if (shouldStop()) return;
            arr[k] = rightArray[j];
            onSwap([...arr]);
            await getDelay();
            j++;
            k++;
        }
    }

    async function sort(start, end) {
        if (start < end) {
            if (shouldStop()) return;
            const mid = Math.floor((start + end) / 2);

            await sort(start, mid);
            await sort(mid + 1, end);

            await merge(start, mid, end);
        }
    }

    await sort(0, n - 1);

    for (let i = 0; i < n; i++) onSorted(i);
}

export async function binaryInsertionSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, onSelect, getDelay, shouldStop } = callbacks;
    const n = arr.length;

    onSorted(0);

    for (let i = 1; i < n; i++) {
        if (shouldStop()) return;

        let key = arr[i];
        let start = 0;
        let end = i - 1;

        if (onSelect) onSelect(i);
        await getDelay();

        while (start <= end) {
            if (shouldStop()) return;
            let mid = Math.floor((start + end) / 2);

            onCompare(mid, i);
            await getDelay();

            if (arr[mid] > key) {
                end = mid - 1;
            } else {
                start = mid + 1;
            }
        }

        if (onSelect) onSelect(start);
        await getDelay();

        for (let j = i - 1; j >= start; j--) {
            if (shouldStop()) return;
            arr[j + 1] = arr[j];
            onSwap([...arr]);
            await getDelay();
        }

        arr[start] = key;
        onSwap([...arr]);
        if (onSelect) onSelect();

        for (let k = 0; k <= i; k++) onSorted(k);
    }
}

export async function cocktailSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, getDelay, shouldStop } = callbacks;
    let n = arr.length;
    let swapped = true;
    let start = 0;
    let end = n - 1;

    while (swapped) {
        swapped = false;

        for (let i = start; i < end; i++) {
            if (shouldStop()) return;
            onCompare(i, i + 1);
            await getDelay();

            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                onSwap([...arr]);
                swapped = true;
            }
        }

        if (!swapped) break;

        onSorted(end);
        end--;
        swapped = false;

        for (let i = end - 1; i >= start; i--) {
            if (shouldStop()) return;
            onCompare(i, i + 1);
            await getDelay();

            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                onSwap([...arr]);
                swapped = true;
            }
        }

        onSorted(start);
        start++;
    }

    for (let i = 0; i < n; i++) onSorted(i);
}

export async function countingSort(arr, callbacks) {
    const { onCompare, onSwap, onSorted, onScan, onUpdateAux, getDelay, shouldStop } = callbacks;
    const n = arr.length;

    let max = arr[0];
    for (let i = 1; i < n; i++) {
        if (shouldStop()) return;
        if (onScan) onScan(i);
        await getDelay();

        if (arr[i] > max) {
            max = arr[i];
        }
    }
    if (onScan) onScan();

    const count = new Array(max + 1).fill(0);
    if (onUpdateAux) onUpdateAux([...count], -1);

    for (let i = 0; i < n; i++) {
        if (shouldStop()) return;
        if (onScan) onScan(i);
        await getDelay();

        if (onUpdateAux) onUpdateAux([...count], arr[i]);
        await getDelay();
        count[arr[i]]++;
        if (onUpdateAux) onUpdateAux([...count], arr[i]);
    }
    if (onScan) onScan();
    if (onUpdateAux) onUpdateAux([...count], -1);

    let k = 0;
    for (let i = 0; i <= max; i++) {
        if (onUpdateAux) onUpdateAux([...count], i);
        while (count[i] > 0) {
            if (shouldStop()) return;

            arr[k] = i;
            onSwap([...arr]);
            onSorted(k);
            await getDelay();

            count[i]--;
            if (onUpdateAux) onUpdateAux([...count], i);
            k++;
        }
    }
}
