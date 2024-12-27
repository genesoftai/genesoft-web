"use server";

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
