export function hashFunction(key, size) {
    return key % size;
}

export function hashInsert(table, key, value, size) {
    const bucket = hashFunction(key, size);
    const newTable = table.map(b => [...b]);

    const existingIdx = newTable[bucket].findIndex(item => item.key === key);
    if (existingIdx !== -1) {
        newTable[bucket][existingIdx].value = value;
    } else {
        newTable[bucket].push({ key, value });
    }

    return { table: newTable, bucket };
}

async function findInBucket(items, key, callbacks) {
    const { onCompare, getDelay } = callbacks;

    for (let i = 0; i < items.length; i++) {
        onCompare(i);
        await getDelay();

        if (items[i].key === key) return i;
    }

    return -1;
}

export async function hashSearch(table, key, size, callbacks) {
    const { onBucket, onCompare, onFound, onNotFound, getDelay } = callbacks;
    const bucket = hashFunction(key, size);

    onBucket(bucket);
    await getDelay();

    const idx = await findInBucket(table[bucket], key, { onCompare: (i) => onCompare(bucket, i), getDelay });

    if (idx !== -1) onFound(bucket, idx);
    else onNotFound(bucket);
}

export async function hashRemove(table, key, size, callbacks) {
    const { onBucket, onCompare, onFound, onNotFound, getDelay } = callbacks;
    const bucket = hashFunction(key, size);
    const newTable = table.map(b => [...b]);

    onBucket(bucket);
    await getDelay();

    const idx = await findInBucket(newTable[bucket], key, { onCompare: (i) => onCompare(bucket, i), getDelay });

    if (idx !== -1) {
        newTable[bucket].splice(idx, 1);
        onFound(bucket, newTable);
    } else {
        onNotFound(bucket);
    }
}
