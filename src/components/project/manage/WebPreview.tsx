import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useState, useRef, useEffect } from "react";
import { WebApplicationInfo } from "@/types/web-application";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Smartphone } from "lucide-react";
import { Monitor } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getWebApplicationInfo } from "@/actions/web-application";
import GenesoftLoading from "@/components/common/GenesoftLoading";
import { WebTerminal } from "../web/WebTerminal";
import {
    killAllShells,
    runCommandInCodesandbox,
    runDevCommandInCodesandboxForWeb,
} from "@/actions/codesandbox";
import { motion } from "framer-motion";
import { LatestIteration } from "@/types/development";
import CodeEditor from "@/components/development/CodeEditor";

interface WebPreviewProps {
    project: Project | null;
    isReadyShowPreview: boolean;
    setIsReadyShowPreview: (isReadyShowPreview: boolean) => void;
    latestIteration: LatestIteration | null;
}

type Mode = "normal" | "dev";

export function WebPreview({
    project,
    isReadyShowPreview,
    setIsReadyShowPreview,
    latestIteration,
}: WebPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mode, setMode] = useState<Mode>("normal");
    const [isLoading, setIsLoading] = useState(true);
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [isLoadingSetupSandbox, setIsLoadingSetupSandbox] = useState(true);
    const [isRunningInstallCommand, setIsRunningInstallCommand] =
        useState(false);
    const [isRunningDevCommand, setIsRunningDevCommand] = useState(false);

    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

    const fetchLatestData = async () => {
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

    const handleSetupWebProjectOnCodesandbox = async () => {
        if (project?.sandbox_id) {
            setIsLoadingSetupSandbox(true);
            try {
                await killAllShells(project.sandbox_id);
                setIsRunningInstallCommand(true);
                await runCommandInCodesandbox(
                    project.sandbox_id,
                    "pnpm install",
                );
                setIsRunningInstallCommand(false);
                setIsRunningDevCommand(true);
                await runDevCommandInCodesandboxForWeb(project.sandbox_id);
                setIsRunningDevCommand(false);
            } catch (error) {
                console.error(
                    "Error setting up web project on codesandbox:",
                    error,
                );
                setIsRunningInstallCommand(false);
                setIsRunningDevCommand(false);
            } finally {
                setIsLoadingSetupSandbox(false);
            }
        }
    };

    useEffect(() => {
        if (project?.id) {
            fetchLatestData();
        }
    }, [project]);

    useEffect(() => {
        if (latestIteration?.status === "done" && !isReadyShowPreview) {
            handleSetupWebProjectOnCodesandbox();
            setIsReadyShowPreview(true);
        }
    }, [latestIteration?.status, isReadyShowPreview]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <GenesoftLoading />
                <p className="text-white text-sm">
                    Loading your web application information...
                </p>
            </div>
        );
    }

    if (isLoadingSetupSandbox) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <GenesoftLoading />
                <div className="flex flex-col items-center gap-2">
                    <p className="text-white text-sm">
                        Setup Sandbox for your web application...
                    </p>
                    {isRunningInstallCommand && (
                        <p className="text-white text-sm flex items-center gap-2">
                            <span>Installing dependencies...</span>
                            <Loader2 className="h-4 w-4 text-genesoft animate-spin" />
                        </p>
                    )}

                    {isRunningDevCommand && (
                        <p className="text-white text-sm flex items-center gap-2">
                            <span>Starting development server...</span>
                            <Loader2 className="h-4 w-4 text-genesoft animate-spin" />
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <Card
            className={`bg-primary-dark text-white  self-center w-full h-full border-none`}
        >
            <CardContent className="flex flex-col items-center gap-6 px-0 h-full">
                <div
                    className={`relative w-full h-full aspect-video rounded-lg`}
                >
                    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 p-2 flex flex-col md:flex-row items-center justify-between">
                        {/* Browser controls */}
                        <div className="flex gap-4 items-center">
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
                                    {"Dev"}
                                </Label>
                            </div>

                            <CodeEditor projectId={project?.id} />
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
                                className="flex items-center bg-white"
                                onClick={handleRefresh}
                            >
                                <RotateCcw className="h-4 w-4 text-black" />
                            </Button>

                            <WebTerminal
                                sandboxId={webApplicationInfo?.sandboxId || ""}
                            />
                            {/* <WebEnv
                                sandboxId={webApplicationInfo?.sandboxId || ""}
                            /> */}

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
                    {mode === "dev" ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className={`relative flex justify-center w-full h-full pb-8`}
                        >
                            <iframe
                                ref={iframeRef}
                                className={`relative shadow-xl w-full h-full`}
                                src={`${webApplicationInfo?.codesandboxUrl}?embed=1`}
                                title="Web Application Preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                referrerPolicy="strict-origin-when-cross-origin"
                                sandbox="allow-scripts allow-same-origin"
                            ></iframe>
                        </motion.div>
                    ) : (
                        <div
                            className={`relative flex justify-center w-full h-[90vh]`}
                        >
                            <iframe
                                ref={iframeRef}
                                className={`relative shadow-xl ${viewMode === "mobile" ? "w-[360px] h-[720px] md:w-[420px] md:h-[840px]" : "w-full h-full"} rounded-b-lg`}
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
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
