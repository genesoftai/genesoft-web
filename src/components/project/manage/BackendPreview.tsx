import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";
import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BackendServiceInfo } from "@/types/backend-service";
import { getBackendServiceInfo } from "@/actions/backend-service";
import { BackendServiceTerminal } from "../backend/BackendServiceTerminal";
import { motion } from "framer-motion";
import { LatestIteration } from "@/types/development";
import {
    killAllShells,
    runCommandInCodesandbox,
    runDevCommandInCodesandboxForBackend,
} from "@/actions/codesandbox";
import CodeEditor from "@/components/development/CodeEditor";
import GenesoftLoading from "@/components/common/GenesoftLoading";

interface BackendPreviewProps {
    project: Project | null;
    onPage?: string;
    isReadyShowPreview: boolean;
    setIsReadyShowPreview: (isReadyShowPreview: boolean) => void;
    latestIteration: LatestIteration | null;
}

type Mode = "preview" | "code";

export function BackendPreview({
    project,
    isReadyShowPreview,
    setIsReadyShowPreview,
    latestIteration,
}: BackendPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mode, setMode] = useState<Mode>("preview");
    const [isLoading, setIsLoading] = useState(false);
    const [backendServiceInfo, setBackendServiceInfo] =
        useState<BackendServiceInfo | null>(null);
    const [isLoadingSetupSandbox, setIsLoadingSetupSandbox] = useState(true);
    const [isRunningInstallCommand, setIsRunningInstallCommand] =
        useState(false);
    const [isRunningDevCommand, setIsRunningDevCommand] = useState(false);

    useEffect(() => {
        if (project?.id) {
            fetchLatestData();
        }
    }, [project?.id]);

    const fetchLatestData = async () => {
        console.log("fetchLatestData", project?.id);
        if (!project?.id) return;

        try {
            setIsLoading(true);
            const backendServiceInfo = await getBackendServiceInfo(project.id);
            setBackendServiceInfo(backendServiceInfo);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching latest data:", error);
            setIsLoading(false);
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

    const handleSetupBackendProjectOnCodesandbox = async () => {
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
                await runDevCommandInCodesandboxForBackend(project.sandbox_id);
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
        if (latestIteration?.status === "done" && !isReadyShowPreview) {
            handleSetupBackendProjectOnCodesandbox();
            setIsReadyShowPreview(true);
        }
    }, [latestIteration?.status, isReadyShowPreview]);

    console.log({
        isLoading,
        backendServiceInfo,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <GenesoftLoading />
                <p className="text-white text-sm">
                    Loading your backend service information...
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
                        Setup Sandbox for your backend service...
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
            className={`bg-primary-dark text-white border-none self-center w-full h-full`}
        >
            <CardContent className="flex flex-col items-center gap-6 px-0 h-full">
                <div
                    className={`relative w-full h-full aspect-video rounded-lg`}
                >
                    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 p-2 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex gap-1.5 items-center">
                            <div className="flex items-center space-x-2 text-green-500">
                                <Switch
                                    id="dev-mode"
                                    checked={mode === "code"}
                                    onCheckedChange={() =>
                                        setMode(
                                            mode === "preview"
                                                ? "code"
                                                : "preview",
                                        )
                                    }
                                    className="data-[state=checked]:bg-green-500"
                                />
                                <Label
                                    htmlFor="dev-mode"
                                    className={`text-white text-xs ${mode === "code" && "text-green-500"}`}
                                >
                                    {"Dev"}
                                </Label>
                            </div>

                            <CodeEditor projectId={project?.id} />
                        </div>

                        <div className="overflow-hidden cursor-pointer">
                            <a
                                href={
                                    backendServiceInfo?.codesandboxPreviewUrl ||
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
                                {backendServiceInfo?.codesandboxPreviewUrl}
                            </a>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="flex items-center bg-primary-dark border-secondary-dark hover:bg-secondary-dark"
                                onClick={handleRefresh}
                            >
                                <RotateCcw className="h-4 w-4 text-white" />
                            </Button>

                            {/* <BackendServiceEnv
                                sandboxId={backendServiceInfo?.sandboxId || ""}
                            /> */}
                            <BackendServiceTerminal
                                sandboxId={backendServiceInfo?.sandboxId || ""}
                            />
                        </div>
                    </div>

                    {/* Code sandbox */}
                    {backendServiceInfo?.codesandboxUrl ||
                    backendServiceInfo?.codesandboxPreviewUrl ? (
                        mode === "code" ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className={`relative flex justify-center w-full h-full pb-8`}
                            >
                                <iframe
                                    ref={iframeRef}
                                    className={`relative shadow-xl border border-white/10 w-full h-full`}
                                    src={`${backendServiceInfo?.codesandboxUrl}?embed=1`}
                                    title="Web Application Preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    sandbox="allow-scripts allow-same-origin"
                                ></iframe>
                            </motion.div>
                        ) : (
                            <div
                                className={`relative flex justify-center w-full h-full`}
                            >
                                <iframe
                                    ref={iframeRef}
                                    className={`relative shadow-xl border border-white/10 w-full h-full rounded-b-lg`}
                                    src={
                                        backendServiceInfo?.codesandboxPreviewUrl ||
                                        backendServiceInfo?.codesandboxUrl ||
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-blue-900 to-purple-800 rounded-b-lg border border-white/10 overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-space-pattern animate-fade bg-cover"></div>
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="p-6 rounded-xl bg-black/60 border border-white/5 flex flex-col items-center gap-3 shadow-lg transform transition-transform duration-500 hover:scale-105"
                            >
                                <Globe className="h-10 w-10 text-blue-300 animate-pulse" />
                                <p className="text-white text-center text-sm sm:text-base">
                                    {latestIteration?.status === "done"
                                        ? "Setting up your backend application..."
                                        : "AI Agent Working on Your Application"}
                                </p>
                                <div className="text-xs text-gray-300 max-w-[250px] text-center mt-1">
                                    {latestIteration?.status === "done"
                                        ? "Almost ready! We're preparing your backend for viewing."
                                        : "Please hold on while we prepare your application for viewing."}
                                </div>
                                <div className="mt-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
