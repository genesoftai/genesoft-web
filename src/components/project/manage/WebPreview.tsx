import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MessageSquare, AppWindow, Loader2, Globe } from "lucide-react";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import { buildWebApplication, checkBuildErrors } from "@/actions/development";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getWebApplicationInfo } from "@/actions/web-application";
import {
    DeploymentStatus,
    DevelopmentStatus,
    WebApplicationInfo,
} from "@/types/web-application";
import { DevelopmentStatusBadge } from "../web-application/DevelopmentStatus";
import { DeploymentStatusBadge } from "../web-application/DeploymentStatus";
import posthog from "posthog-js";

interface WebPreviewProps {
    project: Project | null;
}

export function WebPreview({ project }: WebPreviewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isBuilding, setIsBuilding] = useState(false);
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [isCheckingBuildErrors, setIsCheckingBuildErrors] = useState(false);
    const handleAddFeedback = () => {
        posthog.capture("click_add_feedback_from_manage_project_web_preview");
        router.push(`/dashboard/project/manage/${project?.id}/feedback`);
    };

    const handleBuildWebApplication = async () => {
        posthog.capture(
            "click_build_web_application_from_manage_project_web_preview",
        );
        if (!project?.id) {
            toast({
                title: "Project ID is required",
                description: "Please select a project",
            });
            return;
        }

        try {
            setIsBuilding(true);
            await buildWebApplication(project?.id);
            toast({
                title: "Software Development team of AI Agent working on new version of your web application",
                description:
                    "Please waiting for email notification when new version of your web application is ready",
                duration: 10000,
            });
        } catch (error) {
            console.error("Error building web application:", error);
            toast({
                title: "Failed to build web application",
                description:
                    "Please try again, Make sure that you build new version of your web application when you updated requirements in pages, features, and branding only.",
                variant: "destructive",
                duration: 10000,
            });
        } finally {
            setIsBuilding(false);
        }
    };

    const handleFixErrors = async () => {
        posthog.capture("click_fix_errors_from_manage_project_web_preview");
        if (!project?.id) {
            toast({
                title: "Project ID is required",
                description: "Please select a project",
            });
            return;
        }
        setIsCheckingBuildErrors(true);

        try {
            await checkBuildErrors(project?.id);
            toast({
                title: "Genesoft and AI Agent team working on fixing errors in your web application",
                description:
                    "Please waiting for email notification when errors are fixed",
                duration: 10000,
            });
        } catch (error) {
            console.error("Error checking build errors:", error);
            toast({
                title: "Failed to check build errors",
                description: "Please try again",
                variant: "destructive",
                duration: 10000,
            });
        } finally {
            setIsCheckingBuildErrors(false);
        }
    };

    useEffect(() => {
        if (project?.id) {
            setupWebApplicationInfo();
        }
    }, [project?.id]);

    const setupWebApplicationInfo = async () => {
        const webApplicationInfo = await getWebApplicationInfo(project?.id);
        console.log({ message: "webApplicationInfo", webApplicationInfo });
        setWebApplicationInfo(webApplicationInfo);
    };

    const isInProgress =
        webApplicationInfo?.developmentStatus ===
            DevelopmentStatus.FEEDBACK_ITERATION_IN_PROGRESS ||
        webApplicationInfo?.developmentStatus ===
            DevelopmentStatus.REQUIREMENTS_ITERATION_IN_PROGRESS;

    return (
        <Card className="bg-primary-dark text-white border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-2xl">
                        {/* Web preview */}
                        {"Web Application Information"}
                    </CardTitle>
                </div>
                <CardDescription className="text-subtext-in-dark-bg">
                    {/* Preview User interface of your web */}
                    {
                        "See web application information and manage your web application here by trigger AI Agent to build your web application or add feedback to improve your web application"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 ">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <div className="w-full bg-gray-800 border-b border-white/10 p-2 flex items-center gap-2">
                        {/* Browser controls */}
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        {/* URL bar */}
                        <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-sm text-gray-300 flex items-center">
                            <Globe className="h-3 w-3 mr-2 text-gray-400" />
                            {webApplicationInfo?.url || "No URL available"}
                        </div>
                    </div>

                    {webApplicationInfo?.url ? (
                        <div className="relative flex justify-center w-full h-[calc(100%-40px)]">
                            <div className="absolute -inset-1 bg-gradient-to-r from-genesoft/20 to-blue-500/20 rounded-lg blur opacity-25"></div>
                            <iframe
                                className="relative w-full h-full rounded-b-lg shadow-xl border border-white/10"
                                src={webApplicationInfo.url}
                                title="Web Application Preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                referrerPolicy="strict-origin-when-cross-origin"
                                sandbox="allow-scripts allow-same-origin"
                            ></iframe>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-[calc(100%-40px)] bg-primary-dark/30 rounded-b-lg border border-white/10">
                            <p className="text-gray-400">
                                No preview available
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 w-full p-4 bg-primary-dark/30 rounded-lg border border-white/10">
                    <div className="flex items-center gap-x-8">
                        <div className="text-sm font-medium text-gray-300">
                            Web Application Status
                        </div>
                        <DeploymentStatusBadge
                            status={
                                webApplicationInfo?.status ||
                                DeploymentStatus.NOT_DEPLOYED
                            }
                        />
                    </div>

                    <div className="flex items-center gap-x-8">
                        <div className="text-sm font-medium text-gray-300">
                            Software Development Status
                        </div>
                        <DevelopmentStatusBadge
                            status={
                                webApplicationInfo?.developmentStatus ||
                                DevelopmentStatus.DEVELOPMENT_DONE
                            }
                        />
                        {isInProgress && (
                            <span className="text-xs text-white">
                                We will send email information to your email
                                when development is done
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-x-8">
                        <div className="text-sm font-medium text-gray-300">
                            URL
                        </div>
                        <a
                            href={webApplicationInfo?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-3 py-1 rounded-full"
                        >
                            <Globe className="h-4 w-4" />
                            {webApplicationInfo?.url}
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            disabled={isInProgress}
                            className={`flex items-center gap-2 w-fit self-center hover:bg-white hover:text-black ${isInProgress ? "bg-gray-500" : "bg-genesoft"}`}
                            onClick={handleAddFeedback}
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>Add Feedback</span>
                        </Button>
                        <span className="text-xs text-subtext-in-dark-bg">
                            Talk with AI Agent for feedback to improve your web
                            application
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <Button
                            disabled={isInProgress}
                            onClick={handleBuildWebApplication}
                            className={`flex items-center gap-2 w-fit self-center hover:bg-white hover:text-black ${isInProgress ? "bg-gray-500" : "bg-genesoft"}`}
                        >
                            <AppWindow className="h-4 w-4" />
                            <span>Build web application</span>
                            {isBuilding && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                        </Button>
                        <span className="text-xs text-subtext-in-dark-bg">
                            {"inform AI Agent to build your web application"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Button
                        disabled={isInProgress}
                        onClick={handleFixErrors}
                        className={`flex items-center gap-2 w-fit self-center hover:bg-white hover:text-black ${isInProgress ? "bg-gray-500" : "bg-red-500"}`}
                    >
                        <AppWindow className="h-4 w-4" />
                        <span>Fix errors</span>
                        {isCheckingBuildErrors && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                    </Button>
                    <span className="text-xs text-subtext-in-dark-bg">
                        {
                            "inform Genesoft and AI Agent team to fix errors in your web application"
                        }
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
