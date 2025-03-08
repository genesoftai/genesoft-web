"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { nextAppBaseUrl } from "@/constants/web";
import axios from "axios";

export async function subscribeGenesoftEmail({ email }: { email: string }) {
    const url = `${nextAppBaseUrl}/api/email`;
    try {
        const response = await axios.post(url, { email });
        const emailSubscription = await response.data;
        return emailSubscription;
    } catch (error) {
        throw error;
    }
}

export async function sendContactEmail({
    email,
    reason,
    companyName,
}: {
    email: string;
    reason: string;
    companyName: string;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/email/contact`;
    try {
        const response = await axios.post(url, { email, reason, companyName });
        const contactEmail = await response.data;
        return contactEmail;
    } catch (error) {
        throw error;
    }
}

export async function sendSupportEmail({
    email,
    query,
}: {
    email: string;
    query: string;
}) {
    const url = `${genesoftCoreApiServiceBaseUrl}/email/support`;
    try {
        const response = await axios.post(url, { email, query });
        const supportEmail = await response.data;
        return supportEmail;
    } catch (error) {
        throw error;
    }
}
