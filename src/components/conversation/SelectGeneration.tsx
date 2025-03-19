import { ChevronDown } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { MessageCircleMore } from "lucide-react";
import React from "react";
import { Message } from "@/types/message";
import { SprintOption } from "./Conversation";
type Props = {
    status: string;
    generationOptions: SprintOption[];
    selectedGeneration: string;
    onGenerationChange: (sprintId: string) => void;
    setIsGenerationMenuOpen: (isGenerationMenuOpen: boolean) => void;
    isGenerationMenuOpen: boolean;
    setMessages: (messages: Message[]) => void;
};

const SelectGeneration = ({
    status,
    generationOptions,
    selectedGeneration,
    onGenerationChange,
    setIsGenerationMenuOpen,
    isGenerationMenuOpen,
    setMessages,
}: Props) => {
    return (
        <div className="relative min-w-[100px]">
            <p className="text-gray-400 text-xs">History</p>
            <div
                className="flex items-center gap-1 bg-[#252a2e] hover:bg-[#2c3235] py-1 px-3 rounded-md cursor-pointer text-sm font-normal"
                onClick={() => setIsGenerationMenuOpen(!isGenerationMenuOpen)}
            >
                {status === "submitted" ? (
                    <CircleCheck size={16} className="text-green-500" />
                ) : (
                    <MessageCircleMore size={16} className="text-blue-500" />
                )}
                <span className="text-white">
                    {
                        generationOptions.find(
                            (generation) =>
                                generation.id === selectedGeneration,
                        )?.name
                    }
                </span>
                <ChevronDown size={16} />
            </div>

            {isGenerationMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-[#252a2e] rounded-md shadow-lg z-10 min-w-[200px]">
                    {generationOptions.map((generation) => (
                        <div
                            key={generation.id}
                            className={`py-2 px-3 cursor-pointer hover:bg-[#2c3235] text-sm ${selectedGeneration === generation.id ? "bg-[#1e62d0] text-white" : "text-gray-300"} flex items-center gap-2`}
                            onClick={() => {
                                if (onGenerationChange) {
                                    setMessages([]);
                                    onGenerationChange(generation.id);
                                }
                                setIsGenerationMenuOpen(false);
                            }}
                        >
                            {generation?.status === "submitted" ? (
                                <CircleCheck
                                    size={16}
                                    className="text-green-500"
                                />
                            ) : (
                                <MessageCircleMore
                                    size={16}
                                    className="text-blue-500"
                                />
                            )}
                            <span>{generation.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectGeneration;
