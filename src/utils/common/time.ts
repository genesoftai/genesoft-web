/**
 * Pauses execution for the specified number of milliseconds
 * @param ms Number of milliseconds to sleep
 * @returns Promise that resolves after the sleep duration
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
