import { LatestIteration } from "@/types/development";
import { formatDateToHumanReadable } from "@/utils/common/time";
import { CircleCheck, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import React, { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getTextSeparatedUnderScore } from "@/utils/common/text";
import IterationSteps from "@/components/development/IterationSteps";
import ProjectManagerImage from "@public/ai-agent/project-manager-ai.png";
import BackendDeveloperImage from "@public/ai-agent/backend-developer-ai.png";
import FrontendDeveloperImage from "@public/ai-agent/frontend-developer-ai.png";
import UxUiDesignerImage from "@public/ai-agent/ux-ui-deisgner.png";
import SoftwareArchitectImage from "@public/ai-agent/software-architect-ai.png";

import Image from "next/image";

type DevelopmentActivityProps = {
    pollingCount: number;
    latestIteration: LatestIteration | null;
    project: {
        name: string;
        description: string;
    };
};

const DevelopmentActivity = ({
    pollingCount,
    latestIteration,
    project,
}: DevelopmentActivityProps) => {
    const [openTaskIds, setOpenTaskIds] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleTask = (taskId: string) => {
        setOpenTaskIds((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId],
        );
    };

    const removeOpenTaskId = (taskId: string) => {
        setOpenTaskIds((prev) => prev.filter((id) => id !== taskId));
    };

    const getAiAgentImage = (team: string) => {
        console.log("team", team);
        if (team === "project_manager_agent") return ProjectManagerImage;
        if (team === "backend_developer_agent") return BackendDeveloperImage;
        if (team === "frontend_developer_agent") return FrontendDeveloperImage;
        if (team === "ux_ui_designer_agent") return UxUiDesignerImage;
        if (team === "software_architect_agent") return SoftwareArchitectImage;
        return "";
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="text-sm font-medium text-gray-300 flex flex-col md:flex-row items-center gap-2 mt-8">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    Software Development Activity for latest generation
                </div>
                {pollingCount > 0 && (
                    <span className="text-xs text-gray-400 animate-pulse">
                        (next update in {10 - (pollingCount % 10)}s)
                    </span>
                )}
            </div>

            <Collapsible
                open={!isCollapsed}
                onOpenChange={(open) => setIsCollapsed(!open)}
                className="w-full"
            >
                <div className="bg-primary-dark/30 rounded-lg border border-white/10 overflow-hidden w-full">
                    {latestIteration ? (
                        <div className="relative">
                            {/* Activity Header */}
                            <CollapsibleTrigger className="flex justify-between items-center w-full bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex flex-row justify-between items-center w-full p-4 border-b border-white/10">
                                    <div className="flex flex-col md:flex-row items-center gap-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                latestIteration.status ===
                                                "in_progress"
                                                    ? "bg-blue-500/20 text-blue-300"
                                                    : latestIteration.status ===
                                                        "done"
                                                      ? "bg-green-500/20 text-green-300"
                                                      : "bg-yellow-500/20 text-yellow-300"
                                            }`}
                                        >
                                            {latestIteration.status ===
                                            "in_progress"
                                                ? "In Progress"
                                                : latestIteration.status ===
                                                    "done"
                                                  ? "Completed"
                                                  : "Pending"}
                                        </span>
                                        <span className="text-sm font-medium text-white">
                                            {latestIteration.type === "project"
                                                ? "Project Initialization"
                                                : "Conversation based development"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs text-gray-400">
                                            {latestIteration.created_at
                                                ? formatDateToHumanReadable(
                                                      latestIteration.created_at,
                                                  )
                                                : ""}
                                        </div>
                                        {isCollapsed ? (
                                            <ChevronDown className="h-4 w-4 text-white" />
                                        ) : (
                                            <ChevronUp className="h-4 w-4 text-white" />
                                        )}
                                    </div>
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="p-4">
                                {/* Activity Content */}
                                <div className="p-4">
                                    <div className="mb-3">
                                        <h4 className="text-sm font-medium mb-2 text-white">
                                            Development Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            {latestIteration.conversation && (
                                                <div className="bg-white/5 p-3 rounded-md">
                                                    <div className="font-medium text-gray-300 mb-1">
                                                        <span className="text-xs">
                                                            Conversation
                                                        </span>
                                                    </div>
                                                    <div className="text-white font-bold">
                                                        {
                                                            latestIteration
                                                                .conversation
                                                                .name
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                            {latestIteration.type ===
                                                "project" && (
                                                <div className="bg-white/5 p-3 rounded-md">
                                                    <div className="font-medium text-gray-300 mb-1">
                                                        Project
                                                    </div>
                                                    <div className="text-white font-bold">
                                                        {project?.name ||
                                                            "Project Development"}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                        {project?.description ||
                                                            "Building the application infrastructure"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Iteration Tasks */}
                                    {latestIteration.iteration_tasks &&
                                        latestIteration.iteration_tasks.length >
                                            0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium mb-2 text-white">
                                                    Development Tasks
                                                </h4>
                                                <div className="space-y-2">
                                                    {latestIteration.iteration_tasks.map(
                                                        (task) => (
                                                            <Collapsible
                                                                key={task.id}
                                                                open={openTaskIds.includes(
                                                                    task.id,
                                                                )}
                                                                onOpenChange={() =>
                                                                    toggleTask(
                                                                        task.id,
                                                                    )
                                                                }
                                                                className="border border-white/10 rounded-md overflow-hidden"
                                                            >
                                                                <CollapsibleTrigger className="flex justify-between items-center w-full p-3 bg-white/5 hover:bg-white/10 transition-colors">
                                                                    <div className="flex items-center gap-2 text-white">
                                                                        <span
                                                                            className={`px-2 py-1 text-xs rounded-full ${
                                                                                task.status ===
                                                                                "in_progress"
                                                                                    ? "bg-blue-500/20 text-blue-300"
                                                                                    : task.status ===
                                                                                        "completed"
                                                                                      ? "bg-green-500/20 text-green-300"
                                                                                      : "bg-yellow-500/20 text-yellow-300"
                                                                            }`}
                                                                        >
                                                                            {task.status ===
                                                                            "in_progress"
                                                                                ? "In Progress"
                                                                                : task.status ===
                                                                                    "completed"
                                                                                  ? "Completed"
                                                                                  : "Pending"}
                                                                        </span>
                                                                        <span className="text-sm font-medium">
                                                                            {
                                                                                task.name
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-gray-400">
                                                                            {task.status ===
                                                                                "in_progress" && (
                                                                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {openTaskIds.includes(
                                                                        task.id,
                                                                    ) ? (
                                                                        <ChevronUp className="h-4 w-4 text-white" />
                                                                    ) : (
                                                                        <ChevronDown className="h-4 w-4 text-white" />
                                                                    )}
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent className="p-3 bg-white/5 border-t border-white/10">
                                                                    <div className="flex flex-col gap-2 text-xs text-gray-300">
                                                                        <p className="mb-2">
                                                                            {
                                                                                task.description
                                                                            }
                                                                        </p>
                                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <Image
                                                                                    src={getAiAgentImage(
                                                                                        task.team,
                                                                                    )}
                                                                                    width={
                                                                                        30
                                                                                    }
                                                                                    height={
                                                                                        30
                                                                                    }
                                                                                    alt={
                                                                                        task.team
                                                                                    }
                                                                                    className="rounded-full"
                                                                                />
                                                                                <span>
                                                                                    {getTextSeparatedUnderScore(
                                                                                        task.team,
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            {task.remark && (
                                                                                <div className="col-span-2">
                                                                                    <span className="text-gray-400">
                                                                                        Remark:
                                                                                    </span>{" "}
                                                                                    {
                                                                                        task.remark
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <IterationSteps
                                                                            iterationTaskId={
                                                                                task.id
                                                                            }
                                                                            removeOpenTaskId={
                                                                                removeOpenTaskId
                                                                            }
                                                                        />
                                                                    </div>
                                                                </CollapsibleContent>
                                                            </Collapsible>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Visual Activity Indicator */}
                                    {latestIteration.status === "done" && (
                                        <div className="flex items-center gap-2 text-green-300 bg-green-500/10 p-2 rounded-md text-sm mt-2">
                                            <CircleCheck className="h-4 w-4" />
                                            <span>
                                                Development completed
                                                successfully
                                            </span>
                                        </div>
                                    )}

                                    {latestIteration.status ===
                                        "in_progress" && (
                                        <div className="flex items-center gap-2 text-blue-300 bg-blue-500/10 p-2 rounded-md text-sm mt-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Development in progress</span>
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </div>
                    ) : (
                        <div className="p-6 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 border-4 border-t-transparent border-genesoft rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400 text-sm">
                                Loading development activity...
                            </p>
                        </div>
                    )}
                </div>
            </Collapsible>
        </div>
    );
};

export default DevelopmentActivity;
