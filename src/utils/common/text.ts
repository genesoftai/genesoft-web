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

export const getFirstCharacterUppercase = (
    text: string | undefined,
): string => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getTextSeparatedUnderScore = (
    text: string | undefined,
): string => {
    if (!text) return "";
    return text.split("_").join(" ");
};

/**
 * Converts underscore-separated text to normal text with spaces and capitalization of each word
 * @param text The underscore-separated text to convert
 * @returns The converted text with spaces and proper capitalization for each word
 */
export const getTextSeparatedUnderScoreCapitalized = (
    text: string | undefined,
): string => {
    if (!text) return "";
    return text
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
};

export const getAgentFullName = (agentName: string) => {
    if (agentName === "project_manager_agent") return "Project Manager";
    if (agentName === "backend_developer_agent") return "Backend Developer";
    if (agentName === "frontend_developer_agent") return "Frontend Developer";
    if (agentName === "ux_ui_designer_agent") return "UX/UI Designer";
    if (agentName === "software_architect_agent") return "Software Architect";
    return getTextSeparatedUnderScoreCapitalized(agentName);
};
