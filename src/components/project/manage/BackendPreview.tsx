import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Code, Loader2, RotateCcw } from "lucide-react";
import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BackendServiceInfo } from "@/types/backend-service";
import { getBackendServiceInfo } from "@/actions/backend-service";
import { BackendServiceEnv } from "../backend/BackendServiceEnv";
import { BackendServiceTerminal } from "../backend/BackendServiceTerminal";
import { motion } from "framer-motion";
import { LatestIteration } from "@/types/development";
import { setupBackendProjectOnCodesandbox } from "@/actions/codesandbox";

interface BackendPreviewProps {
    project: Project | null;
    onPage?: string;
    setActiveTabOverview?: (tab: string) => void;
    isReadyShowPreview: boolean;
    setIsReadyShowPreview: (isReadyShowPreview: boolean) => void;
    latestIteration: LatestIteration | null;
}

type Mode = "preview" | "code";

export function BackendPreview({
    project,
    setActiveTabOverview,
    isReadyShowPreview,
    setIsReadyShowPreview,
    latestIteration,
}: BackendPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mode, setMode] = useState<Mode>("preview");

    const [isLoading, setIsLoading] = useState(false);
    const [backendServiceInfo, setBackendServiceInfo] =
        useState<BackendServiceInfo | null>(null);

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

    const handleSetupBackendProjectOnCodesandbox = async () => {
        if (project?.sandbox_id) {
            await setupBackendProjectOnCodesandbox(project.sandbox_id);
        }
    };

    const handleRefresh = () => {
        refreshIframe();
        fetchLatestData();
    };

    const handleOpenDevelopmentTaskTab = () => {
        if (setActiveTabOverview) {
            setActiveTabOverview("development-tasks");
        }
    };

    useEffect(() => {
        if (latestIteration?.status === "done" && !isReadyShowPreview) {
            handleSetupBackendProjectOnCodesandbox();
            setIsReadyShowPreview(true);
        }
    }, [latestIteration]);

    console.log({
        isLoading,
        backendServiceInfo,
    });

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
                                    {"Dev Mode"}
                                </Label>
                            </div>
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
                                {!isReadyShowPreview ? (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-8">
                                        <motion.div
                                            className="flex flex-col items-center gap-6 max-w-md"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <motion.div
                                                className="relative w-24 h-24 flex items-center justify-center"
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 8,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-t-4 border-blue-500"
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute inset-2 rounded-full border-t-4 border-purple-500"
                                                    animate={{ rotate: -360 }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute inset-4 rounded-full border-t-4 border-cyan-500"
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 4,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />

                                                <Code className="h-10 w-10" />
                                            </motion.div>

                                            <motion.h3
                                                className="text-xl font-semibold text-white text-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.3,
                                                    duration: 0.5,
                                                }}
                                            >
                                                AI Agent Working on Your
                                                Application
                                            </motion.h3>

                                            <p className="text-gray-300">
                                                Web preview will show after
                                                executing all development tasks.
                                            </p>

                                            <motion.div
                                                className="space-y-4 text-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: 0.5,
                                                    duration: 0.5,
                                                }}
                                            >
                                                <div className="flex justify-center gap-2 mt-2">
                                                    <motion.div
                                                        className="h-2 w-2 rounded-full bg-blue-500"
                                                        animate={{
                                                            scale: [1, 1.5, 1],
                                                            opacity: [
                                                                0.7, 1, 0.7,
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            delay: 0,
                                                        }}
                                                    />
                                                    <motion.div
                                                        className="h-2 w-2 rounded-full bg-purple-500"
                                                        animate={{
                                                            scale: [1, 1.5, 1],
                                                            opacity: [
                                                                0.7, 1, 0.7,
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            delay: 0.5,
                                                        }}
                                                    />
                                                    <motion.div
                                                        className="h-2 w-2 rounded-full bg-cyan-500"
                                                        animate={{
                                                            scale: [1, 1.5, 1],
                                                            opacity: [
                                                                0.7, 1, 0.7,
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            delay: 1,
                                                        }}
                                                    />
                                                </div>

                                                <motion.div
                                                    className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mt-4"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.8,
                                                        duration: 0.5,
                                                    }}
                                                >
                                                    <p className="text-sm text-gray-400">
                                                        Please check the
                                                        <span
                                                            onClick={
                                                                handleOpenDevelopmentTaskTab
                                                            }
                                                            className="mx-2 text-blue-400 underline cursor-pointer"
                                                        >
                                                            Development tasks
                                                            tab
                                                        </span>
                                                        for more details on what
                                                        is happening.
                                                    </p>
                                                </motion.div>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                ) : (
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
                                )}
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
