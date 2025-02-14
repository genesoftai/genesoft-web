"use client";

import { CheckCircle2, Code } from "lucide-react";
import { DevelopmentStatus } from "@/types/web-application";
import { useEffect, useState } from "react";

interface DevelopmentStatusProps {
    status: DevelopmentStatus;
}

export function DevelopmentStatusBadge({ status }: DevelopmentStatusProps) {
    const [textToShow, setTextToShow] = useState("");
    const [bgColor, setBgColor] = useState("");

    useEffect(() => {
        setupTextToShow();
        setupColor();
    }, [status]);

    const setupTextToShow = () => {
        if (status === DevelopmentStatus.DEVELOPMENT_DONE) {
            setTextToShow("Development Done");
        } else if (
            status === DevelopmentStatus.FEEDBACK_ITERATION_IN_PROGRESS
        ) {
            setTextToShow(
                "Feedback Development In Progress by Software Development team of AI Agents",
            );
        } else if (
            status === DevelopmentStatus.REQUIREMENTS_ITERATION_IN_PROGRESS
        ) {
            setTextToShow(
                "Requirements Development In Progress by Software Development team of AI Agents",
            );
        }
    };

    const setupColor = () => {
        if (status === DevelopmentStatus.DEVELOPMENT_DONE) {
            setBgColor("bg-emerald-400/50");
        } else if (
            status === DevelopmentStatus.FEEDBACK_ITERATION_IN_PROGRESS ||
            status === DevelopmentStatus.REQUIREMENTS_ITERATION_IN_PROGRESS
        ) {
            setBgColor("bg-amber-400/50");
        }
    };

    const isInProgress =
        status === DevelopmentStatus.FEEDBACK_ITERATION_IN_PROGRESS ||
        status === DevelopmentStatus.REQUIREMENTS_ITERATION_IN_PROGRESS;

    return (
        <div
            className={`flex items-center gap-2 text-sm ${bgColor} px-3 py-1 rounded-full ${isInProgress ? "animate-pulse" : ""}`}
        >
            {status === DevelopmentStatus.DEVELOPMENT_DONE && (
                <CheckCircle2 className="h-4 w-4" />
            )}
            {[
                DevelopmentStatus.FEEDBACK_ITERATION_IN_PROGRESS,
                DevelopmentStatus.REQUIREMENTS_ITERATION_IN_PROGRESS,
            ].includes(status) && <Code className="h-4 w-4 animate-pulse" />}
            <span>{textToShow}</span>
        </div>
    );
}
