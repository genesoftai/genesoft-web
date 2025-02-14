"use client";

import { CheckCircle2, TriangleAlert } from "lucide-react";
import { DeploymentStatus } from "@/types/web-application";
import { useEffect, useState } from "react";

interface DeploymentStatusProps {
    status: DeploymentStatus;
}

export function DeploymentStatusBadge({ status }: DeploymentStatusProps) {
    const [textToShow, setTextToShow] = useState("");
    const [bgColor, setBgColor] = useState("");

    useEffect(() => {
        setupTextToShow();
        setupColor();
    }, [status]);

    const setupTextToShow = () => {
        if (status === DeploymentStatus.DEPLOYED) {
            setTextToShow("Deployment successful");
        } else if (status === DeploymentStatus.NOT_DEPLOYED) {
            setTextToShow("Deployment failed");
        }
    };

    const setupColor = () => {
        if (status === DeploymentStatus.DEPLOYED) {
            setBgColor("bg-emerald-400/50");
        } else if (status === DeploymentStatus.NOT_DEPLOYED) {
            setBgColor("bg-red-500/50");
        }
    };

    return (
        <div
            className={`flex items-center gap-2 text-sm ${bgColor} px-3 py-1 rounded-full`}
        >
            {status === DeploymentStatus.DEPLOYED && (
                <CheckCircle2 className="h-4 w-4" />
            )}
            {status === DeploymentStatus.NOT_DEPLOYED && (
                <TriangleAlert className="h-4 w-4" />
            )}
            <span>{textToShow}</span>
        </div>
    );
}
