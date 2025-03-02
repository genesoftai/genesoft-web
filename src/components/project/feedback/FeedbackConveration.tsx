import React from "react";
import { Feedback, FeedbackMessage } from "@/types/feedback";
import Message from "./Message";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationProps {
    feedback: Feedback | null;
}

const Conversation: React.FC<ConversationProps> = ({ feedback }) => {
    if (!feedback?.messages?.length) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-300px)] p-4 text-subtext-in-dark-bg">
                No messages yet. Start a conversation to improve your web
                application!
            </div>
        );
    }

    return (
        <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="flex flex-col gap-4 p-4">
                {feedback.messages.map(
                    (message: FeedbackMessage, index: number) => (
                        <div key={index} className="flex flex-col gap-1">
                            <Message
                                content={message.content}
                                sender={message.sender}
                            />

                            <div
                                className={`text-xs text-subtext-in-dark-bg ${
                                    message.sender === "user"
                                        ? "text-right"
                                        : "text-left"
                                }`}
                            >
                                {new Date(
                                    message.timestamp,
                                ).toLocaleTimeString()}
                            </div>
                        </div>
                    ),
                )}
            </div>
        </ScrollArea>
    );
};

export default Conversation;
