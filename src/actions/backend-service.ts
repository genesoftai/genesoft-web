"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

export async function getBackendServiceInfo(projectId: string | undefined) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    const url = `${genesoftCoreApiServiceBaseUrl}/backend-infra/project/${projectId}`;

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
