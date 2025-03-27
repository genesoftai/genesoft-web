"use server";

export const getCodesandboxApiKey = async () => {
    const apiKey = process.env.CSB_API_KEY;
    return apiKey;
};
