"use server";

import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";
import { CreateFeedbackRequest, TalkToFeedbackRequest } from "@/types/feedback";

export async function createFeedback(payload: CreateFeedbackRequest) {
    const url = `${genesoftCoreApiServiceBaseUrl}/feedback`;

    try {
        const res = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error creating feedback:", error);
        throw new Error("Failed to create feedback");
    }
}

export async function getLatestOngoingFeedback(projectId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/feedback/project/${projectId}/ongoing`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting latest ongoing feedback:", error);
        throw new Error("Failed to get latest ongoing feedback");
    }
}

export async function getFeedbackById(feedbackId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/feedback/${feedbackId}`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting feedback by id:", error);
        throw new Error("Failed to get feedback by id");
    }
}

export async function submitFeedback(feedbackId: string) {
    console.log({
        message: "Submitting feedback",
        feedbackId,
    });
    const url = `${genesoftCoreApiServiceBaseUrl}/feedback/submit`;

    try {
        const res = await axios.post(
            url,
            {
                feedback_id: feedbackId,
            },
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        return res.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to submit feedback");
    }
}

export async function talkToFeedback(payload: TalkToFeedbackRequest) {
    const url = `${genesoftCoreApiServiceBaseUrl}/feedback/talk`;

    try {
        const res = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        throw new Error("Failed to submit feedback");
    }
}

export async function getHistoricalFeedbacks(projectId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/feedback/project/${projectId}/history`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error getting historical feedback:", error);
        throw new Error("Failed to get historical feedback");
    }
}
