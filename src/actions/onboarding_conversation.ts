"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { AxiosError } from "axios";
import { Message } from "@/types/message";

export type CreateMessageDto = {
    sender_type: string;
    message_type: string;
    content?: string;
    sender_id?: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};

export type TalkWithAiAgentsDto = {
    conversation_id: string;
    message: CreateMessageDto;
};

export async function getOnboardingConversationById(conversationId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/onboarding-conversation/${conversationId}`;

    console.log({
        message: "getOnboardingConversationById",
        conversationId,
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
        console.error("Error getting onboarding conversation by id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get onboarding conversation by id");
    }
}

export async function addMessageToOnboardingConversation(
    conversationId: string,
    message: Partial<Message>,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/onboarding-conversation/${conversationId}/message`;

    console.log({
        message: "addMessageToConversation",
        conversationId,
        url,
    });

    try {
        const res = await axios.post(url, message, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding message to conversation:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to add message to conversation");
    }
}

export async function talkWithAiAgents(payload: TalkWithAiAgentsDto) {
    const url = `${genesoftCoreApiServiceBaseUrl}/onboarding-conversation/talk/ai-agents`;

    console.log({
        message: "talkWithAiAgents",
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
        console.error("Error talking to web ai agents:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to talk to web ai agents");
    }
}

export async function submitOnboardingConversation(conversation_id: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/onboarding-conversation/submit`;

    console.log({
        message: "submitOnboardingConversation",
        conversation_id,
        url,
    });

    try {
        const res = await axios.post(
            url,
            {
                conversation_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error("Error submitting conversation:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to submit conversation");
    }
}

export async function createOnboardingConversation() {
    const url = `${genesoftCoreApiServiceBaseUrl}/onboarding-conversation`;

    console.log({
        message: "createOnboardingConversation",
        url,
    });

    try {
        const res = await axios.post(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });

        console.log({
            message: "createOnboardingConversation response",
            data: res.data,
        });

        return res.data;
    } catch (error) {
        console.error("Error creating conversation:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to create conversation");
    }
}
