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

export type ProjectEnv = {
    id: string;
    key: string;
    value: string;
    isSecret: boolean;
    createdAt: string;
    updatedAt: string;
    projectId: string;
};

export type CreateProjectEnvDto = {
    key: string;
    value: string;
    isSecret?: boolean;
};

export type UpdateProjectEnvDto = {
    value?: string;
    isSecret?: boolean;
};

export const getProjectEnvs = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/envs`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting project environment variables:", error);
        throw new Error("Failed to get project environment variables");
    }
};

export const getProjectEnv = async (projectId: string, envId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/envs/${envId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting project environment variable:", error);
        throw new Error("Failed to get project environment variable");
    }
};

export const createProjectEnv = async (projectId: string, data: CreateProjectEnvDto) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/envs`;
    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating project environment variable:", error);
        throw new Error("Failed to create project environment variable");
    }
};

export const updateProjectEnv = async (projectId: string, envId: string, data: UpdateProjectEnvDto) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/envs/${envId}`;
    try {
        const response = await axios.put(url, data, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating project environment variable:", error);
        throw new Error("Failed to update project environment variable");
    }
};

export const deleteProjectEnv = async (projectId: string, envId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/envs/${envId}`;
    try {
        await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return true;
    } catch (error) {
        console.error("Error deleting project environment variable:", error);
        throw new Error("Failed to delete project environment variable");
    }
};
