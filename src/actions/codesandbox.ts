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

export const restartSandbox = async (sandboxId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/${sandboxId}/restart`;
    try {
        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        console.log("Sandbox restarted:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error restarting sandbox:", error);
        throw error;
    }
};

export const setupWebProjectOnCodesandbox = async (sandboxId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/${sandboxId}/setup/web`;
    try {
        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        console.log("Web project setup on codesandbox:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error setting up web project on codesandbox:", error);
        throw error;
    }
};

export const setupBackendProjectOnCodesandbox = async (sandboxId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/${sandboxId}/setup/backend`;
    try {
        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        console.log("Web project setup on codesandbox:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error setting up web project on codesandbox:", error);
        throw error;
    }
};
