"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

export const buildWebApplication = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/development/project/${projectId}/update-requirements`;
    console.log({
        message: "Building web application",
        url,
        projectId,
    });
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
        return response.data;
    } catch (error) {
        console.error("Error building web application:", error);
        throw new Error("Failed to build web application");
    }
};

export const checkBuildErrors = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/repository-build/check`;
    console.log({
        message: "Checking build errors",
        url,
        projectId,
    });
    try {
        const response = await axios.post(
            url,
            { project_id: projectId },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error checking build errors:", error);
        throw new Error("Failed to check build errors");
    }
};

export const recheckBuild = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/repository-build/recheck`;
    try {
        const response = await axios.post(
            url,
            { project_id: projectId },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error rechecking build:", error);
        throw new Error("Failed to recheck build");
    }
};

export const getLatestIteration = async (projectId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/development/iteration/project/${projectId}/latest`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting latest iteration:", error);
        throw new Error("Failed to get latest iteration");
    }
};

export const getMonthlySprintsWithSubscription = async (
    organizationId: string,
) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/development/iteration/organization/${organizationId}/monthly`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error getting monthly sprints with subscription:",
            error,
        );
        throw new Error("Failed to get monthly sprints with subscription");
    }
};
