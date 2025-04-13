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

export type CreatePageDto = {
    project_id: string;
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
};

export type TalkToWebAiAgentsDto = {
    project_id: string;
    conversation_id: string;
    message: CreateMessageDto;
};

export type TalkToProjectManagerDto = {
    project_id: string;
    conversation_id: string;
    message: CreateMessageDto;
    feature_id?: string;
    page_id?: string;
};

export type TalkToBackendDeveloperDto = {
    project_id: string;
    conversation_id: string;
    message: CreateMessageDto;
};

export type CreateConversationDto = {
    project_id: string;
    name?: string;
    page_id?: string;
    feature_id?: string;
};

export async function getConversationById(conversationId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/${conversationId}`;

    console.log({
        message: "getConversationById",
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
        console.error("Error getting conversation by id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get conversation by id");
    }
}

export async function getActiveConversationByProjectId(projectId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/project/${projectId}/active`;

    console.log({
        message: "getActiveConversationByProjectId",
        projectId,
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
        console.error(
            "Error getting active conversation by project id:",
            error,
        );
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get active conversation by project id");
    }
}

export async function getActiveConversationByPageId(pageId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/page/${pageId}/active`;

    console.log({
        message: "getActiveConversationByPageId",
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
        console.error("Error getting active conversation by page id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get active conversation by page id");
    }
}

export async function getActiveConversationByFeatureId(featureId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/feature/${featureId}/active`;

    console.log({
        message: "getActiveConversationByFeatureId",
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
        console.error(
            "Error getting active conversation by feature id:",
            error,
        );
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get active conversation by feature id");
    }
}

export async function addMessageToConversation(
    conversationId: string,
    message: Partial<Message>,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/${conversationId}/message`;

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

export async function talkToWebAiAgents(payload: TalkToWebAiAgentsDto) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/talk/web-ai-agents`;

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

export async function talkToProjectManager(payload: TalkToProjectManagerDto) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/talk/project-manager`;

    console.log({
        message: "talkToProjectManager",
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
        console.error("Error talking to project manager:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to talk to project manager");
    }
}

export async function talkToBackendDeveloper(
    payload: TalkToBackendDeveloperDto,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/talk/backend-developer`;

    console.log({
        message: "talkToBackendDeveloper",
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
        console.error("Error talking to backend developer:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to talk to backend developer");
    }
}

export async function submitConversation(conversation_id: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/submit`;

    console.log({
        message: "submitConversation",
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

export async function getLatestActiveConversationByProjectId(
    projectId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/project/${projectId}/latest/active`;

    console.log({
        message: "getLatestActiveConversationByProjectId",
        projectId,
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
        console.error(
            "Error getting latest active conversation by project id:",
            error,
        );
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error(
            "Failed to get latest active conversation by project id",
        );
    }
}

export async function getConversationsByProjectId(projectId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/project/${projectId}`;

    console.log({
        message: "getConversationsByProjectId",
        projectId,
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
        console.error("Error getting conversations by project id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get conversations by project id");
    }
}

export async function getConversationsWithIterationsByProjectId(
    projectId: string,
) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/project/${projectId}/iterations`;

    console.log({
        message: "getConversationsWithIterationsByProjectId",
        projectId,
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
        console.error(
            "Error getting conversations with iterations by project id:",
            error,
        );
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error(
            "Failed to get conversations with iterations by project id",
        );
    }
}

export async function getConversationsByPageId(pageId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/page/${pageId}`;

    console.log({
        message: "getConversationsByPageId",
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
        console.error("Error getting conversations by page id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get conversations by page id");
    }
}

export async function getConversationsByFeatureId(featureId: string) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation/feature/${featureId}`;

    console.log({
        message: "getConversationsByFeatureId",
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
        console.error("Error getting conversations by feature id:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to get conversations by feature id");
    }
}

export async function createConversation(payload: CreateConversationDto) {
    const url = `${genesoftCoreApiServiceBaseUrl}/conversation`;

    console.log({
        message: "createConversation",
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
        console.error("Error creating conversation:", error);
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        throw new Error("Failed to create conversation");
    }
}
