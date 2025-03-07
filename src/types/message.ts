export interface Message {
    id: string;
    content: string;
    sender_id?: string;
    sender_type: "user" | "ai_agent" | "system";
    conversation_id: string;
    message_type: string;
    image_url?: string;
    sender?: {
        name: string;
        email?: string;
        image?: string;
    };
    file_ids?: string[] | null;
    reference_link_ids?: string[] | null;
    created_at?: Date;
    updated_at?: Date;
    files?: {
        id: string;
        url: string;
    }[];
}

export interface ConversationMessage {
    id: string;
    content: string;
    sender_id: string;
    sender_type: string;
    conversation_id: string;
    message_type: string;
    file_ids?: string[];
    reference_link_ids?: string[];
    created_at: Date;
    updated_at: Date;
    status: string;
}

export interface ConversationMessageForWeb extends ConversationMessage {
    messages: Message[];
}

export interface ConversationByPageId {
    id: string;
    name: string | null;
    project_id: string;
    page_id: string;
    feature_id: string | null;
    iteration_id: string | null;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export interface ConversationByFeatureId {
    id: string;
    name: string | null;
    project_id: string;
    page_id: string;
    feature_id: string | null;
    iteration_id: string | null;
    status: string;
    created_at: Date;
    updated_at: Date;
}
