"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import PageLoading from "@/components/common/PageLoading";
import {
    getBranchesFromGithubByRepositoryId,
    getGithubRepositoriesByOrganizationId,
    getGithubRepositoryById,
    submitGithubRepositoryTask,
} from "@/actions/github";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import {
    AlertCircleIcon,
    AppWindow,
    ArrowRight,
    GitBranch,
    GitForkIcon,
    GithubIcon,
    Loader2,
    Server,
} from "lucide-react";
import GithubRepositoryInput from "@/components/github-repository/GithubRepositoryInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { Project } from "@/types/project";
import { getProjectById } from "@/actions/project";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import FigmaLogo from "@public/brand/figma.svg";
import { Input } from "@/components/ui/input";
import {
    getFigmaFileByProjectId,
    updateFigmaFileByProjectId,
} from "@/actions/figma";
import { Label } from "@/components/ui/label";
import GenesoftNewLogo from "@public/assets/genesoft-new-logo.png";
import EnvironmentVariablesSheet from "@/components/project/services/EnvironmentVariablesSheet";
import { useProjectStore } from "@/stores/project-store";
import SetupCommandSheet from "@/components/project/services/SetupCommandSheet";

interface Branch {
    id: string;
    github_repository_id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    sandbox_id: string | null;
}

interface GithubBranch {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
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

const StarParticle = ({ delay }: { delay: number }) => {
    const colors = [
        "bg-blue-400",
        "bg-purple-400",
        "bg-pink-400",
        "bg-green-400",
        "bg-yellow-400",
        "bg-red-400",
        "bg-indigo-400",
        "bg-teal-400",
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <motion.div
            className={`absolute w-1 h-1 ${randomColor} rounded-full`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
            }}
            transition={{
                duration: 2,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            }}
        />
    );
};

const RepositoryPage = () => {
    const { repository: repositoryId } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [repositoryData, setRepositoryData] = useState<Repository | null>(
        null,
    );
    const { id: organizationId } = useGenesoftOrganizationStore();
    const { id: userId } = useGenesoftUserStore();
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [stars, setStars] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [project, setProject] = useState<Project | null>(null);
    const [figmaFileUrl, setFigmaFileUrl] = useState("");
    const [isFigmaFileDialogOpen, setIsFigmaFileDialogOpen] = useState(false);
    const [isFigmaFileDialogLoading, setIsFigmaFileDialogLoading] =
        useState(false);
    const [branches, setBranches] = useState<GithubBranch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("");
    const [
        isEnvironmentVariablesSheetOpen,
        setIsEnvironmentVariablesSheetOpen,
    ] = useState(false);
    const [isSetupCommandSheetOpen, setIsSetupCommandSheetOpen] =
        useState(false);
    const { updateProjectStore } = useProjectStore();

    useEffect(() => {
        setStars(Array.from({ length: 30 }, (_, i) => i)); // Reduced star count from 100 to 30
    }, []);

    useEffect(() => {
        const fetchRepository = async () => {
            setLoading(true);
            try {
                if (!organizationId || !repositoryId) {
                    return;
                }
                const response = await getGithubRepositoryById(
                    organizationId,
                    repositoryId as string,
                );
                setRepositoryData(response);
                setupProject(response?.project_id);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An error occurred",
                );
            } finally {
                setLoading(false);
            }
        };
        fetchRepository();
        setupBranches();
    }, [repositoryId, organizationId]);

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

    const setupProject = async (id: string) => {
        try {
            const response = await getProjectById(id);
            setProject(response);
            updateProjectStore(response);
        } catch (error) {
            console.error(error);
        }
    };

    const setupBranches = async () => {
        const response = await getBranchesFromGithubByRepositoryId(
            organizationId as string,
            repositoryId as string,
        );
        setBranches(response);
    };

    const handleSubmitTask = async (message: string) => {
        setIsSubmitting(true);
        let result: any = null;
        try {
            const response = await submitGithubRepositoryTask({
                message,
                userId: userId,
                repositoryId: String(repositoryId),
                organizationId: String(organizationId),
            });
            result = response;
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
            if (result?.newBranch?.id) {
                router.push(
                    `/dashboard/github/repository/${repositoryId}/branch/${result?.newBranch?.id}`,
                );
            }
        }
    };

    const handleAddFigmaFile = async () => {
        try {
            setIsFigmaFileDialogLoading(true);
            if (!project?.id) {
                throw new Error("Project ID is required");
            }
            const response = await updateFigmaFileByProjectId(
                project?.id,
                figmaFileUrl,
            );
            setProject({
                ...project,
                figma_file_id: response?.figmaFile?.figma_file_id,
            });
            console.log({ response });
        } catch (error) {
            console.error(error);
        } finally {
            setIsFigmaFileDialogOpen(false);
            setIsFigmaFileDialogLoading(false);
        }
    };

    const setupFigmaFileUrl = async () => {
        if (project?.figma_file_id) {
            const response = await getFigmaFileByProjectId(project?.id);
            setFigmaFileUrl(response?.figma_file_url);
        }
    };

    useEffect(() => {
        if (project?.id) {
            setupFigmaFileUrl();
        }
    }, [project]);

    const handleSetEnv = () => {
        console.log({ message: "set env" });
    };

    const handleSetCommand = () => {
        console.log({ message: "set command" });
    };

    console.log({
        project,
        branches,
    });

    if (loading) {
        return <PageLoading size={50} text={"Loading repository details..."} />;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-genesoft-dark text-white w-full relative overflow-hidden">
            <AnimatePresence>
                {stars.map((_, i) => (
                    <StarParticle key={i} delay={i * 0.05} />
                ))}
            </AnimatePresence>
            <header className="flex justify-between h-14 sm:h-16 shrink-0 items-center gap-2 z-10">
                <div className="flex items-center gap-2 px-2 sm:px-4">
                    <SidebarTrigger className="-ml-0.5 sm:-ml-1 text-white" />
                    <Separator orientation="vertical" className="h-4" />
                    <div className="hidden md:flex items-center gap-2">
                        <Image
                            src={GenesoftNewLogo}
                            alt="Genesoft Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                        <p className="text-white text-lg font-bold">Genesoft</p>
                    </div>
                    <div className="hidden sm:flex md:hidden items-center gap-1.5">
                        <Image
                            src={GenesoftNewLogo}
                            alt="Genesoft Logo"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                        />
                        <p className="text-white text-sm font-bold">Genesoft</p>
                    </div>
                    <div className="flex sm:hidden items-center gap-1">
                        <Image
                            src={GenesoftNewLogo}
                            alt="Genesoft Logo"
                            width={16}
                            height={16}
                            className="w-4 h-4"
                        />
                        <p className="text-white text-xs font-bold">Genesoft</p>
                    </div>
                </div>

                <div className="px-4 mt-4 hidden sm:flex flex-row items-center gap-2">
                    {/* Figma if web project */}
                    {/* Environment */}
                    {project?.project_template_type.includes("web") && (
                        <AlertDialog open={isFigmaFileDialogOpen}>
                            <AlertDialogTrigger
                                asChild
                                onClick={() => setIsFigmaFileDialogOpen(true)}
                            >
                                <Button
                                    variant="outline"
                                    className="w-fit bg-primary-dark border border-tertiary-dark text-left flex justify-between items-center p-2 h-auto hover:bg-primary-dark/80"
                                >
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={FigmaLogo}
                                            alt="Figma Logo"
                                            className="h-4 w-4"
                                        />
                                        <span className="text-white font-medium">
                                            Add Figma File
                                        </span>
                                    </div>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-primary-dark border-tertiary-dark max-w-[90%] md:max-w-[620px] rounded-lg flex flex-col">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                        <Image
                                            src={FigmaLogo}
                                            alt="Figma Logo"
                                            className="h-5 w-5"
                                        />
                                        <p className="text-white font-medium">
                                            Add Figma File
                                        </p>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-white/70">
                                        <p className="text-xs md:text-sm flex items-center gap-2">
                                            <AlertCircleIcon className="h-4 w-4 text-red-500" />
                                            <span>
                                                Make sure you set share settings
                                                of the file to be anyone can
                                                view
                                            </span>
                                        </p>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="mt-3">
                                    {project?.figma_file_id ? (
                                        <p className="text-subtext-in-dark-bg text-sm mb-2">
                                            Current Figma file id:{" "}
                                            {project?.figma_file_id}
                                        </p>
                                    ) : (
                                        <p className="text-subtext-in-dark-bg text-sm mb-2">
                                            Add new Figma file id by put Figma
                                            file url
                                        </p>
                                    )}
                                    <Input
                                        placeholder={`${project?.figma_file_id ? "Enter new Figma file URL" : "Enter Figma file URL"}`}
                                        value={figmaFileUrl}
                                        onChange={(e) =>
                                            setFigmaFileUrl(e.target.value)
                                        }
                                        className="border-none bg-secondary-dark text-white"
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <Button
                                        variant="outline"
                                        className="bg-genesoft text-white border-none"
                                        onClick={handleAddFigmaFile}
                                        disabled={isFigmaFileDialogLoading}
                                    >
                                        {isFigmaFileDialogLoading ? (
                                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                        ) : project?.figma_file_id ? (
                                            "Replace"
                                        ) : (
                                            "Add"
                                        )}
                                    </Button>
                                    <AlertDialogCancel
                                        className="bg-secondary-dark text-white border-line-in-dark-bg"
                                        onClick={() =>
                                            setIsFigmaFileDialogOpen(false)
                                        }
                                    >
                                        Close
                                    </AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <EnvironmentVariablesSheet
                        isOpen={isEnvironmentVariablesSheetOpen}
                        onOpenChange={setIsEnvironmentVariablesSheetOpen}
                        onSetEnv={() => handleSetEnv()}
                    />
                    <SetupCommandSheet
                        isOpen={isSetupCommandSheetOpen}
                        onOpenChange={setIsSetupCommandSheetOpen}
                        onSetCommand={() => handleSetCommand()}
                    />
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0 w-full">
                {repositoryData && (
                    <div className="grid grid-cols-1 gap-3 sm:gap-6 place-items-center">
                        {/* <div className="flex flex-row gap-2 items-center">
                            <GithubIcon className="w-4 h-4 sm:w-6 sm:h-6 text-subtext-in-dark-bg" />
                            <p className="text-sm sm:text-lg md:text-2xl font-semibold text-subtext-in-dark-bg">
                                Software engineering team of AI agents for your
                                Github repository
                            </p>
                        </div> */}

                        <div className="flex flex-col gap-2 w-full items-center">
                            <Label className="text-subtext-in-dark-bg text-xs sm:text-sm flex flex-row gap-2 items-center">
                                <GithubIcon className="w-4 h-4 sm:w-6 sm:h-6 text-subtext-in-dark-bg" />
                                <span className="text-xs sm:text-sm md:text-base font-semibold text-subtext-in-dark-bg">
                                    Github repository
                                </span>
                            </Label>
                            <Select
                                defaultValue={repositoryData?.id}
                                onValueChange={(value) => {
                                    router.push(
                                        `/dashboard/github/repository/${value}`,
                                    );
                                }}
                            >
                                <SelectTrigger className="p-2 w-10/12 sm:w-8/12 md:w-4/12 bg-transparent bg-primary-dark border-none text-white hover:bg-secondary-dark/80 text-xs sm:text-sm md:text-base">
                                    <SelectValue
                                        placeholder="Select a repository"
                                        className="text-white text-sm sm:text-base md:text-lg"
                                    />
                                </SelectTrigger>
                                <SelectContent className="bg-primary-dark border-primary-dark">
                                    {repositories.map((repository) => (
                                        <SelectItem
                                            key={repository.id}
                                            value={repository.id}
                                            className="text-white hover:bg-genesoft/20 focus:bg-genesoft/20 focus:text-white text-xs sm:text-sm md:text-base"
                                        >
                                            <div className="flex flex-row gap-2 items-center">
                                                {repository.type === "web" ? (
                                                    <div className="bg-genesoft/20 p-1 rounded-md flex gap-2 items-center">
                                                        <AppWindow className="w-4 h-4 sm:w-6 sm:h-6 text-genesoft" />
                                                        <p>{repository.type}</p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-amber-500/20 p-1 rounded-md flex gap-2 items-center">
                                                        <Server className="w-4 h-4 sm:w-6 sm:h-6 text-amber-500" />
                                                        <p>{repository.type}</p>
                                                    </div>
                                                )}
                                                <p className="text-white">
                                                    {repository.owner}/
                                                    {repository.name}
                                                </p>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col w-full items-center text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
                            <Label className="text-subtext-in-dark-bg text-xs sm:text-sm flex flex-row gap-2 items-center mb-2">
                                <GitForkIcon className="w-4 h-4 sm:w-6 sm:h-6 text-subtext-in-dark-bg" />
                                <span className="text-xs sm:text-sm md:text-base font-semibold text-subtext-in-dark-bg">
                                    Reference branch
                                </span>
                            </Label>
                            <Select
                                defaultValue={
                                    repositoryData?.development_branch
                                }
                                onValueChange={(value) => {
                                    setSelectedBranch(value);
                                }}
                            >
                                <SelectTrigger className="p-2 w-10/12 sm:w-8/12 md:w-4/12 bg-transparent bg-primary-dark border-none text-white hover:bg-secondary-dark/80 text-xs sm:text-sm md:text-base">
                                    <SelectValue
                                        placeholder="Select a branch"
                                        className="text-white text-sm sm:text-base md:text-lg"
                                    />
                                </SelectTrigger>
                                <SelectContent className="bg-primary-dark border-primary-dark">
                                    {branches.map((branch) => (
                                        <SelectItem
                                            key={branch.name}
                                            value={branch.name}
                                            className="text-white hover:bg-genesoft/20 focus:bg-genesoft/20 focus:text-white text-xs sm:text-sm md:text-base w-full"
                                        >
                                            <div className="flex flex-row gap-2 items-center">
                                                <div className="p-1 rounded-md flex gap-2 items-center">
                                                    <GitBranch className="w-4 h-4 sm:w-6 sm:h-6 text-genesoft" />
                                                    <p>{branch.name}</p>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {isSubmitting ? (
                    <div className="mb-16">
                        <div className="flex flex-col items-center justify-center">
                            <div className="bg-genesoft/10 border border-genesoft/30 rounded-xl p-6 max-w-md text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <Loader2 className="w-8 h-8 text-genesoft animate-spin mr-3" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Submitting task to Genesoft{" "}
                                    {repositoryData?.type === "web"
                                        ? "Frontend Team of AI Agents"
                                        : "Backend Team of AI Agents"}
                                </h3>
                                <div className="mt-4 text-genesoft text-sm">
                                    Please wait while we submit your task...
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-2 sm:p-4 w-full flex flex-col gap-2 sm:gap-4 justify-center items-center my-10 md:my-20">
                        <div className="text-white text-base sm:text-xl md:text-3xl font-bold flex flex-col md:flex-row  items-center gap-2">
                            <span className="text-white">
                                What is the task you want to delegate to{" "}
                            </span>

                            {repositoryData?.type === "web" ? (
                                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent font-bold">
                                    {"Frontend Team of AI Agents ?"}
                                </span>
                            ) : (
                                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text text-transparent font-bold">
                                    {"Backend Team of AI Agents ?"}
                                </span>
                            )}
                        </div>
                        <GithubRepositoryInput onSubmit={handleSubmitTask} />
                    </div>
                )}

                <div className="min-h-[100vh] flex-1 rounded-lg md:min-h-min p-2 sm:p-4 w-full z-10">
                    <div className="bg-transparent border-none overflow-hidden mt-4 w-full flex justify-center items-center">
                        <div className="p-3 sm:p-6 space-y-2 sm:space-y-3 w-10/12 md:w-6/12">
                            <p className="text-sm sm:text-lg md:text-2xl font-semibold text-subtext-in-dark-bg">
                                Active Branches on Genesoft
                            </p>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-2">
                                    {repositoryData?.branches?.map((branch) => (
                                        <div
                                            key={branch.id}
                                            className="flex items-center justify-between p-2 sm:p-3 bg-primary-dark rounded-lg border border-genesoft/20 cursor-pointer hover:bg-genesoft/20"
                                            onClick={() => {
                                                router.push(
                                                    `/dashboard/github/repository/${repositoryData?.id}/branch/${branch.id}`,
                                                );
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <GitBranch className="h-3 w-3 sm:h-4 sm:w-4 text-genesoft" />
                                                <span className="text-xs sm:text-sm md:text-base text-white font-bold">
                                                    {branch.name}
                                                </span>
                                            </div>
                                            <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 text-white border-2 bg-genesoft rounded-md p-1 border-none " />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepositoryPage;
