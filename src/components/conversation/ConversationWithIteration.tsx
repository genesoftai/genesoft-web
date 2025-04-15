"use client";
import { getConversationById } from "@/actions/conversation";
import { getIterationById } from "@/actions/development";
import { ConversationWithIterations } from "@/types/conversation";
import { IterationWithTask } from "@/types/development";
import { Message } from "@/types/message";
import React, { useEffect, useState, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CircleCheck, ChevronDown, ChevronUp } from "lucide-react";
import { formatDateToHumanReadable } from "@/utils/common/time";
import { getTextSeparatedUnderScore } from "@/utils/common/text";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import SystemMessage from "./message/SystemMessage";
import AIAgentMessage from "./message/AIAgentMessage";
import UserMessage from "./message/UserMessage";

type Props = {
    conversationWithIteration: ConversationWithIterations;
    isOpen: boolean;
};

const ConversationWithIteration = ({
    conversationWithIteration,
    isOpen,
}: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [iteration, setIteration] = useState<IterationWithTask | null>(null);
    const [openTaskIds, setOpenTaskIds] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const setupConversation = async () => {
        setIsLoading(true);
        try {
            setupMessages();
            setupIteration();
        } catch (error) {
            console.error("Error setting up conversation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const setupIteration = async () => {
        try {
            const response = await getIterationById(
                conversationWithIteration.iteration_id,
            );
            setIteration(response);
        } catch (error) {
            console.error("Error setting up iteration:", error);
        }
    };

    const setupMessages = async () => {
        try {
            const response = await getConversationById(
                conversationWithIteration.id,
            );
            setMessages(response.messages);
        } catch (error) {
            console.error("Error setting up messages:", error);
        }
    };

    // Toggle task collapsible
    const toggleTask = (taskId: string) => {
        setOpenTaskIds((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId],
        );
    };

    // Auto scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isOpen && conversationWithIteration?.id) {
            setupConversation();
        }
    }, [conversationWithIteration, isOpen]);

    if (!isOpen) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-4 sm:p-6 md:p-8">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                    <span className="text-gray-400 text-sm">
                        Loading conversation...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <CardContent className="flex-grow p-0 overflow-hidden bg-gradient-to-r from-[#1e2124] to-[#222529]">
            <ScrollArea
                className="w-full h-[calc(80vh-80px)] conversation-scrollarea overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                scrollHideDelay={0}
            >
                <div className="flex flex-col p-3 sm:p-4 gap-3 sm:gap-4">
                    {/* Messages Section */}
                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-sm font-medium text-gray-300 mb-2 sm:mb-3 px-1">
                            Messages
                        </h3>

                        <div className="flex flex-col gap-3 sm:gap-4">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`group max-w-full w-full overflow-hidden ${index === messages.length - 1 ? "message-new" : ""}`}
                                >
                                    {message.sender_type === "system" ? (
                                        <SystemMessage message={message} />
                                    ) : message.sender_type === "user" ? (
                                        <UserMessage message={message} />
                                    ) : (
                                        <AIAgentMessage
                                            message={message}
                                            messagesLength={messages.length}
                                            index={index}
                                            status={
                                                conversationWithIteration.status
                                            }
                                            sender_id={message.sender_id || ""}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Iterations Section */}
                    {iteration && (
                        <div className="mt-2 sm:mt-4">
                            <h3 className="text-sm font-medium text-gray-300 mb-2 sm:mb-3 px-1">
                                AI Agent Tasks
                            </h3>

                            <div className="bg-primary-dark/30 rounded-lg border border-white/10 overflow-hidden w-full">
                                <div className="relative">
                                    {/* Iteration Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b border-white/10">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 sm:mb-0">
                                            <span
                                                className={`w-fit px-2 py-1 text-xs rounded-full ${
                                                    iteration.status ===
                                                    "in_progress"
                                                        ? "bg-blue-500/20 text-blue-300"
                                                        : iteration.status ===
                                                            "done"
                                                          ? "bg-green-500/20 text-green-300"
                                                          : "bg-yellow-500/20 text-yellow-300"
                                                }`}
                                            >
                                                {iteration.status ===
                                                "in_progress"
                                                    ? "In Progress"
                                                    : iteration.status ===
                                                        "done"
                                                      ? "Completed"
                                                      : "Pending"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {iteration.created_at
                                                ? formatDateToHumanReadable(
                                                      iteration.created_at,
                                                  )
                                                : ""}
                                        </div>
                                    </div>

                                    {/* Iteration Content */}
                                    <div className="p-3 sm:p-4">
                                        {/* Iteration Tasks */}
                                        {iteration.iteration_tasks &&
                                            iteration.iteration_tasks.length >
                                                0 && (
                                                <div className="mt-2">
                                                    <div className="space-y-2">
                                                        {iteration.iteration_tasks.map(
                                                            (task) => (
                                                                <Collapsible
                                                                    key={
                                                                        task.id
                                                                    }
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
                                                                    <CollapsibleTrigger className="flex justify-between items-center w-full p-2 sm:p-3 bg-white/5 hover:bg-white/10 transition-colors">
                                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-white">
                                                                            <span
                                                                                className={`w-fit px-2 py-1 text-xs rounded-full ${
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
                                                                        </div>
                                                                        {openTaskIds.includes(
                                                                            task.id,
                                                                        ) ? (
                                                                            <ChevronUp className="h-4 w-4 text-white flex-shrink-0" />
                                                                        ) : (
                                                                            <ChevronDown className="h-4 w-4 text-white flex-shrink-0" />
                                                                        )}
                                                                    </CollapsibleTrigger>
                                                                    <CollapsibleContent className="p-2 sm:p-3 bg-white/5 border-t border-white/10">
                                                                        <div className="text-xs text-gray-300">
                                                                            <p className="mb-2">
                                                                                {
                                                                                    task.description
                                                                                }
                                                                            </p>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                                                                <div>
                                                                                    <span className="text-gray-400">
                                                                                        AI
                                                                                        Agent:
                                                                                    </span>{" "}
                                                                                    {getTextSeparatedUnderScore(
                                                                                        task.team,
                                                                                    )}
                                                                                </div>
                                                                                {task.remark && (
                                                                                    <div className="col-span-1 sm:col-span-2">
                                                                                        <span className="text-gray-400">
                                                                                            Remark:
                                                                                        </span>{" "}
                                                                                        {
                                                                                            task.remark
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </CollapsibleContent>
                                                                </Collapsible>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Status Indicator */}
                                        <div className="mt-3 sm:mt-4">
                                            {iteration.status === "done" && (
                                                <div className="flex items-center gap-2 text-green-300 bg-green-500/10 p-2 rounded-md text-xs sm:text-sm">
                                                    <CircleCheck className="h-4 w-4 flex-shrink-0" />
                                                    <span>
                                                        Development completed
                                                        successfully
                                                    </span>
                                                </div>
                                            )}

                                            {iteration.status ===
                                                "in_progress" && (
                                                <div className="flex items-center gap-2 text-blue-300 bg-blue-500/10 p-2 rounded-md text-xs sm:text-sm">
                                                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                                                    <span>
                                                        Development in progress
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <style jsx global>{`
                @media (max-width: 640px) {
                    .conversation-scrollarea pre,
                    .conversation-scrollarea code {
                        font-size: 0.8rem;
                    }

                    .conversation-scrollarea p,
                    .conversation-scrollarea div,
                    .conversation-scrollarea span {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </CardContent>
    );
};

export default ConversationWithIteration;
