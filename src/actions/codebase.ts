"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

export async function getCodebaseUnderstanding(projectId: string | undefined) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    const url = `${genesoftCoreApiServiceBaseUrl}/codebase/${projectId}`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error getting web application info:", error);
        throw new Error("Failed to get web application info");
    }
}

export async function updateCodebaseUnderstanding(
    projectId: string | undefined,
    understanding: string,
) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    const url = `${genesoftCoreApiServiceBaseUrl}/codebase/${projectId}`;

    try {
        const res = await axios.put(
            url,
            {
                understanding,
            },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );

        return res.data;
    } catch (error) {
        console.error("Error getting web application info:", error);
        throw new Error("Failed to get web application info");
    }
}

export async function getRepositoryTreesFromProject(
    projectId: string | undefined,
) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    const url = `${genesoftCoreApiServiceBaseUrl}/codebase/${projectId}/trees`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error getting files from project:", error);
        throw new Error("Failed to get files from project");
    }
}

export async function getFileContentFromProject(
    projectId: string | undefined,
    filePath: string,
) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    const url = `${genesoftCoreApiServiceBaseUrl}/codebase/${projectId}/files?path=${filePath}`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error getting file content from project:", error);
        throw new Error("Failed to get file content from project");
    }
}

export async function updateFileContent(
    projectId: string | undefined,
    filePath: string,
    content: string,
) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    console.log({
        message: "Updating file content",
        projectId,
        filePath,
        content,
    });

    const url = `${genesoftCoreApiServiceBaseUrl}/codebase/${projectId}/files`;

    try {
        const res = await axios.put(
            url,
            {
                content,
                path: filePath,
            },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error("Error updating file content:", error);
        throw new Error("Failed to update file content");
    }
}
