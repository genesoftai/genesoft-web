/**
 * Pauses execution for the specified number of milliseconds
 * @param ms Number of milliseconds to sleep
 * @returns Promise that resolves after the sleep duration
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Formats a date to a localized string with customizable options
 * @param date The date to format (Date object or string/number that can be parsed by Date constructor)
 * @param options Optional formatting options
 * @returns Formatted date string
 */
export const formatDateToHumanReadable = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    },
): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const today = new Date();

    // Check if the date is today
    if (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    ) {
        // If it's today, only show time
        return dateObj.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Otherwise show the full date and time
    return dateObj.toLocaleDateString(undefined, options);
};
