/**
 * Returns a promise that resolves after a given number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait before resolving the promise.
 * @returns Promise that resolves after the specified delay.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
