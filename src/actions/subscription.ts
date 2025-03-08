"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import axios from "axios";

export async function createSubscriptionFromCheckoutSession(sessionId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/subscription/checkout-session`;
    try {
        const response = await axios.post(
            url,
            { sessionId },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        const checkoutSession = await response.data;
        return checkoutSession;
    } catch (error) {
        throw error;
    }
}
