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
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return res.data;
}
