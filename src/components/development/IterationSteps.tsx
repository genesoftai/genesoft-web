import React, { useEffect, useState } from "react";
import IterationStep from "./IterationStep";
import { IterationStep as IterationStepType } from "@/types/development";
import { getIterationStepsByIterationTaskId } from "@/actions/development";
import { Loader2 } from "lucide-react";

type Props = {
    iterationTaskId: string;
    removeOpenTaskId: (taskId: string) => void;
};

const IterationSteps = ({ iterationTaskId }: Props) => {
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
        }
    }, [iterationTaskId]);

    console.log({
        message: "IterationSteps: iteration steps by iteration task id",
        iterationTaskId,
        iterationSteps,
    });

    return (
        <div className="relative flex flex-col gap-4">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <p>Loading iteration steps...</p>
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
            ) : (
                iterationSteps.map((iterationStep) => (
                    <IterationStep key={iterationStep.id} {...iterationStep} />
                ))
            )}
        </div>
    );
};

export default IterationSteps;
