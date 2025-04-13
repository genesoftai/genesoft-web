"use server";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { Collection } from "@/types/collection";
import axios from "axios";

export type CreateCollectionRequest = {
    organization_id: string;
    name: string;
    description: string;
};

export type UpdateCollectionRequest = {
    name: string;
    description: string;
};

export async function createCollection(payload: CreateCollectionRequest) {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection`;
    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateCollection({
    collectionId,
    payload,
}: {
    collectionId: string;
    payload: UpdateCollectionRequest;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/${collectionId}`;
    try {
        const response = await axios.put(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteCollection(collectionId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/${collectionId}`;
    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function changeWebProjectInCollection(
    collectionId: string,
    webProjectId: string,
): Promise<Collection> {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/${collectionId}/web-project`;
    try {
        const response = await axios.put(
            url,
            { webProjectId },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function removeWebProjectFromCollection(
    collectionId: string,
): Promise<Collection> {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/${collectionId}/web-project`;
    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function addBackendProjectIntoCollection(
    collectionId: string,
    backendProjectId: string,
): Promise<Collection> {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/${collectionId}/backend-project`;
    try {
        const response = await axios.put(
            url,
            { backendProjectId },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function removeBackendProjectFromCollection(
    collectionId: string,
    backendProjectId: string,
): Promise<Collection> {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/${collectionId}/backend-project`;
    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
            data: { backendProjectId },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAvailableWebProjectsForOrganization(
    organizationId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/available-web-projects/${organizationId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getCollectionByWebProjectId(webProjectId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/collection/web-project/${webProjectId}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
