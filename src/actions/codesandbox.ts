"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import axios from "axios";

export const getCodesandboxApiKey = async () => {
    const apiKey = process.env.CSB_API_KEY;
    return apiKey;
};

export const readFileFromCodesandboxWithHibernate = async (
    sandboxId: string,
    path: string,
) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/files/read/fast`;
    const response = await axios.post(
        url,
        {
            sandbox_id: sandboxId,
            path,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return response.data;
};

export const writeFileToCodesandboxWithoutHibernate = async (
    sandboxId: string,
    path: string,
    content: string,
) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/files/write/fast`;
    const response = await axios.post(
        url,
        {
            sandbox_id: sandboxId,
            path,
            content,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return response.data;
};

export const runTaskInCodesandbox = async (sandboxId: string, task: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/task/run/background`;
    const response = await axios.post(
        url,
        {
            sandbox_id: sandboxId,
            task,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return response.data;
};
