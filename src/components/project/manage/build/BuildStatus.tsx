import React, { useEffect, useState } from "react";
import { WebApplicationInfo } from "@/types/web-application";
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
                                      : "text-red-400"
                            }`}
                        >
                            {buildStatus === "success"
                                ? "Successfully Deployed"
                                : buildStatus === "pending"
                                  ? "Deployment in Progress"
                                  : buildStatus === "in_progress"
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
                            {webApplicationInfo.repositoryBuild.fix_attempts}
                        </span>
                    </div>
                </div>

                {buildStatus === "failed" && (
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

                            {buildStatus === "failed" &&
                                webApplicationInfo.repositoryBuild
                                    .error_logs && (
                                    <div className="mt-2 p-2 bg-black/50 rounded border border-white/10 max-h-32 overflow-y-auto">
                                        <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                                            {
                                                webApplicationInfo
                                                    .repositoryBuild.error_logs
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
                                Please contact support at support@genesoft.com
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuildStatus;
