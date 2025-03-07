import { Card, CardContent } from "@/components/ui/card";
import {
    Globe,
    ExternalLink,
    Monitor,
    Smartphone,
    RotateCcw,
    Laptop,
    Activity,
    Wrench,
    Loader2,
} from "lucide-react";
import { Project } from "@/types/project";
import { checkBuildErrors, getLatestIteration } from "@/actions/development";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { getWebApplicationInfo } from "@/actions/web-application";
import { ReadyStatus, WebApplicationInfo } from "@/types/web-application";
import { DeploymentStatusBadge } from "../web-application/DeploymentStatus";
import posthog from "posthog-js";
import { formatDateToHumanReadable } from "@/utils/common/time";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BuildStatus from "./build/BuildStatus";
import DevelopmentActivity from "./development/DevelopmentActivity";
import WebApplication from "../web-application/WebApplication";
interface WebPreviewProps {
    project: Project | null;
    onPage?: string;
}

export function WebPreview({ project, onPage }: WebPreviewProps) {
    const { toast } = useToast();
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [isCheckingBuildErrors, setIsCheckingBuildErrors] = useState(false);
    const [latestIteration, setLatestIteration] = useState<any>(null);
    const [pollingCount, setPollingCount] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [activeTab, setActiveTab] = useState("status");

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
            className={`bg-primary-dark text-white border-none ${onPage === "manage-project" ? "w-full" : "max-w-[380px] md:max-w-[1024px]"}  self-center`}
        >
            <CardContent className="flex flex-col gap-6">
                {/* Tabs for Preview and Status */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full flex flex-col items-center"
                >
                    <TabsList className="grid w-full sm:w-5/6 md:w-4/6 grid-cols-2 mb-4 mt-4 bg-secondary-dark text-subtext-in-dark-bg">
                        <TabsTrigger
                            value="preview"
                            className="flex items-center gap-2"
                        >
                            <Laptop className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">
                                Web Preview
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="status"
                            className="flex items-center gap-2"
                        >
                            <Activity className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">
                                Development Status
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Preview Tab Content */}
                    <TabsContent
                        value="preview"
                        className="w-full flex flex-col items-center"
                    >
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-x-2 gap-y-2">
                                <p className="text-xs md:text-sm text-gray-400 mb-4">
                                    This is a UI preview of your web
                                    application. For full functionality, please
                                    visit web url
                                </p>
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

                            <WebApplication
                                onPage={onPage || ""}
                                viewMode={viewMode}
                                handleRefresh={handleRefresh}
                                webApplicationInfo={webApplicationInfo}
                                setViewMode={setViewMode}
                                iframeRef={
                                    iframeRef as React.RefObject<HTMLIFrameElement>
                                }
                            />
                            {/* 
                            <CodeSandboxPreview
                                project={project}
                                onPage={onPage}
                            /> */}
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
                                            ?.fix_triggered && (
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
                                <BuildStatus
                                    webApplicationInfo={webApplicationInfo}
                                    projectId={project?.id || ""}
                                />
                            )}

                            {/* Development Activity Live Feed */}
                            <DevelopmentActivity
                                pollingCount={pollingCount}
                                latestIteration={latestIteration}
                                project={project as Project}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
