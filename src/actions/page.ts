"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { AxiosError } from "axios";

export type CreatePageDto = {
    project_id: string;
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};

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

export async function createPage(payload: CreatePageDto) {
    const url = `${genesoftCoreApiServiceBaseUrl}/page`;

    console.log({
        message: "createPage",
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
        console.error("Error creating page:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to create page");
    }
}
