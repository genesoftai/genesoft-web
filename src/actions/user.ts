"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { nextAppBaseUrl } from "@/constants/web";
import axios from "axios";

export async function getUserByEmail({ email }: { email: string }) {
    const url = `${nextAppBaseUrl}/api/user/email/${email}`;
    try {
        const response = await axios.get(url);

        const user = await response.data;
        console.log({
            message: "get-usergetUserByEmail",
            user,
        });
        return user;
    } catch (error) {
        throw error;
    }
}

export async function updateUserImage({
    userId,
    imageUrl,
}: {
    userId: string;
    imageUrl: string;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/user/image`;
    try {
        const response = await axios.patch(
            url,
            {
                userId,
                image: imageUrl,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        console.log({
            message: "updateUserImage",
            response: response.data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateUserImageByEmail({
    email,
    imageUrl,
}: {
    email: string;
    imageUrl: string;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/user/email/${email}/image`;
    console.log({
        message: "updateUserImageByEmail",
        url,
        email,
        imageUrl,
    });
    try {
        const response = await axios.patch(
            url,
            {
                image: imageUrl,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        console.log({
            message: "updateUserImageByEmail",
            response: response.data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
