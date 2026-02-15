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

export async function sentinelSearch(arr, target, callbacks) {
    const { onCompare, onFound, onNotFound, onSentinel, getDelay, shouldStop } = callbacks;

    const n = arr.length;
    if (n === 0) {
        onNotFound();
        return;
    }

    arr.push(target);
    if (onSentinel) onSentinel(n);
    await getDelay();

    let i = 0;
    while (arr[i] !== target) {
        if (shouldStop()) return;

        onCompare(i);
        await getDelay();
        i++;
    }

    arr.pop();
    if (onSentinel) onSentinel(-1);

    if (i < n) {
        onCompare(i);
        onFound(i);
    } else {
        onNotFound();
    }
}

export async function binarySearch(arr, target, callbacks) {
    const { onStep, onFound, onNotFound, getDelay, shouldStop } = callbacks;

    let low = 0;
    let high = arr.length - 1;
    let iteration = 0;

    while (low <= high) {
        if (shouldStop()) return;

        iteration++;
        const mid = Math.floor((low + high) / 2);

        onStep({ low, mid, high, iteration });
        await getDelay();

        if (arr[mid] === target) {
            onFound(mid);
            return;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    onNotFound();
}

export async function interpolationSearch(arr, target, callbacks) {
    const { onStep, onFound, onNotFound, getDelay, shouldStop } = callbacks;

    let low = 0;
    let high = arr.length - 1;
    let iteration = 0;

    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (shouldStop()) return;

        iteration++;

        const pos = low + Math.floor(
            ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
        );

        onStep({ low, mid: pos, high, iteration });
        await getDelay();

        if (arr[pos] === target) {
            onFound(pos);
            return;
        } else if (arr[pos] < target) {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
    }

    onNotFound();
}
