"use client";

import { getProjectById } from "@/actions/project";
import PageLoading from "@/components/common/PageLoading";
import { useProjectStore } from "@/stores/project-store";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BackendAiAgent from "@/components/project/backend/BackendAiAgent";
import { useCollectionStore } from "@/stores/collection-store";
import WebAiAgent from "@/components/project/web/WebAiAgent";

const AiAgentPage = () => {
    const { id: projectId, updateProjectStore } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { web_project_id, backend_service_project_ids } =
        useCollectionStore();

    const setupProject = async () => {
        setLoading(true);
        try {
            const projectData = await getProjectById(projectId);
            setProject(projectData);
            updateProjectStore(projectData);
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            setupProject();
        }
    }, [projectId]);

    if (loading) {
        return <PageLoading text="Loading page information..." />;
    }

    const handleGoToWebProject = () => {
        if (web_project_id) {
            updateProjectStore({
                id: web_project_id,
            });
            router.push(`/dashboard/project/${web_project_id}/ai-agent`);
        }
    };

    const handleGoToBackendProject = () => {
        if (
            backend_service_project_ids &&
            backend_service_project_ids.length > 0
        ) {
            updateProjectStore({
                id: backend_service_project_ids[0],
            });
            router.push(
                `/dashboard/project/${backend_service_project_ids[0]}/ai-agent`,
            );
        }
    };

    const handleSaveProjectInfo = async (project: Project) => {
        setProject(project);
    };

    if (
        project?.project_template_type &&
        project?.project_template_type.startsWith("backend")
    ) {
        return (
            <BackendAiAgent
                project={project}
                handleGoToBackendProject={handleGoToBackendProject}
                handleGoToWebProject={handleGoToWebProject}
                onSaveProjectInfo={handleSaveProjectInfo}
            />
        );
    }

    if (
        project?.project_template_type &&
        project?.project_template_type.startsWith("web")
    ) {
        return (
            <WebAiAgent
                project={project}
                handleGoToBackendProject={handleGoToBackendProject}
                handleGoToWebProject={handleGoToWebProject}
                onSaveProjectInfo={handleSaveProjectInfo}
            />
        );
    }

    return <PageLoading text="Loading project information..." />;
};

export default AiAgentPage;
