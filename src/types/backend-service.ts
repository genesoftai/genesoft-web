export enum DeploymentStatus {
    NOT_DEPLOYED = "not_deployed",
    DEPLOYED = "deployed",
}

export enum ReadyStatus {
    BUILDING = "BUILDING",
    READY = "READY",
    ERROR = "ERROR",
    QUEUED = "QUEUED",
}

export enum DevelopmentStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DEVELOPMENT_DONE = "development_done",
}

export interface BackendServiceInfo {
    developmentStatus: DevelopmentStatus;
    developmentDoneAt: number;
    codesandboxUrl: string | null;
    sandboxId: string | null;
    codesandboxPreviewUrl: string | null;
}
