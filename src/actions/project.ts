"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { CreateProjectRequest } from "../types/project";

export async function createProject(payload: CreateProjectRequest) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project`;

    try {
        const res = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Failed to create project");
    }
}

export async function getOrganizationProjects(organizationId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/${organizationId}/projects`;
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting organization projects:", error);
        throw new Error("Failed to get organization projects");
    }
}

export async function getProjectById(projectId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}`;
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting project:", error);
        throw new Error("Failed to get project");
    }
}

export async function updateProjectInfo({
    projectId,
    payload,
}: {
    projectId: string;
    payload: { name?: string; description?: string };
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/info`;
    try {
        const res = await axios.patch(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating project info:", error);
        throw new Error("Failed to update project info");
    }
}
