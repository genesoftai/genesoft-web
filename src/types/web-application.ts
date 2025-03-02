export enum DeploymentStatus {
    NOT_DEPLOYED = "not_deployed",
    DEPLOYED = "deployed",
}

export enum ReadyStatus {
    BUILDING = "BUILDING",
    READY = "READY",
    FAILED = "FAILED",
}

export enum DevelopmentStatus {
    DEVELOPMENT_DONE = "development_done",
    FEEDBACK_ITERATION_IN_PROGRESS = "feedback_iteration_in_progress",
    REQUIREMENTS_ITERATION_IN_PROGRESS = "requirements_iteration_in_progress",
    PAGE_ITERATION_IN_PROGRESS = "page_iteration_in_progress",
    FEATURE_ITERATION_IN_PROGRESS = "feature_iteration_in_progress",
}

export interface WebApplicationInfo {
    status: DeploymentStatus;
    developmentStatus: DevelopmentStatus;
    url: string;
    readyAt: number;
    developmentDoneAt: number;
    readyStatus: ReadyStatus;
}
