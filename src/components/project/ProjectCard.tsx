import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppWindow, Server, GithubIcon, GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useProjectStore } from "@/stores/project-store";
import { useCollectionStore } from "@/stores/collection-store";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { getCollectionById } from "@/actions/collection";
import { getGithubRepositoryByProjectId } from "@/actions/github";
import NextjsLogo from "@public/tech/nextjs.jpeg";
import NestjsLogo from "@public/tech/nestjs.svg";
import { getFirstCharacterUppercase } from "@/utils/common/text";
import { formatDateToHumanReadable } from "@/utils/common/time";

interface Branch {
    id: string;
    github_repository_id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sandbox_id: string | null;
}

interface Repository {
    id: string;
    project_id: string;
    type: string;
    repo_id: string;
    owner: string;
    name: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    managed_by: string | null;
    development_branch: string;
    production_branch: string;
    branches: Branch[];
}

interface ProjectCardProps {
    id: string;
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
    project_template_type: string;
    backend_requirements: string;
    collectionId?: string;
    created_at: string;
}

export function ProjectCard({
    id,
    name,
    description,
    purpose,
    target_audience,
    project_template_type,
    backend_requirements,
    collectionId,
    created_at,
}: ProjectCardProps) {
    const router = useRouter();
    const { updateProjectStore } = useProjectStore();
    const [projectType, setProjectType] = useState("");
    const { updateCollectionStore, clearCollectionStore } =
        useCollectionStore();
    const [isLoading, setIsLoading] = useState(false); // Shared loading state
    const [repositoryData, setRepositoryData] = useState<Repository | null>(
        null,
    );
    const [isRepoLoading, setIsRepoLoading] = useState(false);

    const { id: organizationId } = useGenesoftOrganizationStore();

    useEffect(() => {
        if (project_template_type.startsWith("backend")) {
            setProjectType("backend");
        } else {
            setProjectType("frontend");
        }
    }, [project_template_type]);

    useEffect(() => {
        let mounted = true;
        const fetchRepository = async () => {
            if (!id || !organizationId) {
                if (mounted) {
                    setRepositoryData(null);
                    setIsRepoLoading(false);
                }
                return;
            }
            if (mounted) {
                setIsRepoLoading(true);
            }
            try {
                const response = await getGithubRepositoryByProjectId(
                    organizationId,
                    id,
                );
                if (mounted) {
                    setRepositoryData(response);
                }
            } catch (error) {
                console.error(
                    `Failed to fetch repository data for project ${id}:`,
                    error,
                );
                if (mounted) {
                    setRepositoryData(null);
                }
            } finally {
                if (mounted) {
                    setIsRepoLoading(false);
                }
            }
        };

        fetchRepository();
        return () => {
            mounted = false;
        };
    }, [id, organizationId]);

    const handleGoToAiAgentWorkspace = async () => {
        setIsLoading(true);
        try {
            updateProjectStore({
                id,
                name,
                description,
                purpose,
                target_audience,
            });
            if (collectionId) {
                await handleSetupCollectionForWorkspace();
                router.push(`/dashboard/github/collection/${collectionId}`);
            } else {
                clearCollectionStore();
                router.push(
                    `/dashboard/github/repository/${repositoryData?.id}`,
                );
            }
        } catch (error) {
            console.error("Error preparing workspace:", error);
            // Potentially show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupCollectionForWorkspace = async () => {
        if (!collectionId) return;
        try {
            const collection = await getCollectionById(collectionId);
            updateCollectionStore({
                id: collection.id,
                name: collection.name,
                description: collection.description,
                is_active: collection.is_active,
                web_project_id: collection.web_project_id,
                backend_service_project_ids:
                    collection.backend_service_project_ids,
                organization_id: collection.organization_id,
                created_at: collection.created_at,
                updated_at: collection.updated_at,
            });
        } catch (error) {
            console.error("Error setting up collection for workspace:", error);
            // Potentially show an error message to the user
        }
    };

    return (
        <Card className="w-full md:w-8/12 h-auto bg-primary-dark text-white flex flex-col border-none mb-4 md:mb-0">
            <CardHeader>
                <CardTitle className="text-base md:text-xl flex flex-row items-center gap-2 justify-between">
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-row items-center gap-2">
                            {projectType === "backend" ? (
                                <Server className="w-6 h-6 text-amber-500" />
                            ) : (
                                <AppWindow className="w-6 h-6 text-genesoft" />
                            )}
                            <span className="text-lg md:text-xl font-bold">
                                {name}
                            </span>
                        </div>

                        <p className="flex flex-row items-center gap-2">
                            <span className="text-xs md:text-base text-subtext-in-dark-bg">
                                {getFirstCharacterUppercase(projectType)}
                            </span>
                            <span className="text-xs md:text-base text-subtext-in-dark-bg">
                                {project_template_type
                                    .split("_")[1]
                                    ?.toUpperCase()}
                            </span>
                        </p>
                    </div>
                    <span className="text-xs md:text-base">
                        {projectType === "backend" ? (
                            <Image
                                src={NestjsLogo}
                                alt="Nestjs Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <Image
                                src={NextjsLogo}
                                alt="Nextjs Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        )}
                    </span>
                </CardTitle>
                <CardDescription className="flex flex-col items-start text-sm md:text-base w-full pt-4 space-y-4">
                    <div className="w-full">
                        <p className="text-subtext-in-dark-bg font-medium">
                            {projectType === "backend"
                                ? "Backend Requirements"
                                : "Web Application Description"}
                        </p>
                        <p className="text-subtext-in-dark-bg text-xs md:text-sm max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent p-2 mt-1 rounded-lg bg-secondary-dark/50">
                            {projectType === "backend"
                                ? backend_requirements
                                : description}
                        </p>
                    </div>

                    {purpose && purpose.length > 0 && (
                        <div className="w-full">
                            <p className="text-subtext-in-dark-bg font-medium">
                                Purpose
                            </p>
                            <p className="text-subtext-in-dark-bg text-xs md:text-sm mt-1">
                                {purpose}
                            </p>
                        </div>
                    )}

                    {target_audience && target_audience.length > 0 && (
                        <div className="w-full">
                            <p className="text-subtext-in-dark-bg font-medium">
                                Target Audience
                            </p>
                            <p className="text-subtext-in-dark-bg text-xs md:text-sm mt-1">
                                {target_audience}
                            </p>
                        </div>
                    )}

                    {/* Repository Details Section */}
                    <div className="w-full pt-2">
                        {isRepoLoading && (
                            <div>
                                <p className="text-subtext-in-dark-bg font-medium flex items-center gap-2">
                                    <GithubIcon className="w-5 h-5" />
                                    Repository Details
                                </p>
                                <p className="text-subtext-in-dark-bg text-xs md:text-sm mt-1">
                                    Loading repository information...
                                </p>
                            </div>
                        )}
                        {!isRepoLoading && repositoryData && (
                            <div>
                                <p className="text-subtext-in-dark-bg font-medium flex items-center gap-2 mb-1">
                                    <GithubIcon className="w-5 h-5" />
                                    Github Repository
                                </p>
                                <div className="text-subtext-in-dark-bg text-xs md:text-sm p-3 rounded-lg bg-secondary-dark/50 mt-1 space-y-1.5">
                                    <p>
                                        <a
                                            href={`https://github.com/${repositoryData.full_name}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-blue-400"
                                        >
                                            {repositoryData.full_name}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                        {!isRepoLoading &&
                            !repositoryData &&
                            id &&
                            organizationId && (
                                <div>
                                    <p className="text-subtext-in-dark-bg font-medium flex items-center gap-2">
                                        <GithubIcon className="w-5 h-5" />
                                        Repository Details
                                    </p>
                                    <p className="text-subtext-in-dark-bg text-xs md:text-sm mt-1">
                                        No repository information linked to this
                                        project.
                                    </p>
                                </div>
                            )}
                    </div>
                </CardDescription>
            </CardHeader>
            <Separator className="w-full bg-secondary-dark mt-4" />
            <CardFooter className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4 md:gap-0">
                <div className="flex flex-row items-center gap-1 text-subtext-in-dark-bg">
                    <p className="text-xs">Created on</p>
                    <p className="text-xs">
                        {formatDateToHumanReadable(created_at)}
                    </p>
                </div>
                <Button
                    className="w-full md:w-auto bg-genesoft text-white rounded-lg text-xs md:text-base"
                    onClick={handleGoToAiAgentWorkspace}
                    disabled={isLoading || isRepoLoading}
                >
                    <GithubIcon className="w-4 h-4" />
                    <span className="text-xs md:text-base">
                        {isLoading
                            ? "Loading workspace..."
                            : "Project Workspace"}
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
}
