"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { projectEntrypointsSubscribe } from "next/dist/build/swc/generated-native";

export async function getGithubRepositoriesByOrganizationId(
    organizationId: string,
) {
    console.log("organizationId", organizationId);
    const url = `${genesoftCoreApiServiceBaseUrl}/github-management/organization/${organizationId}/repositories`;
    console.log("url", url);
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return response.data;
}

export async function getGithubRepositoryById(
    organizationId: string,
    repositoryId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/github-management/organization/${organizationId}/repository/${repositoryId}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return response.data;
}

export async function getGithubRepositoryByProjectId(
    organizationId: string,
    projectId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/github-management/organization/${organizationId}/project/${projectId}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return response.data;
}

export async function getGithubRepositoriesByCollectionId(
    organizationId: string,
    collectionId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/github-management/organization/${organizationId}/collection/${collectionId}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return response.data;
}

export async function submitGithubRepositoryTask(payload: {
    message: string;
    userId: string;
    repositoryId: string;
    organizationId: string;
}) {
    const { message, userId, repositoryId, organizationId } = payload;
    const url = `${genesoftCoreApiServiceBaseUrl}/github-management/organization/${organizationId}/task`;
    const response = await axios.post(
        url,
        {
            message,
            userId: userId,
            repositoryId: repositoryId,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return response.data;
}

export async function getBranchById(organizationId: string, branchId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/github-management/organization/${organizationId}/branch/${branchId}`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return response.data;
}

export async function getBranchesFromGithubByRepositoryId(
    organizationId: string,
    repositoryId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/github-management/organization/${organizationId}/repository/${repositoryId}/branches/github`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return response.data;
}
