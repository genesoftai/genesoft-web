"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { getGithubRepositoriesByOrganizationId } from "@/actions/github";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import PageLoading from "@/components/common/PageLoading";
import Image from "next/image";
import GithubLogo from "@public/brand/github.webp";
import {
    AppWindow,
    ArrowRight,
    ArrowRightSquare,
    GitBranch,
    GithubIcon,
    Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
}

const RepositoriesPage = () => {
    const router = useRouter();
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id: organizationId } = useGenesoftOrganizationStore();

    useEffect(() => {
        const fetchRepositories = async () => {
            console.log("organizationId", organizationId);
            if (!organizationId) {
                return;
            }
            try {
                const response =
                    await getGithubRepositoriesByOrganizationId(organizationId);

                if (!response || response.length === 0) {
                    throw new Error("Failed to fetch repositories");
                }

                setRepositories(response);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [organizationId]);

    const handleRepositoryClick = (repoName: string) => {
        router.push(`/dashboard/github/repository/${repoName}`);
    };

    if (loading) {
        return <PageLoading size={50} text={"Loading repositories..."} />;
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
                                <BreadcrumbPage className="text-white text-sm sm:text-base">
                                    Repositories
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0 w-full">
                <div className="min-h-[100vh] flex-1 rounded-lg sm:rounded-xl bg-genesoft-dark md:min-h-min p-2 sm:p-4 w-full">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <div className="flex justify-center items-center gap-2 sm:gap-4">
                            <Image
                                src={GithubLogo}
                                alt="Github Logo"
                                width={64}
                                height={64}
                                className="hidden md:block rounded-md"
                            />
                            <Image
                                src={GithubLogo}
                                alt="Github Logo"
                                width={32}
                                height={32}
                                className="flex md:hidden rounded-md"
                            />
                            <p className="text-base sm:text-lg md:text-2xl font-bold text-subtext-in-dark-bg">
                                Github Repositories
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="w-fit text-xs sm:text-sm bg-genesoft hover:bg-genesoft/80 text-white border-none shadow-md self-center hover:text-white transition-all duration-200"
                        >
                            <GithubIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-2" />
                            <span className="text-xs sm:text-sm">
                                Import Repository
                            </span>
                        </Button>
                    </div>
                    <ScrollArea className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                            {repositories.map((repo) => (
                                <Card
                                    key={repo.id}
                                    className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-primary-dark border-none overflow-hidden group"
                                    onClick={() =>
                                        handleRepositoryClick(repo.id)
                                    }
                                >
                                    <CardContent className="p-3 sm:p-6 relative flex flex-col gap-2">
                                        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                                            <Badge className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md flex items-center gap-1.5 sm:gap-2 w-fit bg-genesoft/20">
                                                {repo.type === "web" ? (
                                                    <AppWindow className="w-4 h-4 sm:w-6 sm:h-6 text-genesoft" />
                                                ) : (
                                                    <Server className="w-4 h-4 sm:w-6 sm:h-6 text-amber-500" />
                                                )}
                                                <p className="text-white text-xs sm:text-sm">
                                                    {repo.type}
                                                </p>
                                            </Badge>

                                            <p
                                                className={`text-sm md:text-xl font-semibold text-subtext-in-dark-bg transition-colors`}
                                            >
                                                {repo.owner}/{repo.name}
                                            </p>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
                                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                                                    <div className="flex items-center gap-2 bg-primary-dark/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-genesoft/20 w-full sm:w-auto">
                                                        <GitBranch className="h-3 w-3 sm:h-4 sm:w-4 text-genesoft" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] sm:text-xs text-genesoft">
                                                                Development
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-white font-bold">
                                                                {
                                                                    repo.development_branch
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-primary-dark/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-amber-500/20 w-full sm:w-auto">
                                                        <GitBranch className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] sm:text-xs text-amber-500">
                                                                Production
                                                            </span>
                                                            <span className="text-xs sm:text-sm text-white font-bold">
                                                                {
                                                                    repo.production_branch
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-2 sm:mt-4">
                                            <Button
                                                variant="outline"
                                                className="w-fit text-xs sm:text-sm bg-genesoft hover:bg-genesoft/80 hover:text-white text-white border-none shadow-md self-center hover:translate-y-[-2px] transition-all duration-200"
                                            >
                                                <span className="text-xs sm:text-sm">
                                                    Select Repository
                                                </span>
                                                <ArrowRightSquare className="w-4 h-4 sm:w-6 sm:h-6 text-white ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default RepositoriesPage;
