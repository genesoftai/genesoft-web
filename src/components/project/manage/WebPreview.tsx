import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Globe,
    CircleCheck,
    ExternalLink,
    Monitor,
    Smartphone,
    RotateCcw,
    Laptop,
    Activity,
    Wrench,
    Loader2,
    TriangleAlert,
} from "lucide-react";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import {
    buildWebApplication,
    checkBuildErrors,
    getLatestIteration,
} from "@/actions/development";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebPreviewProps {
    project: Project | null;
}

export function WebPreview({ project }: WebPreviewProps) {
    const { toast } = useToast();
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [isCheckingBuildErrors, setIsCheckingBuildErrors] = useState(false);
    const [latestIteration, setLatestIteration] = useState<any>(null);
    const [pollingCount, setPollingCount] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [activeTab, setActiveTab] = useState("preview");

    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

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
                title: "Genesoft software development AI Agent team working on fixing errors of your web application to help you deploy latest version",
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
            }, 5000);
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

    const refreshIframe = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    const handleRefresh = () => {
        fetchLatestData();
        refreshIframe();
    };

    console.log({
        webApplicationInfo,
        latestIteration,
    });

    return (
        <Card
            className={`bg-primary-dark text-white border-none  max-w-[380px] md:max-w-[1024px] `}
        >
            <CardHeader className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <CardTitle className="text-white text-lg md:text-2xl">
                        <p>Web Application Information</p>
                    </CardTitle>
                </div>
                <CardDescription className="text-subtext-in-dark-bg">
                    <div className="flex flex-col md:flex-row items-center gap-x-2 gap-y-2 w-full">
                        <a
                            href={webApplicationInfo?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-3 py-1 rounded-full"
                        >
                            <Globe className="h-4 w-4" />
                            <span className="text-xs md:text-sm">
                                {"Web application"}
                            </span>
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                {/* Tabs for Preview and Status */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-secondary-dark text-subtext-in-dark-bg">
                        <TabsTrigger
                            value="preview"
                            className="flex items-center gap-2"
                        >
                            <Laptop className="h-4 w-4" />
                            <span>Web Preview</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="status"
                            className="flex items-center gap-2"
                        >
                            <Activity className="h-4 w-4" />
                            <span>Development Status</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Preview Tab Content */}
                    <TabsContent
                        value="preview"
                        className="w-full flex flex-col items-center"
                    >
                        <p className="text-xs md:text-sm text-gray-400 mb-4">
                            This is a UI preview of your web application. For
                            full functionality, please visit the web application
                            link above
                        </p>

                        <div
                            className={`relative w-full aspect-video rounded-lg overflow-hidden ${viewMode === "mobile" ? "h-[720px] max-w-[380px]" : "h-[100vh] max-w-[850px]"}`}
                        >
                            <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 p-2 flex items-center justify-between">
                                {/* Browser controls */}
                                <div className="flex gap-1.5 items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 transition-all hover:animate-pulse"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 transition-all hover:animate-pulse"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500 transition-all hover:animate-pulse"></div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex items-center bg-primary-dark border-secondary-dark hover:bg-secondary-dark"
                                        onClick={handleRefresh}
                                    >
                                        <RotateCcw className="h-4 w-4 text-white" />
                                    </Button>

                                    <div className="hidden sm:flex items-center bg-gray-700/50 rounded-full overflow-hidden">
                                        <button
                                            className={`px-4 py-2 text-sm transition-colors ${viewMode === "desktop" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-600/50"}`}
                                            onClick={() =>
                                                setViewMode("desktop")
                                            }
                                        >
                                            <Monitor className="h-4 w-4" />
                                        </button>
                                        <button
                                            className={`px-4 py-2 text-sm transition-colors ${viewMode === "mobile" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-600/50"}`}
                                            onClick={() =>
                                                setViewMode("mobile")
                                            }
                                        >
                                            <Smartphone className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {webApplicationInfo?.url ? (
                                <div
                                    className={`relative flex justify-center w-full h-[calc(100%-40px)] `}
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-genesoft/30 via-blue-500/20 to-purple-500/30 rounded-lg opacity-30"></div>
                                    <div className="absolute inset-0 bg-grid-pattern bg-gray-900/20 mix-blend-overlay pointer-events-none"></div>
                                    <iframe
                                        ref={iframeRef}
                                        className={`relative shadow-xl border border-white/10 ${
                                            viewMode === "mobile"
                                                ? "w-[380px] h-[720px] rounded-b-lg mx-auto"
                                                : "w-full h-[720px] rounded-b-lg"
                                        }`}
                                        src={webApplicationInfo.url}
                                        title="Web Application Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        sandbox="allow-scripts allow-same-origin"
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-[calc(100%-40px)] bg-gradient-to-b from-primary-dark/40 to-primary-dark/60 rounded-b-lg border border-white/10">
                                    <div className="p-6 rounded-xl bg-black/30 border border-white/5 flex flex-col items-center gap-3">
                                        <Globe className="h-10 w-10 text-gray-500 opacity-50" />
                                        <p className="text-gray-400 text-center text-sm sm:text-base">
                                            No preview available yet
                                        </p>
                                        <div className="text-xs text-gray-500 max-w-[250px] text-center mt-1">
                                            Your web application will appear
                                            here once deployed
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Status Tab Content */}
                    <TabsContent value="status" className="w-full">
                        {/* Web Application and Latest Iteration Status */}
                        <div className="flex flex-col gap-4 w-full p-4">
                            <div className="flex flex-col gap-1 w-full sm:w-fit">
                                <div className="text-sm font-medium text-gray-300">
                                    Web Application Status
                                </div>
                                <div className="flex flex-col items-center justify-between md:flex-row w-full md:w-fit gap-2 p-4 bg-primary-dark/30 rounded-lg border border-white/10">
                                    <DeploymentStatusBadge
                                        readyStatus={
                                            webApplicationInfo?.readyStatus ||
                                            ReadyStatus.BUILDING
                                        }
                                    />
                                    {[
                                        ReadyStatus.READY,
                                        ReadyStatus.BUILDING,
                                    ].includes(
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

                                <div className="flex flex-col items-center md:flex-row w-full gap-2 p-4">
                                    {webApplicationInfo?.readyStatus ===
                                        ReadyStatus.ERROR &&
                                        !webApplicationInfo?.repositoryBuild
                                            .fix_triggered && (
                                            <div className="flex flex-col items-start gap-2">
                                                <Button
                                                    variant="ghost"
                                                    className="text-xs bg-red-700 font-bold text-white py-1 rounded-sm"
                                                    onClick={handleFixErrors}
                                                >
                                                    <Wrench className="h-4 w-4" />
                                                    <span className="text-sm font-medium flex items-center gap-2">
                                                        Fix errors
                                                        {isCheckingBuildErrors && (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        )}
                                                    </span>
                                                </Button>

                                                <p className="text-xs text-gray-400">
                                                    We found some error for
                                                    deploying your latest
                                                    version of web application.
                                                    Please click fix errors in
                                                    your web application to
                                                    redeploy
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Repository Build Info */}
                            {webApplicationInfo?.repositoryBuild && (
                                <div className="flex flex-col gap-1 w-full mt-4">
                                    <div className="text-sm font-medium text-white flex items-center gap-2">
                                        <span className="text-sm text-white font-bold">
                                            Build Status
                                        </span>
                                        {webApplicationInfo.repositoryBuild
                                            .status === "failed" && (
                                            <TriangleAlert className="h-4 w-4 text-red-400" />
                                        )}
                                        {webApplicationInfo.repositoryBuild
                                            .status === "pending" && (
                                            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                                        )}
                                        {webApplicationInfo.repositoryBuild
                                            .status === "in_progress" && (
                                            <Wrench className="h-4 w-4 animate-pulse text-genesoft" />
                                        )}
                                    </div>
                                    <div className="flex flex-col p-4 bg-primary-dark/30 rounded-lg border border-white/10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-400">
                                                    Status
                                                </span>
                                                <span
                                                    className={`text-sm font-medium ${
                                                        (webApplicationInfo
                                                            .repositoryBuild
                                                            .status as string) ===
                                                        "deployed"
                                                            ? "text-green-400"
                                                            : (webApplicationInfo
                                                                    .repositoryBuild
                                                                    .status as string) ===
                                                                    "pending" ||
                                                                (webApplicationInfo
                                                                    .repositoryBuild
                                                                    .status as string) ===
                                                                    "in_progress"
                                                              ? "text-yellow-400"
                                                              : "text-red-400"
                                                    }`}
                                                >
                                                    {(webApplicationInfo
                                                        .repositoryBuild
                                                        .status as string) ===
                                                    "deployed"
                                                        ? "Successfully Deployed"
                                                        : (webApplicationInfo
                                                                .repositoryBuild
                                                                .status as string) ===
                                                            "pending"
                                                          ? "Deployment in Progress"
                                                          : (webApplicationInfo
                                                                  .repositoryBuild
                                                                  .status as string) ===
                                                              "in_progress"
                                                            ? "AI Agent Fixing Errors for deployment failed"
                                                            : "Deployment Failed"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-400">
                                                    Started On
                                                </span>
                                                <span className="text-sm text-white">
                                                    {new Date(
                                                        webApplicationInfo.repositoryBuild.created_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-400">
                                                    Last Updated
                                                </span>
                                                <span className="text-sm text-white">
                                                    {new Date(
                                                        webApplicationInfo.repositoryBuild.updated_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-400">
                                                    Fix Attempts
                                                </span>
                                                <span className="text-sm text-white">
                                                    {
                                                        webApplicationInfo
                                                            .repositoryBuild
                                                            .fix_attempts
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {webApplicationInfo.repositoryBuild
                                            .status === "failed" && (
                                            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-red-300">
                                                            We couldn&apos;t
                                                            deploy your website
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            Fix attempts:{" "}
                                                            {
                                                                webApplicationInfo
                                                                    .repositoryBuild
                                                                    .fix_attempts
                                                            }
                                                        </span>
                                                    </div>

                                                    {webApplicationInfo
                                                        .repositoryBuild
                                                        .error_logs && (
                                                        <div className="mt-2 p-2 bg-black/50 rounded border border-white/10 max-h-32 overflow-y-auto">
                                                            <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                                                                {
                                                                    webApplicationInfo
                                                                        .repositoryBuild
                                                                        .error_logs
                                                                }
                                                            </pre>
                                                        </div>
                                                    )}

                                                    {/* <div className="flex justify-end mt-2">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="bg-red-700 hover:bg-red-600 text-white"
                                                            onClick={
                                                                handleFixErrors
                                                            }
                                                        >
                                                            <Wrench className="h-4 w-4 mr-2" />
                                                            {"Fix errors"}
                                                            {isCheckingBuildErrors && (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            )}
                                                        </Button>
                                                    </div> */}

                                                    <p className="text-xs text-gray-400 self-end">
                                                        Please contact support
                                                        at support@genesoft.com
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Development Activity Live Feed */}
                            <div className="flex flex-col gap-3 w-full">
                                <div className="text-sm font-medium text-gray-300 flex flex-col md:flex-row items-center gap-2 mt-8">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Software Development Activity for latest
                                        sprint
                                    </div>
                                    {pollingCount > 0 && (
                                        <span className="text-xs text-gray-400 animate-pulse">
                                            (next update in{" "}
                                            {5 - (pollingCount % 5)}s)
                                        </span>
                                    )}
                                </div>

                                <div className="bg-primary-dark/30 rounded-lg border border-white/10 overflow-hidden">
                                    {latestIteration ? (
                                        <div className="relative">
                                            {/* Activity Header */}
                                            <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-white/10">
                                                <div className="flex flex-col md:flex-row items-center gap-2">
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
                                                                    <span className="text-xs">
                                                                        Sprint
                                                                    </span>
                                                                </div>
                                                                <div className="text-white font-bold">
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
                                                                <div className="text-white font-bold">
                                                                    {
                                                                        latestIteration
                                                                            .page
                                                                            .name
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
                                                            <div className="bg-white/5 p-3 rounded-md gap-2">
                                                                <div className="font-medium text-gray-300 mb-1">
                                                                    Feature
                                                                </div>
                                                                <div className="text-white font-bold">
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
                                                    </div>
                                                </div>

                                                {/* Visual Activity Indicator */}
                                                {latestIteration.status ===
                                                    "done" && (
                                                    <div className="flex items-center gap-2 text-green-300 bg-green-500/10 p-2 rounded-md text-sm mt-2">
                                                        <CircleCheck className="h-4 w-4" />
                                                        <span>
                                                            Development
                                                            completed
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
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
