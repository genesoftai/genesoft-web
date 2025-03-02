import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Globe, CircleCheck } from "lucide-react";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import {
    buildWebApplication,
    checkBuildErrors,
    getLatestIteration,
} from "@/actions/development";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getWebApplicationInfo } from "@/actions/web-application";
import {
    DeploymentStatus,
    DevelopmentStatus,
    ReadyStatus,
    WebApplicationInfo,
} from "@/types/web-application";
import { DevelopmentStatusBadge } from "../web-application/DevelopmentStatus";
import { DeploymentStatusBadge } from "../web-application/DeploymentStatus";
import posthog from "posthog-js";
import { formatDateToHumanReadable } from "@/utils/common/time";

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
    const [latestIteration, setLatestIteration] = useState<any>(null);
    const [pollingCount, setPollingCount] = useState(0);
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
        let interval: NodeJS.Timeout;

        if (project?.id) {
            // Initial fetch
            fetchLatestData();

            // Set up polling every 10 seconds
            interval = setInterval(() => {
                fetchLatestData();
                setPollingCount((prev) => prev + 1);
            }, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project?.id]);

    const fetchLatestData = async () => {
        if (!project?.id) return;

        try {
            const [webAppInfo, iterationInfo] = await Promise.all([
                getWebApplicationInfo(project?.id),
                getLatestIteration(project?.id),
            ]);

            setWebApplicationInfo(webAppInfo);
            setLatestIteration(iterationInfo);

            console.log({
                message: "Latest data fetched",
                webAppInfo,
                iterationInfo,
            });
        } catch (error) {
            console.error("Error fetching latest data:", error);
        }
    };

    const isInProgress = [
        DevelopmentStatus.FEEDBACK_ITERATION_IN_PROGRESS,
        DevelopmentStatus.REQUIREMENTS_ITERATION_IN_PROGRESS,
        DevelopmentStatus.PAGE_ITERATION_IN_PROGRESS,
        DevelopmentStatus.FEATURE_ITERATION_IN_PROGRESS,
    ].includes(webApplicationInfo?.developmentStatus as DevelopmentStatus);

    console.log({
        webApplicationInfo,
        latestIteration,
    });

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
                    {/* {
                        "See web application information and manage your web application here by trigger AI Agent to build your web application or add feedback to improve your web application"
                    } */}
                    <div className="flex items-center gap-x-2">
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
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 ">
                <p className="text-sm text-gray-400">
                    This is a UI preview of your web application. For full
                    functionality, please visit the web url above
                </p>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <div className="w-full bg-gray-800 border-b border-white/10 p-2 flex items-center gap-2">
                        {/* Browser controls */}
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        {/* URL bar */}
                        {/* <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-sm text-gray-300 flex items-center">
                            <Globe className="h-3 w-3 mr-2 text-gray-400" />
                            {webApplicationInfo?.url || "No URL available"}
                        </div> */}
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

                {/* Web Application and Latest Iteration Status */}
                <div className="flex flex-col gap-4 w-full p-4">
                    <div className="flex flex-col gap-1  w-fit">
                        <div className="text-sm font-medium text-gray-300">
                            Web Application Status
                        </div>
                        <div className="flex items-center gap-2 p-4 bg-primary-dark/30 rounded-lg border border-white/10">
                            <DeploymentStatusBadge
                                status={
                                    webApplicationInfo?.status ||
                                    DeploymentStatus.NOT_DEPLOYED
                                }
                                readyStatus={
                                    webApplicationInfo?.readyStatus ||
                                    ReadyStatus.BUILDING
                                }
                            />
                            {[ReadyStatus.READY, ReadyStatus.BUILDING].includes(
                                webApplicationInfo?.readyStatus as ReadyStatus,
                            ) && (
                                <span className="text-xs text-white">
                                    at{" "}
                                    {webApplicationInfo?.readyAt
                                        ? formatDateToHumanReadable(
                                              webApplicationInfo.readyAt,
                                          )
                                        : "Not available"}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 w-fit">
                        <div className="text-sm font-medium text-gray-300">
                            Software Development Status
                        </div>
                        <div className="flex items-center gap-2 p-4 bg-primary-dark/30 rounded-lg border border-white/10 ">
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
                            {webApplicationInfo?.developmentStatus ===
                                DevelopmentStatus.DEVELOPMENT_DONE && (
                                <span className="text-xs text-white">
                                    at{" "}
                                    {webApplicationInfo?.developmentDoneAt
                                        ? formatDateToHumanReadable(
                                              webApplicationInfo.developmentDoneAt,
                                          )
                                        : "Not available"}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Development Activity Live Feed */}
                    <div className="flex flex-col gap-3 w-full">
                        <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            Development Activity for latest sprint
                            {pollingCount > 0 && (
                                <span className="text-xs text-gray-400 animate-pulse">
                                    (next update in {10 - (pollingCount % 10)}s)
                                </span>
                            )}
                        </div>

                        <div className="bg-primary-dark/30 rounded-lg border border-white/10 overflow-hidden">
                            {latestIteration ? (
                                <div className="relative">
                                    {/* Activity Header */}
                                    <div className="flex justify-between items-center p-4 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    latestIteration.status ===
                                                    "in_progress"
                                                        ? "bg-blue-500/20 text-blue-300"
                                                        : latestIteration.status ===
                                                            "done"
                                                          ? "bg-green-500/20 text-green-300"
                                                          : "bg-yellow-500/20 text-yellow-300"
                                                }`}
                                            >
                                                {latestIteration.status ===
                                                "in_progress"
                                                    ? "In Progress"
                                                    : latestIteration.status ===
                                                        "done"
                                                      ? "Completed"
                                                      : "Pending"}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {latestIteration.type ===
                                                "page_development"
                                                    ? "Page Development"
                                                    : latestIteration.type ===
                                                        "feature_development"
                                                      ? "Feature Development"
                                                      : "Application Development"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {latestIteration.created_at
                                                ? formatDateToHumanReadable(
                                                      latestIteration.created_at,
                                                  )
                                                : ""}
                                        </div>
                                    </div>

                                    {/* Activity Content */}
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium mb-2">
                                                Development Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                {latestIteration.conversation && (
                                                    <div className="bg-white/5 p-3 rounded-md">
                                                        <div className="font-medium text-gray-300 mb-1">
                                                            Sprint
                                                        </div>
                                                        <div className="text-white">
                                                            {
                                                                latestIteration
                                                                    .conversation
                                                                    .name
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                                {latestIteration.page && (
                                                    <div className="bg-white/5 p-3 rounded-md">
                                                        <div className="font-medium text-gray-300 mb-1">
                                                            Page
                                                        </div>
                                                        <div className="text-white">
                                                            {
                                                                latestIteration
                                                                    .page.name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                            {
                                                                latestIteration
                                                                    .page
                                                                    .description
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                                {latestIteration.feature && (
                                                    <div className="bg-white/5 p-3 rounded-md">
                                                        <div className="font-medium text-gray-300 mb-1">
                                                            Feature
                                                        </div>
                                                        <div className="text-white">
                                                            {
                                                                latestIteration
                                                                    .feature
                                                                    .name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                            {
                                                                latestIteration
                                                                    .feature
                                                                    .description
                                                            }
                                                        </div>
                                                    </div>
                                                )}

                                                {/* <div className="bg-white/5 p-3 rounded-md">
                                                    <div className="font-medium text-gray-300 mb-1">
                                                        Development Time
                                                    </div>
                                                    <div className="text-white">
                                                        {parseFloat(
                                                            latestIteration.working_time,
                                                        ) > 0
                                                            ? `${latestIteration.working_time} hours`
                                                            : latestIteration.status ===
                                                                "done"
                                                              ? "Completed rapidly"
                                                              : "In progress..."}
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>

                                        {/* Visual Activity Indicator */}
                                        {latestIteration.status ===
                                            "in_progress" && (
                                            <div className="mt-4 mb-2">
                                                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[progress_2s_ease-in-out_infinite]"
                                                        style={{
                                                            width: `${(pollingCount % 5) * 20 + 20}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                    <span>
                                                        Development in progress
                                                    </span>
                                                    <span>
                                                        AI agents working...
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {latestIteration.status === "done" && (
                                            <div className="flex items-center gap-2 text-green-300 bg-green-500/10 p-2 rounded-md text-sm mt-2">
                                                <CircleCheck className="h-4 w-4" />
                                                <span>
                                                    Development completed
                                                    successfully
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-t-transparent border-genesoft rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-400 text-sm">
                                        Loading development activity...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
