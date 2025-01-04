"use server";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

export async function uploadFileForOrganization(
    organizationId: string,
    name: string,
    description: string,
    fileType: string,
    file: File,
) {
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("file_type", fileType);
        formData.append("file", file);

        const response = await axios.post(
            `${genesoftCoreApiServiceBaseUrl}/metadata/file/${organizationId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}
