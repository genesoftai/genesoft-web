export interface FeedbackMessage {
    sender: string;
    content: string;
    timestamp: number;
}

export interface Feedback {
    id: string;
    project_id: string;
    is_submit: boolean;
    messages: FeedbackMessage[];
    status: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateFeedbackRequest {
    project_id: string;
    is_submit?: boolean;
    messages?: FeedbackMessage[];
    status?: string;
}

export interface TalkToFeedbackRequest {
    project_id: string;
    feedback_id: string;
    messages: FeedbackMessage[];
}
