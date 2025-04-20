export type IterationTask = {
    id: string;
    iteration_id: string;
    name: string;
    description: string;
    team: string;
    status: string;
    remark: string | null;
    working_time: string;
    tool_usage: Record<string, string>;
    llm_usage: Record<string, string>;
    result: Record<string, string>;
    created_at: string;
    updated_at: string;
};

export type LatestIteration = {
    id: string;
    project_id: string;
    status: string;
    type: string;
    feedback_id: string | null;
    working_time: string;
    created_at: string;
    updated_at: string;
    conversation: {
        id: string;
        name: string;
        project_id: string;
        page_id: string;
        feature_id: string | null;
        iteration_id: string;
        status: string;
        created_at: string;
        updated_at: string;
    };
    page: {
        id: string;
        project_id: string;
        name: string;
        description: string;
        file_ids: string[];
        reference_link_ids: string[];
        created_at: string;
        updated_at: string;
    };
    feature: {
        id: string;
        project_id: string;
        name: string;
        description: string;
        file_ids: string[];
        reference_link_ids: string[];
        created_at: string;
        updated_at: string;
    };
    iteration_tasks?: Array<IterationTask>;
};

export type IterationWithTask = {
    id: string;
    project_id: string;
    status: string;
    type: string;
    feedback_id: string | null;
    working_time: string;
    created_at: string;
    updated_at: string;
    iteration_tasks: IterationTask[];
};
export type LatestDeployment = {
    deployment: {
        uid: string;
        name: string;
        url: string;
        created: number;
        source: string;
        state: string;
        readyState: string;
        type: string;
        creator: {
            uid: string;
            email: string;
            username: string;
            githubLogin: string;
        };
        inspectorUrl: string;
        meta: {
            githubCommitAuthorName: string;
            githubCommitMessage: string;
            githubCommitOrg: string;
            githubCommitRef: string;
            githubCommitRepo: string;
            githubCommitSha: string;
            githubDeployment: string;
            githubOrg: string;
            githubRepo: string;
            githubRepoOwnerType: string;
            githubCommitRepoId: string;
            githubRepoId: string;
            githubRepoVisibility: string;
            githubCommitAuthorLogin: string;
            branchAlias: string;
        };
        target: string | null;
        aliasAssigned: string | null;
        isRollbackCandidate: boolean;
        createdAt: number;
        buildingAt: number;
        ready: number;
        projectSettings: {
            commandForIgnoringBuildStep: string | null;
        };
    };
    status: string;
    errorMessage: string;
};

export type IterationStep = {
    id: string;
    iteration_task_id: string;
    name: string;
    description: string;
    status: string;
    remark: string;
    tool: string;
    created_at: string;
    updated_at: string;
};
