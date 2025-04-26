import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LatestIteration } from "@/types/development";
import { Project } from "@/types/project";
import { HistoryIcon } from "lucide-react";
import DevelopmentActivity from "../manage/development/DevelopmentActivity";
import { DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import ConversationWithIteration from "@/components/conversation/ConversationWithIteration";
import { formatDateToHumanReadable } from "@/utils/common/time";
import { ConversationWithIterations } from "@/types/conversation";
import { getConversationsWithIterationsByProjectId } from "@/actions/conversation";
import { ScrollArea } from "@/components/ui/scroll-area";
import AIAgentAnalyzing from "../common/AIAgentAnalyzing";

interface Props {
    project: Project | null;
    latestIteration: LatestIteration | null;
}

const WebGenerations = ({ project, latestIteration }: Props) => {
    const [conversationsWithIterations, setConversationsWithIterations] =
        useState<ConversationWithIterations[]>([]);

    useEffect(() => {
        setupConversationsWithIterations();
    }, [project?.id]);

    const setupConversationsWithIterations = async () => {
        try {
            if (project?.id) {
                const response =
                    await getConversationsWithIterationsByProjectId(project.id);
                setConversationsWithIterations(response);
            }
        } catch (error) {
            console.error(
                "Error setting up conversations with iterations:",
                error,
            );
        }
    };

    if (
        !latestIteration ||
        !latestIteration.iteration_tasks ||
        latestIteration.iteration_tasks.length === 0
    ) {
        return <AIAgentAnalyzing projectType={"web"} />;
    }

    return (
        <Card className="h-full bg-primary-dark text-white border-none">
            <CardHeader>
                <CardTitle>Project tasks history </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)]">
                    {conversationsWithIterations.length > 0 && (
                        <div className="flex flex-col gap-4 w-full">
                            {conversationsWithIterations?.map(
                                (conversation) => (
                                    <Dialog key={conversation?.id}>
                                        <DialogTrigger asChild>
                                            <Card className="flex flex-col w-full bg-[#1a1d21] border-0 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:bg-[#222529] transition-colors">
                                                <CardHeader className="flex flex-row items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1e2124] to-[#222529] border-b border-[#383838] transition-colors duration-200 shadow-sm">
                                                    <CardTitle className="text-lg font-semibold text-white flex justify-between items-center w-full">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-blue-300 font-medium text-xs md:text-sm">
                                                                {conversation?.name ||
                                                                    "Untitled"}
                                                            </span>
                                                        </div>
                                                        <HistoryIcon className="h-5 w-5 text-blue-300" />
                                                    </CardTitle>
                                                </CardHeader>
                                            </Card>
                                        </DialogTrigger>
                                        <DialogContent className="w-11/12 md:w-8/12 max-w-5xl p-0 bg-[#1a1d21] border border-[#383838] text-white rounded-lg">
                                            <DialogHeader className="px-4 py-3 bg-gradient-to-r from-[#1e2124] to-[#222529] border-b border-[#383838]">
                                                <DialogTitle className="text-lg font-semibold text-white flex flex-col md:flex-row items-center gap-3 pt-8 md:pt-4">
                                                    <span className="text-blue-300 font-medium">
                                                        {conversation?.name ||
                                                            "Untitled"}
                                                    </span>
                                                    <span className="px-2.5 py-1 text-xs rounded-full bg-[#2a2d32] text-gray-300 border border-[#3a3d42] shadow-inner">
                                                        {conversation?.updated_at
                                                            ? formatDateToHumanReadable(
                                                                  conversation.updated_at,
                                                              )
                                                            : ""}
                                                    </span>
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="max-h-[80vh] overflow-hidden">
                                                <ConversationWithIteration
                                                    conversationWithIteration={
                                                        conversation
                                                    }
                                                    isOpen={true}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ),
                            )}
                        </div>
                    )}

                    {latestIteration && (
                        <DevelopmentActivity
                            pollingCount={0}
                            latestIteration={latestIteration}
                            project={{
                                name: project?.name || "",
                                description: project?.description || "",
                            }}
                        />
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default WebGenerations;
