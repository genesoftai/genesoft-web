export interface ConversationWithIterations {
    id: string;
    name: string;
    project_id: string;
    iteration_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    iteration: {
        id: string;
        project_id: string;
        status: string;
        type: string;
        working_time: string;
        created_at: string;
        updated_at: string;
    };
}
