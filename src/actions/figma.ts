"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

export async function getFigmaFile(fileUrl: string) {
    if (!fileUrl) {
        throw new Error("Figma file URL is required");
    }

    // Extract file key from Figma URL
    // For URLs like https://www.figma.com/design/LiBXJwdKZpaOFB39LKEaf5/Untitled?node-id=0-1&t=qdHnBEtO2270P6ee-1
    // The file key is the part after /design/ and before the next slash
    const matches = fileUrl.match(/\/design\/([^\/\?]+)/);
    const fileKey = matches ? matches[1] : fileUrl.split("/").pop();

    const url = `${genesoftCoreApiServiceBaseUrl}/figma/file/${fileKey}`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error getting Figma file:", error);
        throw new Error("Failed to get Figma file");
    }
}
