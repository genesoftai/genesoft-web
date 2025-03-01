import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send, ChevronDown, Info, Smile, Paperclip } from "lucide-react";
import { getFirstCharacterUppercase } from "@/utils/common/text";
import GenesoftLogo from "@public/assets/genesoft-logo-blue.png";
import Image from "next/image";

// Message types
export interface IMessage {
    id: string;
    content: string;
    sender: "user" | "ai" | "system";
    timestamp: Date;
    user?: {
        name: string;
        avatar?: string;
    };
}

export interface ConversationProps {
    type: string;
    channelName?: string;
    initialMessages?: IMessage[];
    onSendMessage?: (message: string) => void;
    isLoading?: boolean;
    sprintSelection?: {
        id: string;
        name: string;
    }[];
    selectedSprint?: string;
    onSprintChange?: (sprintId: string) => void;
}

const Conversation: React.FC<ConversationProps> = ({
    type,
    channelName = "Channel name",
    initialMessages = [],
    onSendMessage,
    isLoading = false,
    sprintSelection = [],
    selectedSprint,
    onSprintChange,
}) => {
    const [messages, setMessages] = useState<IMessage[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSprintMenuOpen, setIsSprintMenuOpen] = useState(false);

    // Add sample messages if none provided
    useEffect(() => {
        if (initialMessages.length === 0) {
            setMessages([
                {
                    id: "1",
                    content:
                        "We receive your requirements well, let me revise again that you want ... details ... on A page?",
                    sender: "ai",
                    timestamp: new Date(Date.now() - 1000 * 60 * 5),
                    user: {
                        name: "Project Manager",
                        avatar: "/images/pm-avatar.png",
                    },
                },
                {
                    id: "2",
                    content:
                        "Project manager is waiting for your confirmation (sent to user_email@gmail.com)",
                    sender: "system",
                    timestamp: new Date(Date.now() - 1000 * 60 * 4),
                },
                {
                    id: "3",
                    content: "Hi, sorry for late reply",
                    sender: "user",
                    timestamp: new Date(Date.now() - 1000 * 60 * 3),
                    user: {
                        name: "User A",
                    },
                },
                {
                    id: "4",
                    content:
                        "Yes, I want feature A to implement on section B of A Page",
                    sender: "user",
                    timestamp: new Date(Date.now() - 1000 * 60 * 3),
                    user: {
                        name: "User A",
                    },
                },
                {
                    id: "5",
                    content: "Please continue",
                    sender: "user",
                    timestamp: new Date(Date.now() - 1000 * 60 * 3),
                    user: {
                        name: "User A",
                    },
                },
            ]);
        } else {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim() === "") return;

        const newMessage: IMessage = {
            id: Date.now().toString(),
            content: inputValue,
            sender: "user",
            timestamp: new Date(),
            user: {
                name: "User A",
            },
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");

        if (onSendMessage) {
            onSendMessage(inputValue);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card className="flex flex-col w-full h-full bg-[#1a1d21] border-0 rounded-lg overflow-hidden shadow-lg">
            {/* Channel Header */}
            <CardHeader className="flex flex-row items-center justify-between px-4 py-2 bg-[#222529] border-b border-[#383838]">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <p className=" text-gray-400">
                        <span className="text-gray-300 text-sm">
                            {getFirstCharacterUppercase(type)}:
                        </span>{" "}
                        <span className="text-white">{channelName}</span>
                    </p>

                    {sprintSelection.length > 0 && (
                        <div className="relative ml-4">
                            <div
                                className="flex items-center gap-1 bg-[#252a2e] hover:bg-[#2c3235] py-1 px-3 rounded-md cursor-pointer text-sm font-normal"
                                onClick={() =>
                                    setIsSprintMenuOpen(!isSprintMenuOpen)
                                }
                            >
                                Sprint selection
                                <ChevronDown size={16} />
                            </div>

                            {isSprintMenuOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-[#252a2e] rounded-md shadow-lg z-10 min-w-[200px]">
                                    {sprintSelection.map((sprint) => (
                                        <div
                                            key={sprint.id}
                                            className={`py-2 px-3 cursor-pointer hover:bg-[#2c3235] text-sm ${selectedSprint === sprint.id ? "bg-[#1e62d0] text-white" : "text-gray-300"}`}
                                            onClick={() => {
                                                if (onSprintChange)
                                                    onSprintChange(sprint.id);
                                                setIsSprintMenuOpen(false);
                                            }}
                                        >
                                            {sprint.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardTitle>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                    >
                        <Info size={20} />
                    </Button>
                </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-grow p-0 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-200px)] w-full conversation-scrollarea">
                    <div className="flex flex-col p-4 gap-4">
                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`group conversation-message ${index === messages.length - 1 ? "message-new" : ""}`}
                            >
                                {message.sender === "system" ? (
                                    // System Message
                                    <div className="flex justify-center my-2">
                                        <div className="bg-[#252a2e] text-gray-400 text-xs py-1 px-3 rounded-md">
                                            {message.content}
                                        </div>
                                    </div>
                                ) : (
                                    // User or AI Message
                                    <div className="flex items-start gap-3 group p-2 rounded-md">
                                        <Avatar
                                            className={`h-9 w-9 rounded-md border ${message.sender === "ai" ? "bg-blue-600 border-blue-700" : "bg-orange-600 border-orange-700"}`}
                                        >
                                            {message.sender === "ai" ? (
                                                <Image
                                                    src={GenesoftLogo}
                                                    alt="Genesoft Logo"
                                                    width={36}
                                                    height={36}
                                                />
                                            ) : message.user?.avatar ? (
                                                <img
                                                    src={message.user.avatar}
                                                    alt={message.user.name}
                                                    width={36}
                                                    height={36}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full w-full text-white font-semibold">
                                                    {message.user?.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-baseline">
                                                <span
                                                    className={`font-semibold text-sm ${message.sender === "ai" ? "text-blue-400" : "text-orange-400"}`}
                                                >
                                                    {message.user?.name}
                                                </span>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {formatTime(
                                                        message.timestamp,
                                                    )}
                                                </span>
                                            </div>

                                            <div className="mt-1 text-white text-sm">
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <CardFooter className="p-3 bg-[#222529] border-t border-[#383838]">
                <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-2 w-full bg-[#2b2d31] rounded-md p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white"
                        >
                            <Paperclip size={20} />
                        </Button>

                        <Textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Message #channel-name"
                            className="min-h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-white conversation-textarea"
                        />

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white"
                            >
                                <Smile size={20} />
                            </Button>

                            <Button
                                onClick={handleSendMessage}
                                disabled={inputValue.trim() === "" || isLoading}
                                className={`rounded-md conversation-send-button ${inputValue.trim() === "" ? "bg-[#4b4b4b] text-gray-400" : "bg-[#1e62d0] hover:bg-[#1a56b8] text-white"}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin conversation-loading"></div>
                                ) : (
                                    <Send size={16} />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="px-2 text-xs text-gray-500">
                        Start Sprint will trigger software development team to
                        start develop web application based on latest messages
                        you talked with Project Manager on this conversation
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default Conversation;
