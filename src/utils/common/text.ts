/**
 * Converts hyphen-separated text to normal text with spaces and capitalization
 * @param text The hyphen-separated text to convert
 * @returns The converted text with spaces and proper capitalization
 */
export const getTextSeparatedByHyphen = (text: string | undefined): string => {
    if (!text) return "";

    // Replace hyphens with spaces and convert to title case
    return text
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
};
