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
