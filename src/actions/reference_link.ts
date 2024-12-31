"use server";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

export async function createReferenceLink({
    name,
    description,
    url,
}: {
    name: string;
    description: string;
    url: string;
}) {
    try {
        const response = await axios.post(
            `${genesoftCoreApiServiceBaseUrl}/metadata/reference-link`,
            {
                name,
                description,
                url,
            },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                    "Content-Type": "application/json",
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error("Error creating reference link:", error);
        throw error;
    }
}
