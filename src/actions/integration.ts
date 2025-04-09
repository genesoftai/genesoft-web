"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

export type UpdateEnvs = {
    project_id: string;
    env_vars: {
        [key: string]: string;
    };
    branch: string;
    target: string[];
    env_vars_comment: {
        [key: string]: string;
    };
};

export const getStripeEnvs = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/integration/vercel/${projectId}/env-vars/stripe`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting stripe envs:", error);
        throw new Error("Failed to get stripe envs");
    }
};

export const getFirebaseEnvs = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/integration/vercel/${projectId}/env-vars/firebase`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting firebase envs:", error);
        throw new Error("Failed to get firebase envs");
    }
};

export const updateEnvs = async (payload: UpdateEnvs) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/integration/vercel/${payload.project_id}/env-vars`;
    try {
        const response = await axios.patch(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating stripe envs:", error);
        throw new Error("Failed to update stripe envs");
    }
};

export const requestGithubAccess = async (projectId: string, uid: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/github-access`;
    try {
        // Get the current user ID from the client-side session
        console.log({
            url,
            uid,
        });
        const response = await axios.post(url, { uid }, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error requesting GitHub access:", error);
        throw new Error("Failed to request GitHub access");
    }
};
