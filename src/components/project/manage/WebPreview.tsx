import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useEffect, useState, useRef } from "react";
import { getWebApplicationInfo } from "@/actions/web-application";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import WebApplication from "../web-application/WebApplication";
import { WebApplicationInfo } from "@/types/web-application";
interface WebPreviewProps {
    project: Project | null;
    onPage?: string;
}

export function WebPreview({ project, onPage }: WebPreviewProps) {
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [pollingCount, setPollingCount] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [activeTab, setActiveTab] = useState("preview");

    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

    useEffect(() => {
        if (project?.id) {
            fetchLatestData();
        }
        let interval: NodeJS.Timeout;

        if (project?.id) {
            // Initial fetch
            fetchLatestData();

            // Set up polling every 10 seconds
            interval = setInterval(() => {
                fetchLatestData();
                setPollingCount((prev) => prev + 1);
            }, 30000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
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
        setWebApplicationInfo(null);
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
