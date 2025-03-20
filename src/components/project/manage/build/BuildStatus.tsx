import React, { useEffect, useState } from "react";
import { ReadyStatus, WebApplicationInfo } from "@/types/web-application";
import { Loader2, TriangleAlert, Wrench } from "lucide-react";
import { recheckBuild } from "@/actions/development";
import { Button } from "@/components/ui/button";

type BuildStatusProps = {
    projectId: string;
    webApplicationInfo: WebApplicationInfo;
};

const BuildStatus = ({ projectId, webApplicationInfo }: BuildStatusProps) => {
    const [isRecheckingBuild, setIsRecheckingBuild] = useState(false);
    const [buildStatus, setBuildStatus] = useState<string | null>(null);

    const handleRecheckBuild = async () => {
        setIsRecheckingBuild(true);
        const buildResult = await recheckBuild(projectId);
        if (buildResult?.status) {
            setBuildStatus(buildResult.status);
        }
        setIsRecheckingBuild(false);
    };

    useEffect(() => {
        if (webApplicationInfo?.repositoryBuild?.status === "failed") {
            handleRecheckBuild();
        }
    }, [webApplicationInfo?.repositoryBuild?.status]);

    useEffect(() => {
        if (webApplicationInfo?.repositoryBuild?.status) {
            setBuildStatus(webApplicationInfo?.repositoryBuild?.status);
        }
    }, [webApplicationInfo]);

    return (
        <div className="flex flex-col gap-1 w-full mt-4">
            <div className="text-sm font-medium text-white flex items-center gap-2">
                <span className="text-xs sm:text-sm md:text-base text-white font-bold">
                    Build Status
                </span>
                {isRecheckingBuild && (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                        <span className="text-xs text-gray-400">
                            Rechecking build status...
                        </span>
                    </div>
                )}
                {buildStatus === "failed" && (
                    <TriangleAlert className="h-4 w-4 text-red-400" />
                )}
                {buildStatus === "pending" && (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                )}
                {buildStatus === "in_progress" && (
                    <Wrench className="h-4 w-4 animate-pulse text-genesoft" />
                )}
                {buildStatus === "failed" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-white/80 text-black ml-10"
                        onClick={handleRecheckBuild}
                    >
                        Check Build Errors again
                    </Button>
                )}
            </div>
            <div className="flex flex-col p-4 bg-primary-dark/30 rounded-lg border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">Status</span>
                        <span
                            className={`text-sm font-medium ${
                                buildStatus === "success"
                                    ? "text-green-400"
                                    : buildStatus === "pending" ||
                                        buildStatus === "in_progress"
                                      ? "text-yellow-400"
                                      : buildStatus === "done"
                                        ? "text-blue-400"
                                        : "text-red-400"
                            }`}
                        >
                            {buildStatus === "success"
                                ? "Successfully Deployed"
                                : buildStatus === "pending"
                                  ? "Deployment in Progress"
                                  : buildStatus === "in_progress"
                                    ? "AI Agent Fixing Errors for deployment failed"
                                    : buildStatus === "done"
                                      ? "AI Agent Fix Attempt Done. If there are still errors, please click the Fix Errors button again. It's free to fix errors."
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
                            {webApplicationInfo.repositoryBuild.fix_attempts}
                        </span>
                    </div>
                </div>

                {webApplicationInfo.readyStatus === ReadyStatus.ERROR && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-red-300">
                                    We couldn&apos;t deploy your website
                                </span>
                                <span className="text-xs text-gray-400">
                                    Fix attempts:{" "}
                                    {
                                        webApplicationInfo.repositoryBuild
                                            .fix_attempts
                                    }
                                </span>
                            </div>

                            {webApplicationInfo?.repositoryBuild
                                ?.error_logs && (
                                <div className="mt-2 p-2 bg-black/50 rounded border border-white/10 max-h-32 overflow-y-auto">
                                    <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                                        {
                                            webApplicationInfo.repositoryBuild
                                                .error_logs
                                        }
                                    </pre>
                                </div>
                            )}

                            <p className="text-xs text-gray-400 self-end">
                                Please click fix errors and or contact support
                                at{" "}
                                <a
                                    href="mailto:support@genesoft.com"
                                    className="text-blue-300 hover:text-blue-400"
                                >
                                    support@genesoft.com
                                </a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuildStatus;
