"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { AxiosError } from "axios";

export async function getPageById(pageId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/page/${pageId}`;

    console.log({
        message: "getPageById",
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
        console.error("Error getting page by id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get page by id");
    }
}
