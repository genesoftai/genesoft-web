import { formatDateToHumanReadable } from "@/utils/common/time";
import { ReadyStatus, WebApplicationInfo } from "@/types/web-application";
import React from "react";
import { DeploymentStatusBadge } from "../project/web-application/DeploymentStatus";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Wrench } from "lucide-react";
import BuildStatus from "../project/manage/build/BuildStatus";
import { LatestIteration } from "@/types/development";

type Props = {
    webApplicationInfo: WebApplicationInfo;
    handleFixErrors: () => void;
    isCheckingBuildErrors: boolean;
    projectId: string;
    latestIteration: LatestIteration;
};

const DeploymentStatus = ({
    webApplicationInfo,
    handleFixErrors,
    isCheckingBuildErrors,
    projectId,
    latestIteration,
}: Props) => {
    return (
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
                    {[ReadyStatus.READY, ReadyStatus.BUILDING].includes(
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
                    {latestIteration?.status === "done" &&
                        webApplicationInfo?.readyStatus === ReadyStatus.ERROR &&
                        !webApplicationInfo?.repositoryBuild?.fix_triggered && (
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
                                    We found some error for deploying your
                                    latest version of web application. Please
                                    click fix errors in your web application to
                                    redeploy
                                </p>
                            </div>
                        )}
                </div>

                {webApplicationInfo?.readyStatus === ReadyStatus.ERROR &&
                    webApplicationInfo?.repositoryBuild?.fix_triggered && (
                        <BuildStatus
                            projectId={projectId}
                            webApplicationInfo={webApplicationInfo}
                        />
                    )}
            </div>
        </div>
    );
};

export default DeploymentStatus;
