"use client";

import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { DeploymentStatus, ReadyStatus } from "@/types/web-application";
import { useEffect, useState } from "react";

interface DeploymentStatusProps {
    status: DeploymentStatus;
    readyStatus: ReadyStatus;
}

export function DeploymentStatusBadge({
    status,
    readyStatus,
}: DeploymentStatusProps) {
    const [textToShow, setTextToShow] = useState("");
    const [bgColor, setBgColor] = useState("");

    useEffect(() => {
        setupTextToShow();
        setupColor();
    }, [status]);

    const setupTextToShow = () => {
        if (readyStatus === ReadyStatus.READY) {
            setTextToShow("Deployment successful");
        } else if (readyStatus === ReadyStatus.BUILDING) {
            setTextToShow("Deployment in progress");
        } else {
            setTextToShow("Deployment failed");
        }
    };

    const setupColor = () => {
        if (readyStatus === ReadyStatus.READY) {
            setBgColor("bg-emerald-400/50");
        } else if (readyStatus === ReadyStatus.BUILDING) {
            setBgColor("bg-genesoft-blue/50");
        } else {
            setBgColor("bg-red-500/50");
        }
    };

    return (
        <div
            className={`flex items-center gap-2 text-sm ${bgColor} px-3 py-1 rounded-full`}
        >
            {readyStatus === ReadyStatus.BUILDING && (
                <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {readyStatus === ReadyStatus.READY && (
                <CircleCheck className="h-4 w-4" />
            )}
            {readyStatus === ReadyStatus.FAILED && (
                <TriangleAlert className="h-4 w-4" />
            )}
            <span>{textToShow}</span>
        </div>
    );
}
