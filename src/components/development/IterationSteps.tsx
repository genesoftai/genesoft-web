import React, { useEffect, useState } from "react";
import IterationStep from "./IterationStep";
import { IterationStep as IterationStepType } from "@/types/development";
import { getIterationStepsByIterationTaskId } from "@/actions/development";
import { Loader2 } from "lucide-react";
import ProjectManagerImage from "@public/ai-agent/project-manager-ai.png";
import BackendDeveloperImage from "@public/ai-agent/backend-developer-ai.png";
import FrontendDeveloperImage from "@public/ai-agent/frontend-developer-ai.png";
import UxUiDesignerImage from "@public/ai-agent/ux-ui-deisgner.png";
import SoftwareArchitectImage from "@public/ai-agent/software-architect-ai.png";
import TechnicalProjectManagerImage from "@public/ai-agent/technical-project-manager.png";
import Image from "next/image";
import { getAgentFullName } from "@/utils/common/text";

type Props = {
    iterationTaskId: string;
    removeOpenTaskId: (taskId: string) => void;
    status: string;
    agentName: string;
};

const getAiAgentImage = (team: string) => {
    console.log("team", team);
    if (team === "project_manager_agent") return ProjectManagerImage;
    if (team === "backend_developer_agent") return BackendDeveloperImage;
    if (team === "frontend_developer_agent") return FrontendDeveloperImage;
    if (team === "ux_ui_designer_agent") return UxUiDesignerImage;
    if (team === "software_architect_agent") return SoftwareArchitectImage;
    if (team === "technical_project_manager_agent")
        return TechnicalProjectManagerImage;
    return "";
};

const IterationSteps = ({ iterationTaskId, status, agentName }: Props) => {
    const [iterationSteps, setIterationSteps] = useState<IterationStepType[]>(
        [],
    );
    const [loading, setLoading] = useState(false);

    const setupIterationSteps = async () => {
        setLoading(true);
        try {
            const iterationStepsData =
                await getIterationStepsByIterationTaskId(iterationTaskId);
            setIterationSteps(iterationStepsData);
        } catch (error) {
            console.error(
                "Error getting iteration steps by iteration task id:",
                error,
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (iterationTaskId) {
            setupIterationSteps();

            let pollingInterval: NodeJS.Timeout | null = null;

            if (status === "in_progress") {
                pollingInterval = setInterval(() => {
                    setupIterationSteps();
                }, 60000);
            }

            return () => {
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                }
            };
        }
    }, [iterationTaskId, status]);

    console.log({
        message: "IterationSteps: iteration steps by iteration task id",
        iterationTaskId,
        iterationSteps,
    });

    return (
        <div className="relative flex flex-col items-center gap-4">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <p>Loading iteration steps...</p>
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
            ) : (
                iterationSteps.map((iterationStep, index) => (
                    <IterationStep
                        key={iterationStep.id}
                        {...iterationStep}
                        index={index}
                    />
                ))
            )}

            {status === "in_progress" && (
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Image
                            src={getAiAgentImage(agentName)}
                            alt="AI Agent"
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                        <p className="text-sm text-gray-400">
                            {getAgentFullName(agentName)} is working on this
                            task...
                        </p>
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default IterationSteps;
