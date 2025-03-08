export type IterationForSprint = {
    id: string;
    project_id: string;
    status: string;
    type: string;
    feedback_id: string | null;
    working_time: string;
    created_at: string;
    updated_at: string;
};

export type MonthlySprint = {
    iterations: Array<IterationForSprint>;
    count: number;
    exceeded: boolean;
    tier: string;
    remaining: number;
};
