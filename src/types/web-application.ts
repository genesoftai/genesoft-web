export enum DeploymentStatus {
    NOT_DEPLOYED = "not_deployed",
    DEPLOYED = "deployed",
}

export enum ReadyStatus {
    BUILDING = "BUILDING",
    READY = "READY",
    ERROR = "ERROR",
}

export enum DevelopmentStatus {
    DEVELOPMENT_DONE = "development_done",
    FEEDBACK_ITERATION_IN_PROGRESS = "feedback_iteration_in_progress",
    REQUIREMENTS_ITERATION_IN_PROGRESS = "requirements_iteration_in_progress",
    PAGE_ITERATION_IN_PROGRESS = "page_iteration_in_progress",
    FEATURE_ITERATION_IN_PROGRESS = "feature_iteration_in_progress",
}

export interface RepositoryBuild {
    id: string;
    project_id: string;
    iteration_id: string;
    type: "web";
    status: "pending" | "in_progress" | "deployed" | "failed";
    error_logs: string;
    fix_attempts: number;
    fix_triggered: boolean;
    last_fix_attempt: string | null;
    created_at: string;
    updated_at: string;
}
export interface WebApplicationInfo {
    status: DeploymentStatus;
    developmentStatus: DevelopmentStatus;
    url: string;
    readyAt: number;
    developmentDoneAt: number;
    readyStatus: ReadyStatus;
    repositoryBuild: RepositoryBuild;
}
