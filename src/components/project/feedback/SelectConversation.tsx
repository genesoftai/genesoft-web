import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Feedback } from "@/types/feedback";

type SelectConversationProps = {
    historicalFeedbacks: Feedback[];
    handleSelectConversation: (conversation: Feedback) => void;
    selectedFeedback: Feedback | null;
};

export function SelectConversation({
    historicalFeedbacks,
    handleSelectConversation,
    selectedFeedback,
}: SelectConversationProps) {
    const getConversationName = (feedback: Feedback) => {
        if (!feedback) {
            return "Untitled";
        }
        return feedback?.messages?.length > 0
            ? feedback?.messages[0].content
            : "Untitled";
    };

    const onSelectConversation = (id: string) => {
        console.log({
            message: "onSelectConversation: id",
            id,
        });
        const feedback = historicalFeedbacks.find(
            (feedback) => feedback.id === id,
        ) as Feedback;
        handleSelectConversation(feedback);
    };

    console.log({
        historicalFeedbacks,
        selectedFeedback,
    });

    return (
        <Select
            value={selectedFeedback?.id}
            onValueChange={(value) => {
                onSelectConversation(value);
            }}
        >
            <SelectTrigger className="w-6/12">
                <SelectValue placeholder="Select a conversation" />
            </SelectTrigger>
            <SelectContent className="w-full">
                <SelectGroup>
                    <SelectLabel>Conversations</SelectLabel>
                    {historicalFeedbacks.map((feedback) => (
                        <SelectItem
                            className="flex gap-x-2 w-full px-2"
                            key={feedback.id}
                            value={feedback.id}
                        >
                            <span className="text-sm mr-2">
                                {getConversationName(feedback).length > 50
                                    ? getConversationName(feedback).substring(
                                          0,
                                          50,
                                      ) + "..."
                                    : getConversationName(feedback)}
                            </span>
                            <span
                                className={`text-xs ${
                                    feedback.is_submit
                                        ? "text-green-500"
                                        : "text-genesoft"
                                }`}
                            >
                                {feedback.is_submit ? "Submitted" : "Ongoing"}
                            </span>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
