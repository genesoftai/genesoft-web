import React, { useState, useRef, useEffect } from "react";
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
import {
    Send,
    ChevronDown,
    Loader2,
    CircleCheck,
    MessageCircleMore,
} from "lucide-react";
import { Message } from "@/types/message";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import {
    submitConversation,
    talkToProjectManager,
} from "@/actions/conversation";
import { useProjectStore } from "@/stores/project-store";
import SystemMessage from "./message/SystemMessage";
import AIAgentMessage from "./message/AIAgentMessage";
import UserMessage from "./message/UserMessage";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type SprintOption = {
    id: string;
    name: string;
    status: string;
};

export interface ConversationProps {
    type: string;
    channelName?: string;
    channelDescription?: string;
    initialMessages?: Message[];
    onSendMessage?: (message: string) => void;
    isLoading?: boolean;
    sprintOptions?: SprintOption[];
    selectedSprint?: string;
    onSprintChange?: (sprintId: string) => void;
    conversationId: string;
    onSubmitConversation?: () => Promise<void>;
    status: string;
    featureId?: string;
    pageId?: string;
}

const Conversation: React.FC<ConversationProps> = ({
    type,
    channelName = "Channel name",
    channelDescription = "Channel description",
    conversationId,
    initialMessages = [],
    isLoading = false,
    sprintOptions = [],
    selectedSprint,
    onSprintChange,
    onSubmitConversation,
    status,
    featureId,
    pageId,
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSprintMenuOpen, setIsSprintMenuOpen] = useState(false);
    const { id: userId } = useGenesoftUserStore();
    const [isLoadingSendMessage, setIsLoadingSendMessage] =
        useState<boolean>(false);
    const [isLoadingSubmitConversation, setIsLoadingSubmitConversation] =
        useState<boolean>(false);
    const [errorStartSprint, setErrorStartSprint] = useState<string>("");
    const [sprintName, setSprintName] = useState<string>("");

    const { id: projectId } = useProjectStore();
    const {
        image: userImage,
        name: userName,
        email: userEmail,
    } = useGenesoftUserStore();

    // Add sample messages if none provided
    useEffect(() => {
        if (initialMessages.length > 0) {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        const newMessage: Partial<Message> = {
            content: inputValue,
            sender_type: "user",
            message_type: "text",
            sender_id: userId,
        };

        setIsLoadingSendMessage(true);
        let updatedMessages: Message[] = [];
        try {
            const tempMessage: Message = {
                id: "temp-message-id",
                content: inputValue,
                sender_type: "user",
                message_type: "text",
                sender_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
                conversation_id: conversationId,
                sender: {
                    name: userName || "",
                    image: userImage || undefined,
                    email: userEmail || "",
                },
            };
            setMessages([...messages, tempMessage]);

            setInputValue("");
            const result = await talkToProjectManager({
                project_id: projectId,
                conversation_id: conversationId,
                message: newMessage,
                feature_id: featureId,
                page_id: pageId,
            });
            updatedMessages = result?.messages;
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoadingSendMessage(false);
        }

        setInputValue("");
        setMessages(updatedMessages);
    };

    const handleSubmitConversation = async () => {
        if (sprintName.trim() === "") {
            setErrorStartSprint("Please enter a sprint name");
            return;
        }

        setErrorStartSprint("");
        setIsLoadingSubmitConversation(true);
        try {
            await submitConversation(conversationId, sprintName);
        } catch (error) {
            console.error("Error submitting conversation:", error);
            setErrorStartSprint(
                "Something went wrong, Please try again later or contact support@genesoftai.com",
            );
        } finally {
            setIsLoadingSubmitConversation(false);
            if (onSubmitConversation) {
                onSubmitConversation();
            }
        }
    };

    console.log({
        message: "Conversation: basic info",
        conversationId,
        isLoadingSendMessage,
        isLoadingSubmitConversation,
        errorStartSprint,
        sprintOptions,
        selectedSprint,
        status,
    });

    return (
        <Card className="flex flex-col w-full max-h-[120vh] h-full sm:h-4/12 bg-[#1a1d21] border-0 rounded-lg overflow-hidden shadow-lg overflow-y-auto">
            {/* Channel Header */}
            <CardHeader className="flex flex-row items-center justify-between px-4 py-2 bg-[#222529] border-b border-[#383838]">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2 justify-between w-full">
                    {/* <div className="flex flex-col gap-1 w-6/12">
                        <p className=" text-white">{channelName}</p>
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full text-gray-400 text-xs border-none"
                        >
                            <AccordionItem value="item-1 border-none py-0">
                                <AccordionTrigger className="text-white border-none">
                                    {"Description"}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-xs border-none">
                                    {channelDescription}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div> */}

                    {sprintOptions.length > 0 && (
                        <div className="relative min-w-[100px]">
                            <p className="text-gray-400 text-xs">
                                Select sprint
                            </p>
                            <div
                                className="flex items-center gap-1 bg-[#252a2e] hover:bg-[#2c3235] py-1 px-3 rounded-md cursor-pointer text-sm font-normal"
                                onClick={() =>
                                    setIsSprintMenuOpen(!isSprintMenuOpen)
                                }
                            >
                                {status === "submitted" ? (
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
                                <span className="text-white">
                                    {
                                        sprintOptions.find(
                                            (sprint) =>
                                                sprint.id === selectedSprint,
                                        )?.name
                                    }
                                </span>
                                <ChevronDown size={16} />
                            </div>

                            {isSprintMenuOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-[#252a2e] rounded-md shadow-lg z-10 min-w-[200px]">
                                    {sprintOptions.map((sprint) => (
                                        <div
                                            key={sprint.id}
                                            className={`py-2 px-3 cursor-pointer hover:bg-[#2c3235] text-sm ${selectedSprint === sprint.id ? "bg-[#1e62d0] text-white" : "text-gray-300"} flex items-center gap-2`}
                                            onClick={() => {
                                                if (onSprintChange) {
                                                    setMessages([]);
                                                    onSprintChange(sprint.id);
                                                }
                                                setIsSprintMenuOpen(false);
                                            }}
                                        >
                                            {sprint?.status === "submitted" ? (
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
                                            <span>{sprint.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardTitle>
            </CardHeader>

            {/* Messages Area */}
            {!isLoading ? (
                <CardContent className="flex-grow p-0 overflow-hidden h-full">
                    <ScrollArea
                        className="min-h-[60vh] h-[80vh] md:min-h-[40vh] w-full conversation-scrollarea overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                        scrollHideDelay={0}
                    >
                        <div className="flex flex-col p-4 gap-4 pb-0 h-full">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`group ${index === messages.length - 1 ? "message-new" : ""}`}
                                >
                                    {message.sender_type === "system" ? (
                                        <SystemMessage message={message} />
                                    ) : message.sender_type === "user" ? (
                                        <UserMessage message={message} />
                                    ) : (
                                        <AIAgentMessage message={message} />
                                    )}
                                </div>
                            ))}
                            <div className="h-0" />

                            {isLoadingSendMessage && (
                                <div className="flex justify-center mb-4">
                                    <div className="bg-[#252a2e] text-gray-400 text-xs py-1 px-3 rounded-md flex items-center gap-2 animate-pulse">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Project Manager is thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            ) : (
                <CardContent className="flex-grow p-0 overflow-hidden h-full">
                    <ScrollArea className="h-[60vh] md:h-[calc(100vh-280px)] w-full conversation-scrollarea">
                        <div className="flex flex-col p-4 gap-3">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-[calc(100vh-350px)]">
                                    <div className="relative w-20 h-20 mb-4">
                                        <div className="absolute inset-0 bg-genesoft/10 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                        <div className="absolute inset-2 bg-genesoft/20 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
                                        <div className="absolute inset-4 bg-genesoft/30 rounded-full animate-[spin_5s_linear_infinite]"></div>
                                        <div className="absolute inset-6 bg-genesoft/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                        <div className="absolute inset-8 bg-genesoft flex items-center justify-center rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm relative overflow-hidden group">
                                        <span className="inline-block animate-[fadeIn_1s_ease-in-out_forwards]">
                                            Loading conversation ...
                                        </span>
                                    </p>
                                </div>
                            )}

                            {isLoadingSendMessage && (
                                <div className="flex items-start gap-3 p-2 animate-fadeIn">
                                    <div className="h-9 w-9 rounded-md bg-genesoft/20 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_infinite]"></div>
                                        <div className="typing-indicator">
                                            <span className="animate-[scaleUp_1s_infinite_0.1s]"></span>
                                            <span className="animate-[scaleUp_1s_infinite_0.2s]"></span>
                                            <span className="animate-[scaleUp_1s_infinite_0.3s]"></span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-4 w-2/3 bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded animate-[shimmer_2s_infinite] mb-2"></div>
                                        <div className="h-4 w-1/2 bg-gradient-to-r from-gray-700/40 via-gray-600/40 to-gray-700/40 rounded animate-[shimmer_2s_infinite_0.5s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            )}

            {/* Input Area */}
            {status !== "submitted" && (
                <CardFooter className="flex items-center justify-between p-3 bg-[#222529] border-t border-[#383838]">
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center gap-2 w-full bg-[#2b2d31] rounded-md p-1">
                            {/* <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400"
                            >
                                <Paperclip size={20} />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400"
                            >
                                <Link size={20} />
                            </Button> */}

                            <Textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={
                                    "Send a message to your own software development team..."
                                }
                                className="text-xs md:text-sm min-h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-white conversation-textarea"
                            />

                            <div className="flex items-center gap-1">
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={
                                        inputValue.trim() === "" ||
                                        isLoadingSendMessage
                                    }
                                    className={`rounded-md conversation-send-button ${inputValue.trim() === "" ? "bg-[#4b4b4b] text-gray-400" : "bg-[#1e62d0] hover:bg-[#1a56b8] text-white"}`}
                                >
                                    {isLoadingSendMessage ? (
                                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-t-transparent border-white rounded-full animate-spin conversation-loading"></div>
                                    ) : (
                                        <Send size={16} />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 mt-2 bg-[#1e2124] p-3 rounded-lg border border-[#383838]/50">
                            <div className="flex flex-col md:flex-row items-center md:gap-4 w-full justify-between">
                                <div className="flex flex-col gap-1.5 w-full">
                                    <Label className="text-gray-300 text-xs font-medium">
                                        Sprint name
                                    </Label>
                                    <Input
                                        value={sprintName}
                                        onChange={(e) =>
                                            setSprintName(e.target.value)
                                        }
                                        placeholder="Enter sprint name to help you remember conversation ..."
                                        className="text-xs md:text-sm w-full bg-[#2b2d31] border-[#383838] focus:border-[#1e62d0] text-white placeholder:text-gray-500 transition-colors"
                                    />
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-[#1e62d0] text-white hover:bg-[#1a56b8] hover:text-white w-fit h-10 px-4 rounded-md shadow-md transition-all duration-200 flex items-center gap-2 mt-6"
                                    onClick={handleSubmitConversation}
                                    disabled={isLoadingSubmitConversation}
                                >
                                    <span className="text-xs md:text-sm font-medium">
                                        {isLoadingSubmitConversation
                                            ? "Starting Sprint..."
                                            : "Start Sprint"}
                                    </span>
                                    {isLoadingSubmitConversation ? (
                                        <Loader2 className="h-4 w-4 animate-spin ml-1" />
                                    ) : (
                                        <CircleCheck className="h-4 w-4 ml-1" />
                                    )}
                                </Button>
                            </div>

                            {errorStartSprint ? (
                                <div className="px-2 py-1 text-sm text-red-400 bg-red-500/10 rounded-md w-full">
                                    {errorStartSprint}
                                </div>
                            ) : (
                                <div className="px-2 py-1 text-xs md:text-sm text-gray-400 italic w-full">
                                    {isLoadingSubmitConversation
                                        ? "Genesoft Project Manager is summarizing and submitting tasks to the development team..."
                                        : "Submit the conversation to the software development team to begin implementation"}
                                </div>
                            )}
                        </div>
                    </div>
                </CardFooter>
            )}

            {status === "submitted" && (
                <CardFooter className="flex items-center justify-between p-3 bg-[#222529] border-t border-[#383838]">
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex items-center gap-2 w-full bg-[#2b2d31] rounded-md p-1">
                            <p className="text-gray-400 text-xs">
                                {
                                    "This conversation has been submitted to the development team. If you need to talk to Genesoft Project Manager, please talk on next sprint conversation."
                                }
                            </p>
                        </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default Conversation;
