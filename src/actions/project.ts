"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios, { AxiosError } from "axios";
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

    console.log({
        message: "createProject",
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
        console.error("Error creating project:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to create project");
    }
}

export async function getOrganizationProjects(organizationId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/${organizationId}/projects`;
    console.log({
        message: "getOrganizationProjects",
        organizationId,
        url,
    });
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
    console.log({
        message: "getProjectById",
        projectId,
        url,
    });
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

export async function getProjects(projectIds: string[]) {
    const url = `${genesoftCoreApiServiceBaseUrl}/project?ids=${projectIds.join(
        ",",
    )}`;
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting projects:", error);
        throw new Error("Failed to get projects");
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
    console.log({
        message: "updateProjectInfo",
        projectId,
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
    console.log({
        message: "deletePage",
        projectId,
        pageId,
        url,
    });
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
    console.log({
        message: "deleteFeature",
        projectId,
        featureId,
        url,
    });
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
    console.log({
        message: "getPageReferenceLinks",
        projectId,
        pageId,
        url,
    });
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
    console.log({
        message: "getFeatureReferenceLinks",
        projectId,
        featureId,
        url,
    });
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
    const url = `${genesoftCoreApiServiceBaseUrl}/project/${projectId}/feature/${featureId}`;
    console.log({
        message: "editFeature",
        projectId,
        featureId,
        payload,
        url,
    });
    try {
        const response = await axios.patch(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error editing feature:", error);
        throw new Error("Failed to edit feature");
    }
};

export type CreateProjectFromOnboardingDto = {
    user_id: string;
    project_description?: string;
    branding?: {
        logo_url?: string;
        color?: string;
    };
    project_type: string;
    backend_requirements?: string;
    onboarding_conversation_id?: string;
    figma_file_key?: string;
};

export async function createProjectFromOnboarding(
    payload: CreateProjectFromOnboardingDto,
) {
    console.log("genesoftCoreApiServiceBaseUrl", genesoftCoreApiServiceBaseUrl);
    const url = `${genesoftCoreApiServiceBaseUrl}/project/onboarding`;
    console.log({
        message: "createProjectFromOnboarding",
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
        console.error("Error creating project from onboarding:", error);
        throw new Error("Failed to create project from onboarding");
    }
}
