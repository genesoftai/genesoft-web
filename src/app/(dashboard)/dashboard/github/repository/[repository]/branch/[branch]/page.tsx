"use client";

import { getBranchById } from "@/actions/github";
import PageLoading from "@/components/common/PageLoading";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Project } from "@/types/project";
import Image from "next/image";

import GenesoftNewLogo from "@public/assets/genesoft-new-logo.png";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight, ChevronRight } from "lucide-react";
import WebWorkspaceForBranch from "@/components/project/web/github/WebWorkspaceForBranch";

interface Branch {
    id: string;
    github_repository_id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sandbox_id: string | null;
}

const GithubBranchPage = () => {
    const { repository: repositoryId, branch: branchId } = useParams();
    const router = useRouter();
    const { id: organizationId } = useGenesoftOrganizationStore();

    const [branchData, setBranchData] = useState<Branch | null>(null);
    const [repositoryData, setRepositoryData] = useState<Repository | null>(
        null,
    );
    const [repositoryName, setRepositoryName] = useState<string | null>(null);
    const [branchName, setBranchName] = useState<string | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const setupBranch = async () => {
        if (!organizationId || !repositoryId || !branchId) {
            setLoading(false);
            setError("Missing organization, repository, or branch ID.");
            return;
        }

        setLoading(true);
        try {
            const branchDetails = await getBranchById(
                organizationId,
                branchId as string,
            );
            setBranchName(branchDetails?.name);
            setRepositoryName(branchDetails?.repository?.name);
            setBranchData(branchDetails);
            setRepositoryData(branchDetails?.repository);
            setProject(branchDetails?.project);
        } catch (err) {
            console.error("Error fetching branch:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setupBranch();
    }, [organizationId, repositoryId, branchId]);

    if (loading) {
        return <PageLoading text="Loading branch information..." />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-genesoft-dark text-white w-full relative overflow-hidden px-2">
            {/* {project?.project_template_type?.startsWith("backend") ? (
                    <BackendAiAgent
                        project={project}
                        handleGoToBackendProject={handleGoToBackendProject}
                        handleGoToWebProject={handleGoToWebProject}
                        onSaveProjectInfo={handleSaveProjectInfo}
                    />
                ) : project?.project_template_type?.startsWith("web") ? (
                    <WebAiAgent
                        project={project}
                        handleGoToBackendProject={handleGoToBackendProject}
                        handleGoToWebProject={handleGoToWebProject}
                        onSaveProjectInfo={handleSaveProjectInfo}
                    />
                ) : null} */}
            <WebWorkspaceForBranch
                project={project}
                handleGoToBackendProject={() => {}}
                handleGoToWebProject={() => {}}
                onSaveProjectInfo={() => {}}
                repository={repositoryData}
                branch={branchData}
            />
        </div>
    );
};

export default GithubBranchPage;
