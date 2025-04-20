"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { CreateOrganization, UpdateOrganization } from "../types/organization";

export async function createOrganization({
    name,
    description,
    image,
    email: userEmail,
}: CreateOrganization) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization`;

    try {
        const res = await axios.post(
            url,
            {
                name,
                description,
                image,
                userEmail,
            },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error("Error creating organization:", error);
        throw new Error("Failed to create organization");
    }
}

export async function updateOrganization(payload: UpdateOrganization) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/${payload.id}`;

    try {
        const res = await axios.patch(
            url,
            {
                name: payload.name,
                description: payload.description,
                image: payload.image,
            },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error("Error updating organization:", error);
        throw new Error("Failed to update organization");
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

export async function getOrganizationById(organizationId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/${organizationId}`;
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return res.data;
}

export async function getOrganizationUsers(organizationId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/${organizationId}/users`;
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return res.data;
}

export async function addOrganizationUser(
    organizationId: string,
    email: string,
    role: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/user`;
    const res = await axios.post(
        url,
        {
            email,
            role,
            organizationId,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return res.data;
}

export async function removeOrganizationUser(
    organizationId: string,
    userId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/user`;
    const res = await axios.delete(url, {
        data: {
            organizationId,
            userId,
        },
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return res.data;
}

export async function updateOrganizationUserRole(
    organizationId: string,
    email: string,
    role: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/user`;
    const res = await axios.patch(
        url,
        {
            role,
            organizationId,
            email,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return res.data;
}

export async function getOrganizationsByUserId(userId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/organization/user/${userId}`;
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
        },
    });
    return res.data;
}
