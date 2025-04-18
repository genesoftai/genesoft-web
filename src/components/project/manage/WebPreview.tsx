import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useState, useRef, useEffect } from "react";
import { WebApplicationInfo } from "@/types/web-application";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, RotateCcw, Smartphone } from "lucide-react";
import { Globe } from "lucide-react";
import { Monitor } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getWebApplicationInfo } from "@/actions/web-application";
import GenesoftLoading from "@/components/common/GenesoftLoading";
import { WebTerminal } from "../web/WebTerminal";
import { WebEnv } from "../web/WebEnv";
import { runTaskInCodesandbox } from "@/actions/codesandbox";
interface WebPreviewProps {
    project: Project | null;
}

type Mode = "normal" | "dev";

export function WebPreview({ project }: WebPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mode, setMode] = useState<Mode>("normal");
    const [isLoading, setIsLoading] = useState(true);
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

    const fetchLatestData = async () => {
        console.log("fetchLatestData", project?.id);
        if (!project?.id) return;
        setIsLoading(true);
        try {
            const webAppInfo = await getWebApplicationInfo(project.id);

            setWebApplicationInfo(webAppInfo);
        } catch (error) {
            console.error("Error fetching latest data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshIframe = () => {
        setIsLoading(true);
        try {
            if (iframeRef.current) {
                iframeRef.current.src = iframeRef.current.src;
            }
        } catch (error) {
            console.error("Error refreshing iframe:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        refreshIframe();
        fetchLatestData();
    };

    const handleRunTask = async (task: string) => {
        try {
            setIsRunning(true);
            if (project?.sandbox_id) {
                await runTaskInCodesandbox(project?.sandbox_id || "", task);
                handleRefresh();
                console.log(`Task run successfully: ${task}`);
            }
        } catch (error) {
            console.error("Error running task:", error);
        } finally {
            setIsRunning(false);
        }
    };

    // const setupCodesandbox = async () => {
    //     await handleRunTask("install");
    //     await handleRunTask("dev");
    // };

    console.log({
        webApplicationInfo,
        isLoading,
    });

    useEffect(() => {
        if (project?.id) {
            fetchLatestData();
        }
        // if (project?.sandbox_id) {
        //     setupCodesandbox();
        // }
    }, [project]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <GenesoftLoading />
                <p className="text-white text-sm">
                    Loading web application information...
                </p>
            </div>
        );
    }

    return (
        <Card
            className={`bg-primary-dark text-white border-none self-center w-full h-full`}
        >
            <CardContent className="flex flex-col items-center gap-6 px-0 h-full">
                <div
                    className={`relative w-full h-full aspect-video rounded-lg`}
                >
                    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 p-2 flex flex-col md:flex-row items-center justify-between">
                        {/* Browser controls */}
                        <div className="flex gap-1.5 items-center">
                            <div className="flex items-center space-x-2 text-green-500">
                                <Switch
                                    id="dev-mode"
                                    checked={mode === "dev"}
                                    onCheckedChange={() =>
                                        setMode(
                                            mode === "normal"
                                                ? "dev"
                                                : "normal",
                                        )
                                    }
                                    className="data-[state=checked]:bg-green-500"
                                />
                                <Label
                                    htmlFor="dev-mode"
                                    className={`text-white text-xs ${mode === "dev" && "text-green-500"}`}
                                >
                                    {"Dev mode"}
                                </Label>
                            </div>

                            <a
                                href={webApplicationInfo?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-3 py-1 rounded-full"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>

                        <div className="overflow-hidden cursor-pointer">
                            {(webApplicationInfo?.url ||
                                webApplicationInfo?.codesandboxPreviewUrl) && (
                                <a
                                    href={
                                        webApplicationInfo?.codesandboxPreviewUrl ||
                                        webApplicationInfo?.url ||
                                        ""
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors truncate hover:underline cursor-pointer"
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                    }}
                                >
                                    {webApplicationInfo?.codesandboxPreviewUrl ||
                                        webApplicationInfo?.url}
                                </a>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="flex items-center bg-primary-dark border-secondary-dark hover:bg-secondary-dark"
                                onClick={handleRefresh}
                            >
                                <RotateCcw className="h-4 w-4 text-white" />
                            </Button>

                            <WebTerminal
                                sandboxId={webApplicationInfo?.sandboxId || ""}
                            />
                            <WebEnv
                                sandboxId={webApplicationInfo?.sandboxId || ""}
                            />

                            <div className="hidden sm:flex items-center bg-gray-700/50 rounded-full overflow-hidden">
                                <button
                                    className={`px-4 py-2 text-sm transition-colors ${viewMode === "desktop" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-600/50"}`}
                                    onClick={() => setViewMode("desktop")}
                                >
                                    <Monitor className="h-4 w-4" />
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm transition-colors ${viewMode === "mobile" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-600/50"}`}
                                    onClick={() => setViewMode("mobile")}
                                >
                                    <Smartphone className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Code sandbox */}
                    {webApplicationInfo?.url ||
                    webApplicationInfo?.codesandboxUrl ? (
                        mode === "dev" ? (
                            <div
                                className={`relative flex justify-center w-full h-full pb-8`}
                            >
                                <iframe
                                    ref={iframeRef}
                                    className={`relative shadow-xl border border-white/10 w-full h-full`}
                                    src={`${webApplicationInfo?.codesandboxUrl}?embed=1`}
                                    title="Web Application Preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    sandbox="allow-scripts allow-same-origin"
                                ></iframe>
                            </div>
                        ) : (
                            <div
                                className={`relative flex justify-center w-full h-full`}
                            >
                                <iframe
                                    ref={iframeRef}
                                    className={`relative shadow-xl border border-white/10 ${viewMode === "mobile" ? "w-[360px] md:w-[380px] h-[720px]" : "w-full h-full"} rounded-b-lg`}
                                    src={
                                        webApplicationInfo?.codesandboxPreviewUrl ||
                                        webApplicationInfo?.url ||
                                        ""
                                    }
                                    title="Web Application Preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    sandbox="allow-scripts allow-same-origin"
                                ></iframe>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-blue-900 to-purple-800 rounded-b-lg border border-white/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-space-pattern animate-fade bg-cover"></div>
                            <div className="p-6 rounded-xl bg-black/60 border border-white/5 flex flex-col items-center gap-3 shadow-lg transform transition-transform duration-500 hover:scale-105">
                                <Globe className="h-10 w-10 text-blue-300 animate-pulse" />
                                <p className="text-white text-center text-sm sm:text-base">
                                    Loading your latest version of web
                                    application...
                                </p>
                                <div className="text-xs text-gray-300 max-w-[250px] text-center mt-1">
                                    Please hold on while we prepare your
                                    application for viewing.
                                </div>
                                <div className="mt-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
