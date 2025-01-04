"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import {
    AddFeatureRequest,
    AddPageRequest,
    CreateProjectRequest,
    EditPageRequest,
    UpdateProjectBrandingDto,
    UpdateProjectRequest,
    EditFeatureRequest,
} from "../types/project";

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
    payload: UpdateProjectRequest;
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

export async function updateProjectBranding({
    projectId,
    payload,
}: {
    projectId: string;
    payload: UpdateProjectBrandingDto;
}) {
    console.log({
        message: "updateProjectBranding",
        projectId,
        payload,
    });
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/branding`;
    try {
        const res = await axios.patch(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error updating project branding:", error);
        throw new Error("Failed to update project branding");
    }
}

export async function addPage({
    projectId,
    payload,
}: {
    projectId: string;
    payload: AddPageRequest;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/page`;
    console.log({
        message: "addPage",
        projectId,
        payload,
        url,
    });
    try {
        const res = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding page:", error);
        throw new Error("Failed to add page");
    }
}

export async function editPage({
    projectId,
    pageId,
    payload,
}: {
    projectId: string;
    pageId: string;
    payload: EditPageRequest;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/page/${pageId}`;
    console.log({
        message: "project actions: editPage",
        projectId,
        pageId,
        payload,
        url,
    });
    try {
        const res = await axios.patch(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error editing page:", error);
        throw new Error("Failed to edit page");
    }
}

export async function addFeature({
    projectId,
    payload,
}: {
    projectId: string;
    payload: AddFeatureRequest;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/feature`;
    console.log({
        message: "addFeature",
        projectId,
        payload,
        url,
    });
    try {
        const res = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding feature:", error);
        throw new Error("Failed to add feature");
    }
}

export async function deletePage({
    projectId,
    pageId,
}: {
    projectId: string;
    pageId: string;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/page/${pageId}`;
    try {
        const res = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting page:", error);
        throw new Error("Failed to delete page");
    }
}

export async function deleteFeature({
    projectId,
    featureId,
}: {
    projectId: string;
    featureId: string;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/feature/${featureId}`;
    try {
        const res = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting feature:", error);
        throw new Error("Failed to delete feature");
    }
}

export async function getPageReferenceLinks(projectId: string, pageId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/page/${pageId}/reference-links`;
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting page reference links:", error);
        throw new Error("Failed to get page reference links");
    }
}

export async function getPageFiles(projectId: string, pageId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/page/${pageId}/files`;
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting page files:", error);
        throw new Error("Failed to get page files");
    }
}

export async function getFeatureFiles(projectId: string, featureId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/feature/${featureId}/files`;
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting feature files:", error);
        throw new Error("Failed to get feature files");
    }
}

export async function getFeatureReferenceLinks(
    projectId: string,
    featureId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/feature/${featureId}/reference-links`;
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting feature reference links:", error);
        throw new Error("Failed to get feature reference links");
    }
}

export const editFeature = async ({
    projectId,
    featureId,
    payload,
}: {
    projectId: string;
    featureId: string;
    payload: EditFeatureRequest;
}) => {
    try {
        const response = await axios.patch(
            `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/feature/${featureId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error editing feature:", error);
        throw new Error("Failed to edit feature");
    }
};
