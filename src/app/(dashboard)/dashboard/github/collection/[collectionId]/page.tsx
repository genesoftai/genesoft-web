"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import PageLoading from "@/components/common/PageLoading";
import { getGithubRepositoriesByCollectionId } from "@/actions/github";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import {
    AppWindow,
    ArrowRightSquare,
    GitBranch,
    GithubIcon,
    Server,
} from "lucide-react";
import GithubRepositoryInput from "@/components/github-repository/GithubRepositoryInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
    branches?: Branch[];
}

interface RepositoriesData {
    web_repository: Repository;
    backend_repositories: Repository[];
}

const RepositoryPage = () => {
    const { collectionId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [repositoriesData, setRepositoriesData] =
        useState<RepositoriesData | null>(null);
    const { id: organizationId } = useGenesoftOrganizationStore();

    useEffect(() => {
        const fetchRepositories = async () => {
            if (!organizationId) {
                return;
            }
            try {
                const response = await getGithubRepositoriesByCollectionId(
                    organizationId,
                    collectionId as string,
                );

                if (!response) {
                    throw new Error("Failed to fetch repositories");
                }

                setRepositoriesData(response);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [organizationId, collectionId]);

    if (loading) {
        return <PageLoading size={50} text={"Loading repository details..."} />;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-genesoft-dark text-white w-full">
            <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-2 sm:px-4">
                    <SidebarTrigger className="-ml-0.5 sm:-ml-1 text-white" />
                    <Separator
                        orientation="vertical"
                        className="mr-1 sm:mr-2 h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage
                                    className="text-white cursor-pointer"
                                    onClick={() =>
                                        router.push(
                                            "/dashboard/github/repository",
                                        )
                                    }
                                >
                                    Github Repository
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white">
                                    Collection
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0 w-full">
                <div className="p-2 sm:p-4 w-full flex flex-col gap-2 sm:gap-4 justify-center items-center">
                    <p className="text-white text-base sm:text-xl md:text-3xl font-bold">
                        What is the task you want to delegate to Full Stack Web
                        Development Team of AI Agents ?
                    </p>
                    <GithubRepositoryInput
                        onSubmit={({ text }) => {
                            console.log("Sending:", text);
                        }}
                        onAttach={() => {
                            console.log("Attach clicked");
                        }}
                        placeholder="Ex. develop shopping page that fetch realtime products information from backend services API and display it in the web application"
                    />
                </div>

                <div className="min-h-[100vh] flex-1 rounded-lg md:min-h-min p-2 sm:p-4 w-full">
                    {repositoriesData && (
                        <div className="grid grid-cols-1 gap-3 sm:gap-6 place-items-center">
                            <div className="flex flex-row gap-2 items-center">
                                <GithubIcon className="w-4 h-4 sm:w-6 sm:h-6 text-subtext-in-dark-bg" />
                                <p className="text-sm sm:text-lg md:text-2xl font-semibold text-subtext-in-dark-bg">
                                    Github Repositories of Collection
                                </p>
                            </div>

                            <Tabs defaultValue="web" className="w-full">
                                <TabsList className="grid grid-cols-2 bg-secondary-dark text-white w-fit mx-auto justify-center rounded-lg h-10 md:h-12">
                                    <TabsTrigger
                                        value="web"
                                        className="flex gap-4 px-6 py-2 data-[state=active]:bg-genesoft data-[state=active]:text-white hover:bg-zinc-800"
                                    >
                                        <AppWindow className="w-6 h-6 text-white" />
                                        <span className="text-xs sm:text-sm md:text-base">
                                            Web Frontend
                                        </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="backend"
                                        className="flex gap-4 px-6 py-2 data-[state=active]:bg-amber-500 data-[state=active]:text-black hover:bg-zinc-800"
                                    >
                                        <Server className="w-6 h-6 text-white" />
                                        <span className="text-xs sm:text-sm md:text-base">
                                            Backend Services
                                        </span>
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="web"
                                    className="w-10/12 md:w-6/12 mx-auto"
                                >
                                    {repositoriesData.web_repository ? (
                                        <div className="bg-secondary-dark/50 rounded-lg p-4 w-full">
                                            <div className="flex flex-col items-start gap-2">
                                                <div className="flex gap-x-2 items-center">
                                                    <AppWindow className="w-6 h-6 text-genesoft" />
                                                    <p className="text-lg font-bold">
                                                        {
                                                            repositoriesData
                                                                .web_repository
                                                                .name
                                                        }
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-start">
                                                    <p>
                                                        Active branches on
                                                        Genesoft
                                                    </p>
                                                    {repositoriesData.web_repository.branches?.map(
                                                        (branch) => (
                                                            <div
                                                                key={branch.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <GitBranch className="w-6 h-6 text-amber-500" />
                                                                <span className="text-sm text-white">
                                                                    {
                                                                        branch.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-subtext-in-dark-bg">
                                            <p>No Web Repository Found</p>
                                            <Button
                                                onClick={() =>
                                                    router.push(
                                                        "/dashboard/collection",
                                                    )
                                                }
                                                className="bg-genesoft text-white mt-4 hover:bg-genesoft/80"
                                            >
                                                <span className="text-sm sm:text-base md:text-lg ">
                                                    Manage Collection
                                                </span>
                                                <ArrowRightSquare className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent
                                    value="backend"
                                    className="w-10/12 md:w-6/12 mx-auto"
                                >
                                    {repositoriesData.backend_repositories
                                        .length > 0 ? (
                                        <div className="space-y-4">
                                            {repositoriesData.backend_repositories.map(
                                                (repo) => (
                                                    <div
                                                        key={repo.id}
                                                        className="bg-secondary-dark/50 rounded-lg p-4 w-full"
                                                    >
                                                        <div className="flex flex-col items-start gap-2">
                                                            <div className="flex gap-x-2 items-center">
                                                                <Server className="w-6 h-6 text-amber-500" />
                                                                <p className="text-lg font-bold">
                                                                    {repo.name}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col items-start">
                                                                <p>
                                                                    Active
                                                                    branches on
                                                                    Genesoft
                                                                </p>
                                                                {repo.branches?.map(
                                                                    (
                                                                        branch,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                branch.id
                                                                            }
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <GitBranch className="w-6 h-6 text-amber-500" />
                                                                            <span className="text-sm text-white">
                                                                                {
                                                                                    branch.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-subtext-in-dark-bg">
                                            <p>No Backend Repositories Found</p>
                                            <Button
                                                onClick={() =>
                                                    router.push(
                                                        "/dashboard/collection",
                                                    )
                                                }
                                                className="bg-genesoft text-white mt-4 hover:bg-genesoft/80"
                                            >
                                                <span className="text-sm sm:text-base md:text-lg ">
                                                    Manage Collection
                                                </span>
                                                <ArrowRightSquare className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepositoryPage;
