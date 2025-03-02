"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { AxiosError } from "axios";

export type CreateFeatureDto = {
    project_id: string;
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};

export async function getFeatureById(featureId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/feature/${featureId}`;

    console.log({
        message: "getFeatureById",
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
        console.error("Error getting page by id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get page by id");
    }
}

export async function createFeature(payload: CreateFeatureDto) {
    const url = `${genesoftCoreApiServiceBaseUrl}/feature`;

    console.log({
        message: "createFeature",
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
        console.error("Error creating feature:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to create feature");
    }
}
