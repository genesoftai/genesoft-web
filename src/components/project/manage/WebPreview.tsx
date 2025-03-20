import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import BuildStatus from "./build/BuildStatus";
import DevelopmentActivity from "./development/DevelopmentActivity";
import WebApplication from "../web-application/WebApplication";
import { LatestIteration } from "@/types/development";
interface WebPreviewProps {
    project: Project | null;
    onPage?: string;
}

export function WebPreview({ project, onPage }: WebPreviewProps) {
    const { toast } = useToast();
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [isCheckingBuildErrors, setIsCheckingBuildErrors] = useState(false);
    const [latestIteration, setLatestIteration] =
        useState<LatestIteration | null>(null);
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
        if (project?.id) {
            fetchLatestData();
        }
    }, [project?.id]);

    const fetchLatestData = async () => {
        console.log("fetchLatestData", project?.id);
        if (!project?.id) return;

        try {
            const webAppInfo = await getWebApplicationInfo(project?.id);

            setWebApplicationInfo(webAppInfo);
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
        refreshIframe();
        fetchLatestData();
    };

    return (
        <Card
            className={`bg-primary-dark text-white border-none max-w-[420px] md:max-w-[1024px] self-center w-fit`}
        >
            <CardContent className="flex flex-col gap-6 px-0">
                {/* Tabs for Preview and Status */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full flex flex-col items-center"
                >
                    {/* <TabsList className="grid w-full sm:w-5/6 md:w-4/6 grid-cols-2 mb-4 mt-4 bg-secondary-dark text-subtext-in-dark-bg">
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
                    </TabsList> */}

                    {/* Preview Tab Content */}
                    <TabsContent
                        value="preview"
                        className="w-full flex flex-col items-center"
                    >
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
                    </TabsContent>

                    {/* Status Tab Content */}
                </Tabs>
            </CardContent>
        </Card>
    );
}
