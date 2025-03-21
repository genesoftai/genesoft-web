"use client";

import { CircleCheck, ListOrdered, Loader2, TriangleAlert } from "lucide-react";
import { ReadyStatus } from "@/types/web-application";
import React, { useEffect, useState } from "react";

interface DeploymentStatusProps {
    readyStatus: ReadyStatus;
}

export function DeploymentStatusBadge({ readyStatus }: DeploymentStatusProps) {
    const [textToShow, setTextToShow] = useState("");
    const [bgColor, setBgColor] = useState("");
    const [additionalText, setAdditionalText] = useState("");
    useEffect(() => {
        setupTextToShow();
        setupColor();
    }, [readyStatus]);

    const setupTextToShow = () => {
        if (readyStatus === ReadyStatus.READY) {
            setTextToShow("Deployment successful");
            setAdditionalText(
                "Refresh web preview to see the latest version of your web application",
            );
        } else if (readyStatus === ReadyStatus.BUILDING) {
            setTextToShow("Deployment in progress");
            setAdditionalText("");
        } else if (readyStatus === ReadyStatus.ERROR) {
            setTextToShow(`Deployment failed`);
            setAdditionalText(
                `Please click Fix Errors to fix the deployment failed\n\
                or Please contact support at support@genesoft.com`,
            );
        } else if (readyStatus === ReadyStatus.QUEUED) {
            setTextToShow("Deployment is on the queue");
            setAdditionalText("");
        }
    };

    const setupColor = () => {
        if (readyStatus === ReadyStatus.READY) {
            setBgColor("bg-emerald-400/50");
        } else if (readyStatus === ReadyStatus.BUILDING) {
            setBgColor("bg-genesoft-blue/50");
        } else if (readyStatus === ReadyStatus.ERROR) {
            setBgColor("bg-red-500/50");
        } else if (readyStatus === ReadyStatus.QUEUED) {
            setBgColor("bg-amber-400/50");
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <div
                className={`flex items-center gap-2 text-sm ${bgColor} px-3 py-1 rounded-full w-fit text-white`}
            >
                {readyStatus === ReadyStatus.BUILDING && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {readyStatus === ReadyStatus.READY && (
                    <CircleCheck className="h-4 w-4" />
                )}
                {readyStatus === ReadyStatus.ERROR && (
                    <TriangleAlert className="h-4 w-4" />
                )}
                {readyStatus === ReadyStatus.QUEUED && (
                    <ListOrdered className="h-4 w-4" />
                )}
                <span>{textToShow}</span>
            </div>

            <span className="text-xs text-gray-400">{additionalText}</span>
        </div>
    );
}
