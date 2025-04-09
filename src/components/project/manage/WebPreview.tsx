import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useEffect, useState, useRef } from "react";
import { getWebApplicationInfo } from "@/actions/web-application";
import { WebApplicationInfo } from "@/types/web-application";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, RotateCcw, Smartphone } from "lucide-react";
import { Globe } from "lucide-react";
import { Monitor } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CodeSandbox } from "@codesandbox/sdk";
import { getCodesandboxApiKey } from "@/actions/codesandbox";
interface WebPreviewProps {
    project: Project | null;
    onPage?: string;
}

type Mode = "normal" | "dev";

export function WebPreview({ project, onPage }: WebPreviewProps) {
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [pollingCount, setPollingCount] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [activeTab, setActiveTab] = useState("preview");
    const [mode, setMode] = useState<Mode>("normal");
    const [previewUrl, setPreviewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

    useEffect(() => {
        if (project?.id) {
            fetchLatestData();
        }
        // let interval: NodeJS.Timeout;

        // if (project?.id) {
        //     // Initial fetch
        //     fetchLatestData();

        //     // Set up polling every 10 seconds
        //     interval = setInterval(() => {
        //         fetchLatestData();
        //         setPollingCount((prev) => prev + 1);
        //     }, 30000);
        // }
        // return () => {
        //     if (interval) clearInterval(interval);
        // };
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

    // useEffect(() => {
    //     if (webApplicationInfo?.developmentStatus === "development_done") {
    //         setupCodesandboxPreviewUrl();
    //     }
    // }, [webApplicationInfo]);

    // const setupCodesandboxPreviewUrl = async () => {
    //     try {
    //         setIsLoading(true);
    //         const apiKey = await getCodesandboxApiKey();
    //         const sdk = new CodeSandbox(apiKey);
    //         if (webApplicationInfo?.codesandboxId) {
    //             const sandbox = await sdk.sandbox.open(
    //                 webApplicationInfo?.codesandboxId,
    //             );
    //             await sandbox.shells.run("pnpm install");
    //             await sandbox.shells.run("pnpm run dev");
    //             const portInfo = await sandbox.ports.waitForPort(3000);
    //             const url = portInfo.getPreviewUrl();
    //             setPreviewUrl(url);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    console.log({
        webApplicationInfo,
        previewUrl,
        isLoading,
    });

    return (
        <Card
            className={`bg-primary-dark text-white border-none max-w-[420px] md:max-w-[1024px] self-center w-fit`}
        >
            <CardContent className="flex flex-col gap-6 px-0">
                <div
                    className={`relative w-full aspect-video rounded-lg overflow-hidden ${onPage !== "manage-project" && viewMode === "mobile" && "h-[720px] max-w-[360px] md:max-w-[380px]"} ${onPage !== "manage-project" && viewMode === "desktop" && "h-[100vh] max-w-[1024px]"}`}
                >
                    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 p-2 flex items-center justify-between">
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
                            {webApplicationInfo?.url && (
                                <a
                                    href={webApplicationInfo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition-colors truncate hover:underline cursor-pointer"
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                    }}
                                >
                                    {webApplicationInfo.url}
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

                    {/* {webApplicationInfo?.url ? (
                <div
                    className={`relative flex justify-center w-full h-[calc(100%-40px)] `}
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-genesoft/30 via-blue-500/20 to-purple-500/30 rounded-lg opacity-30"></div>
                    <div className="absolute inset-0 bg-grid-pattern bg-gray-900/20 mix-blend-overlay pointer-events-none"></div>
                    <iframe
                        ref={iframeRef}
                        className={`relative shadow-xl border border-white/10 ${viewMode === "mobile" && "w-[360px] md:w-[380px] h-[720px] rounded-b-lg mx-auto"} ${onPage === "manage-project" && viewMode === "desktop" ? "w-full h-full rounded-b-lg" : "w-full h-[720px] rounded-b-lg mx-auto"}`}
                        src={webApplicationInfo.url}
                        title="Web Application Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full h-[calc(100%-40px)] bg-gradient-to-b from-blue-900 to-purple-800 rounded-b-lg border border-white/10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-space-pattern animate-fade bg-cover"></div>
                    <div className="p-6 rounded-xl bg-black/60 border border-white/5 flex flex-col items-center gap-3 shadow-lg transform transition-transform duration-500 hover:scale-105">
                        <Globe className="h-10 w-10 text-blue-300 animate-pulse" />
                        <p className="text-white text-center text-sm sm:text-base">
                            Deploying your latest version of web application...
                        </p>
                        <div className="text-xs text-gray-300 max-w-[250px] text-center mt-1">
                            Please hold on while we prepare your application for
                            viewing.
                        </div>
                        <div className="mt-4">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                        </div>
                    </div>
                </div>
            )} */}

                    {/* Code sandbox */}
                    {previewUrl || webApplicationInfo?.url ? (
                        mode === "dev" ? (
                            <div
                                className={`relative flex justify-center w-full h-[calc(100%-40px)] `}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-genesoft/30 via-blue-500/20 to-purple-500/30 rounded-lg opacity-30"></div>
                                <div className="absolute inset-0 bg-grid-pattern bg-gray-900/20 mix-blend-overlay pointer-events-none"></div>
                                <iframe
                                    ref={iframeRef}
                                    className={`relative shadow-xl border border-white/10 ${viewMode === "mobile" && "w-[360px] md:w-[380px] h-[720px] rounded-b-lg mx-auto"} ${onPage === "manage-project" && viewMode === "desktop" ? "w-full h-full rounded-b-lg" : "w-full h-[720px] rounded-b-lg mx-auto"}`}
                                    src={
                                        webApplicationInfo?.codesandboxUrl
                                            ? `${webApplicationInfo?.codesandboxUrl}?embed=1`
                                            : webApplicationInfo?.url
                                    }
                                    title="Web Application Preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    sandbox="allow-scripts allow-same-origin"
                                ></iframe>
                            </div>
                        ) : (
                            <div
                                className={`relative flex justify-center w-full h-[calc(100%-40px)] `}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-genesoft/30 via-blue-500/20 to-purple-500/30 rounded-lg opacity-30"></div>
                                <div className="absolute inset-0 bg-grid-pattern bg-gray-900/20 mix-blend-overlay pointer-events-none"></div>
                                <iframe
                                    ref={iframeRef}
                                    className={`relative shadow-xl border border-white/10 ${viewMode === "mobile" && "w-[360px] md:w-[380px] h-[720px] rounded-b-lg mx-auto"} ${onPage === "manage-project" && viewMode === "desktop" ? "w-full h-full rounded-b-lg" : "w-full h-[720px] rounded-b-lg mx-auto"}`}
                                    src={previewUrl || webApplicationInfo?.url}
                                    title="Web Application Preview"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    sandbox="allow-scripts allow-same-origin"
                                ></iframe>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-[calc(100%-40px)] bg-gradient-to-b from-blue-900 to-purple-800 rounded-b-lg border border-white/10 overflow-hidden relative">
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
