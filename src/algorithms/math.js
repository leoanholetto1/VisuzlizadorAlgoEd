export async function sieveOfEratosthenes(limit, callbacks) {
    const { onMarkPrime, onMarkComposite, onCheckCurrent, onEndPass, getDelay, shouldStop } = callbacks;

    const isPrime = new Array(limit + 1).fill(true);
    isPrime[0] = false;
    isPrime[1] = false;

    for (let p = 2; p * p <= limit; p++) {
        if (shouldStop()) return;

        if (isPrime[p]) {
            await onCheckCurrent(p);
            await getDelay();

            await onMarkPrime(p);
            await getDelay();

            for (let multiple = p * p; multiple <= limit; multiple += p) {
                if (shouldStop()) return;

                isPrime[multiple] = false;
                await onMarkComposite(multiple);
                await getDelay();
            }

            await onEndPass();
        }
    }

    for (let i = 2; i <= limit; i++) {
        if (shouldStop()) return;
        if (isPrime[i]) {
            await onMarkPrime(i);
            await getDelay();
        }
    }
}
