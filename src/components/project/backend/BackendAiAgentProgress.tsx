import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IterationTask, LatestIteration } from "@/types/development";
import { Project } from "@/types/project";
import { getLatestIteration } from "@/actions/development";
import { Loader2 } from "lucide-react";

interface Props {
    project: Project | null;
}

const BackendAiAgentProgress = ({ project }: Props) => {
    const [latestIteration, setLatestIteration] =
        useState<LatestIteration | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestIteration = async () => {
            if (!project?.id) return;

            try {
                setLoading(true);
                const data = await getLatestIteration(project.id);
                setLatestIteration(data);
            } catch (error) {
                console.error("Error fetching latest iteration:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestIteration();
    }, [project?.id]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "done":
                return "bg-green-500";
            case "in_progress":
                return "bg-blue-500";
            case "failed":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-primary-dark text-white">
                <Loader2 className="h-8 w-8 animate-spin text-genesoft" />
            </div>
        );
    }

    if (
        !latestIteration ||
        !latestIteration.iteration_tasks ||
        latestIteration.iteration_tasks.length === 0
    ) {
        return (
            <Card className="h-full bg-primary-dark text-white border-none">
                <CardHeader>
                    <CardTitle>AI Agent Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-64">
                        <p className="text-subtext-in-dark-bg">
                            No tasks found for this project
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full bg-primary-dark text-white border-none">
            <CardHeader>
                <CardTitle>AI Agent Progress</CardTitle>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={`${getStatusColor(latestIteration.status)} text-xs text-white`}
                    >
                        {latestIteration.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-4">
                        {latestIteration.iteration_tasks.map(
                            (task: IterationTask) => (
                                <div
                                    key={task.id}
                                    className="border border-line-in-dark-bg rounded-lg p-4 bg-secondary-dark"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium">
                                            {task.name}
                                        </h3>
                                        <Badge
                                            className={getStatusColor(
                                                task.status,
                                            )}
                                        >
                                            {task.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-subtext-in-dark-bg mb-2">
                                        {task.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="font-medium text-subtext-in-dark-bg">
                                                Agent:
                                            </span>{" "}
                                            <span className="text-white font-bold">
                                                {task.team}
                                            </span>
                                        </div>
                                    </div>
                                    {task.remark && (
                                        <div className="mt-2">
                                            <span className="font-medium text-sm">
                                                Remarks:
                                            </span>
                                            <p className="text-sm text-subtext-in-dark-bg">
                                                {task.remark}
                                            </p>
                                        </div>
                                    )}
                                    <Separator className="my-3 bg-line-in-dark-bg" />
                                    <div className="text-xs text-subtext-in-dark-bg">
                                        Created:{" "}
                                        {new Date(
                                            task.created_at,
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default BackendAiAgentProgress;
