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

export const getGithubUsername = async (uid: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/supabase/github-username/${uid}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting GitHub username:", error);
        return null;
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

export interface SubscribeProjectRequest {
    uid: string;
    returnUrl: string;
}

export const subscribeProject = async (projectId: string, data: SubscribeProjectRequest) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/subscribe/instance`;
    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error subscribing to project:", error);
        throw new Error("Failed to subscribe to project");
    }
};

export const getSubscribeProject = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/subscribe`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error subscribing to project:", error);
        throw new Error("Failed to subscribe to project");
    }
};

export const getProjectServices = async (projectId: string): Promise<{
    id: string;
    name: string;
    status: string;
    type: 'STARTING' | 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'DELETING' | 'DELETED' | 'PAUSING' | 'PAUSED' | 'RESUMING';
    createdAt: string;
}> => {
    //koyeb/project/:projectId/service
    
    const url = `${genesoftCoreApiServiceBaseUrl}/backend-infra/koyeb/project/${projectId}/service`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting project services:", error);
        throw new Error("Failed to get project services");
    }
};

export const subscribeDatabaseService = async (projectId: string, data: SubscribeProjectRequest) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/projects/${projectId}/subscribe/database`;
    try {
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error subscribing to database service:", error);
        throw new Error("Failed to subscribe to database service");
    }
};

export const getDatabaseCredentials = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/database/credentials`;
    console.log({
        url,
    });
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting database credentials:", error);
        throw new Error("Failed to get database credentials");
    }
};

export const reDeployProject = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/services/re-deploy`;
    try {
        const response = await axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error re-deploying project:", error);
        throw new Error("Failed to re-deploy project");
    }
};

export const viewLogs = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/deployment/logs/latest`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error viewing logs:", error);
        throw new Error("Failed to view logs");
    }
};


