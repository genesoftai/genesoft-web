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
import { Send, Loader2, BrainCircuit, Image as ImageIcon } from "lucide-react";
import { Message } from "@/types/message";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import {
    CreateMessageDto,
    submitConversation,
    talkToWebAiAgents,
} from "@/actions/conversation";
import { useProjectStore } from "@/stores/project-store";
import SystemMessage from "./message/SystemMessage";
import AIAgentMessage from "./message/AIAgentMessage";
import UserMessage from "./message/UserMessage";
import { uploadFileFree } from "@/actions/file";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    checkBuildErrors,
    getLatestIteration,
    getMonthlySprintsWithSubscription,
} from "@/actions/development";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { getOrganizationById } from "@/actions/organization";
import { SubscriptionLookupKey } from "@/constants/subscription";
import { useRouter } from "next/navigation";
import { nextAppBaseUrl } from "@/constants/web";
import { MonthlySprint } from "@/types/subscription";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LatestIteration } from "@/types/development";
import { getWebApplicationInfo } from "@/actions/web-application";
import { toast } from "@/hooks/use-toast";
import posthog from "posthog-js";
import GenesoftLoading from "../common/GenesoftLoading";
import NextJSLogo from "@public/tech/nextjs.jpeg";
import Image from "next/image";
import { Project } from "@/types/project";

export type SprintOption = {
    id: string;
    name: string;
    status: string;
};

export interface ConversationProps {
    initialMessages?: Message[];
    onSendMessage?: (message: string) => void;
    isLoading?: boolean;
    conversationId: string;
    onSubmitConversation?: () => Promise<void>;
    status: string;
    featureId?: string;
    pageId?: string;
    isOnboarding?: boolean;
    onSendImageWithMessage?: (messages: Message[]) => Promise<void>;
    project: Project;
}

const Conversation: React.FC<ConversationProps> = ({
    conversationId,
    initialMessages = [],
    isLoading = false,
    onSubmitConversation,
    status,
    onSendImageWithMessage,
    project,
}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { id: userId } = useGenesoftUserStore();
    const [isLoadingSendMessage, setIsLoadingSendMessage] =
        useState<boolean>(false);
    const [isLoadingSubmitConversation, setIsLoadingSubmitConversation] =
        useState<boolean>(false);
    const [errorStartSprint, setErrorStartSprint] = useState<string>("");
    const [imageUploadUrl, setImageUploadUrl] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isImageMessageDialogOpen, setIsImageMessageDialogOpen] =
        useState<boolean>(false);
    const [imageMessage, setImageMessage] = useState<string>("");
    const [fileId, setFileId] = useState<string>("");
    const [isSendingImageWithMessage, setIsSendingImageWithMessage] =
        useState<boolean>(false);
    const [monthlySprints, setMonthlySprints] = useState<MonthlySprint>({
        iterations: [],
        count: 0,
        exceeded: false,
        tier: "",
        remaining: 0,
    });
    const [latestIteration, setLatestIteration] =
        useState<LatestIteration | null>(null);
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);
    const [isCheckingBuildErrors, setIsCheckingBuildErrors] =
        useState<boolean>(false);

    const { id: organizationId } = useGenesoftOrganizationStore();
    const router = useRouter();

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
            setupMonthlySprints();
        }
    }, [initialMessages]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        const newMessage: CreateMessageDto = {
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
            const result = await talkToWebAiAgents({
                project_id: projectId,
                conversation_id: conversationId,
                message: newMessage,
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
        let status = "error";

        setErrorStartSprint("");
        setIsLoadingSubmitConversation(true);
        if (monthlySprints?.remaining < 1) {
            handleSubscription();
            return;
        }
        try {
            await submitConversation(conversationId);
            setupMonthlySprints();
            status = "submitted";
        } catch (error) {
            if (
                error instanceof Error &&
                error?.message ===
                    "You have exceeded the maximum number of sprints for free tier. Please upgrade to a startup plan to continue."
            ) {
                status = "error";
                setErrorStartSprint(
                    "You have exceeded the maximum number of sprints for free tier. Please upgrade to a startup plan to continue.",
                );
            } else {
                status = "error";
                console.error("Error submitting conversation:", error);
                setErrorStartSprint(
                    "Something went wrong, Please try again later or contact support@genesoftai.com",
                );
            }
        } finally {
            setIsLoadingSubmitConversation(false);
            if (onSubmitConversation && status === "submitted") {
                onSubmitConversation();
            }
        }
    };

    // File upload handler
    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const timestamp = new Date().getTime();
            const fileName = `${conversationId}-${timestamp}`;
            const description = `Image for conversation ${conversationId}`;

            const res = await uploadFileFree(
                "conversation",
                fileName,
                description,
                "image",
                file,
            );

            if (res.error) {
                toast({
                    title: "Error uploading image",
                    description: res.error,
                    variant: "destructive",
                });
                return;
            }

            setImageUploadUrl(res.url);
            setFileId(res.id);
            // Open the image message dialog after successful upload
            setIsImageMessageDialogOpen(true);
        } catch (err) {
            toast({
                title: "Error uploading image",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
            });
            console.error(err);
        }
    };

    // Handle sending image with message
    const handleSendImageWithMessage = async () => {
        if (!imageUploadUrl) return;

        const newMessage: CreateMessageDto = {
            content: imageMessage,
            sender_type: "user",
            message_type: "image",
            sender_id: userId,
            file_ids: [fileId],
        };

        setIsSendingImageWithMessage(true);
        let updatedMessages: Message[] = [];
        try {
            const tempMessage: Message = {
                id: "temp-message-id",
                content: imageMessage,
                sender_type: "user",
                message_type: "image",
                sender_id: userId,
                file_ids: [fileId],
                created_at: new Date(),
                updated_at: new Date(),
                conversation_id: conversationId,
                image_url: imageUploadUrl,
                sender: {
                    name: userName || "",
                    image: userImage || undefined,
                    email: userEmail || "",
                },
            };
            setMessages([...messages, tempMessage]);

            const result = await talkToWebAiAgents({
                project_id: projectId,
                conversation_id: conversationId,
                message: newMessage,
            });
            updatedMessages = result?.messages;
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsSendingImageWithMessage(false);
            setIsImageMessageDialogOpen(false);
            setImageMessage("");
            setImageUploadUrl("");
            setMessages(updatedMessages);
            if (onSendImageWithMessage) {
                onSendImageWithMessage(updatedMessages);
            }
        }
    };

    // Handle cancel image message
    const handleCancelImageMessage = () => {
        setImageMessage("");
        setImageUploadUrl("");
        setIsImageMessageDialogOpen(false);
    };

    // Auto scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesEndRef]);

    // Add this function to handle image preview
    const handleImagePreview = (imageUrl: string) => {
        console.log("Opening image preview:", imageUrl);
        setPreviewImage(imageUrl);
    };

    useEffect(() => {
        setupMonthlySprints();
    }, []);

    const setupMonthlySprints = async () => {
        const response =
            await getMonthlySprintsWithSubscription(organizationId);
        if (response) {
            setMonthlySprints(response);
            if (response.remaining === 0) {
                setErrorStartSprint(
                    "You have exceeded the maximum number of sprints for free tier. Please upgrade to a startup plan to continue.",
                );
            }
        }
    };

    const handleFixErrors = async () => {
        posthog.capture("click_fix_errors_from_manage_project_web_preview");
        if (!projectId) {
            toast({
                title: "Project ID is required",
                description: "Please select a project",
            });
            return;
        }
        setIsCheckingBuildErrors(true);

        try {
            await checkBuildErrors(projectId);
            toast({
                title: "Genesoft software development AI Agent team working on fixing errors of your web application to help you deploy latest version",
                description:
                    "Please waiting for email notification when errors are fixed",
                duration: 10000,
            });
        } catch (error) {
            console.error("Error checking build errors:", error);
            toast({
                title: "Failed to check build errors",
                description: "Please try again",
                variant: "destructive",
                duration: 10000,
            });
        } finally {
            setIsCheckingBuildErrors(false);
        }
    };

    // Kept for future subscription management functionality
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSubscription = async () => {
        const organization = await getOrganizationById(organizationId);

        console.log({
            message: "Organization",
            organization,
        });

        if (organization.customer_id) {
            const response = await fetch(
                `${nextAppBaseUrl}/api/stripe/create-portal-session`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        customer_id: organization.customer_id,
                    }),
                },
            );
            const data = await response.json();
            router.push(data.url);
        } else {
            const response = await fetch(
                `${nextAppBaseUrl}/api/stripe/create-checkout-session`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        customer_email: userEmail,
                        lookup_key: SubscriptionLookupKey.Startup,
                        organization_id: organizationId,
                        organization_name: organization.name,
                    }),
                },
            );
            const data = await response.json();
            console.log({ message: "Stripe checkout session", data });
            router.push(data.url);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (projectId) {
            // Initial fetch
            fetchLatestData();

            // Set up polling every 10 seconds
            interval = setInterval(fetchLatestData, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [projectId]);

    const fetchLatestData = async () => {
        if (!projectId) return;

        try {
            const iterationInfo = await getLatestIteration(projectId);
            const latestWebApplicationInfo =
                await getWebApplicationInfo(projectId);

            setLatestIteration(iterationInfo);
            setWebApplicationInfo(latestWebApplicationInfo);
        } catch (error) {
            console.error("Error fetching latest data:", error);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-[70vh] h-full">
            <Card className="flex flex-col w-full h-full min-h-[70vh] sm:h-4/12 bg-[#1a1d21] border-0 rounded-lg overflow-hidden shadow-lg">
                {/* Channel Header */}
                <CardHeader className="flex flex-row items-center justify-between px-4 py-2 bg-[#222529] border-b border-[#383838]">
                    <CardTitle className="text-lg font-semibold text-white flex items-center gap-2 justify-between w-full">
                        <div
                            className={`flex justify-between items-center gap-3 rounded-lg relative z-0 w-full`}
                        >
                            <div className="flex flex-col gap-1 w-fit">
                                {/* <div className="flex items-center justify-center bg-gradient-to-r from-[#2a2d32] to-[#1e2124] px-3 py-1.5 rounded-full shadow-inner">
                                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1.5">
                                        <CircleCheck
                                            size={12}
                                            className="text-blue-400"
                                        />
                                        Generations:
                                        <span className="text-white font-semibold">
                                            {monthlySprints?.count || 0}
                                        </span>
                                        <span className="text-gray-500">/</span>
                                        <span className="text-white font-semibold">
                                            {(monthlySprints?.count || 0) +
                                                (monthlySprints?.remaining ||
                                                    0)}
                                        </span>
                                    </span>
                                </div> */}

                                {errorStartSprint && (
                                    <div className="px-2 py-1 text-xs text-red-400 bg-red-500/10 rounded-md w-full flex flex-col gap-2">
                                        <span className="text-red-400">
                                            {errorStartSprint}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-start gap-2">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={NextJSLogo}
                                        alt="Web Application"
                                        width={20}
                                        height={20}
                                        className="rounded-md"
                                    />
                                    <span className="text-xs font-medium text-gray-400">
                                        {"Web"}
                                    </span>
                                </div>

                                <span className="text-sm text-white font-bold">
                                    {project?.name}
                                </span>
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`bg-[#1e62d0] text-white hover:bg-[#1a56b8] hover:text-white w-fit h-10 rounded-md shadow-md transition-all duration-200 flex items-center gap-2 ${
                                                latestIteration?.status !==
                                                    "done" &&
                                                "bg-gray-500 cursor-not-allowed"
                                            }`}
                                            onClick={handleSubmitConversation}
                                            disabled={
                                                isLoadingSubmitConversation ||
                                                latestIteration?.status !==
                                                    "done"
                                            }
                                        >
                                            <span className="text-xs font-medium">
                                                {isLoadingSubmitConversation
                                                    ? "Executing..."
                                                    : "Execute"}
                                            </span>
                                            {isLoadingSubmitConversation ? (
                                                <Loader2 className="h-4 w-4 animate-spin ml-1" />
                                            ) : (
                                                <BrainCircuit className="h-4 w-4 ml-1" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            This will trigger AI Agent to build
                                            your web app based on latest
                                            conversation between you and
                                            Genesoft Project Manager AI Agent
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardTitle>
                </CardHeader>

                {/* Messages Area */}
                {!isLoading ? (
                    <CardContent className="flex-grow p-0 overflow-hidden h-[60vh] md:h-[calc(100vh-280px)]">
                        <ScrollArea
                            className="h-full w-full conversation-scrollarea overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                            scrollHideDelay={0}
                        >
                            <div className="flex flex-col p-4 gap-4 pb-4 h-full">
                                {/* {webApplicationInfo?.readyStatus && (
                                    <DeploymentStatus
                                        webApplicationInfo={
                                            webApplicationInfo as WebApplicationInfo
                                        }
                                        handleFixErrors={handleFixErrors}
                                        isCheckingBuildErrors={
                                            isCheckingBuildErrors
                                        }
                                        projectId={projectId}
                                        latestIteration={
                                            latestIteration as LatestIteration
                                        }
                                    />
                                )} */}

                                {messages.map((message, index) => (
                                    <div
                                        key={message.id}
                                        className={`group max-w-[500px] w-full overflow-hidden px-4 ${
                                            index === messages.length - 1
                                                ? "message-new"
                                                : ""
                                        }`}
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
                                                status={status}
                                                sender_id={
                                                    message.sender_id || ""
                                                }
                                            />
                                        )}
                                    </div>
                                ))}

                                {isLoadingSendMessage && (
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-[#252a2e] text-gray-400 text-xs py-1 px-3 rounded-md flex items-center gap-2 animate-pulse">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            AI Agents are thinking...
                                        </div>
                                    </div>
                                )}

                                {/* {latestIteration?.status === "done" &&
                                    webApplicationInfo?.readyStatus ===
                                        ReadyStatus.ERROR &&
                                    (!webApplicationInfo?.repositoryBuild
                                        ?.fix_triggered ||
                                        webApplicationInfo?.repositoryBuild
                                            ?.status === "done") && (
                                        <div className="flex flex-col items-center justify-center p-4 bg-white text-black rounded-md">
                                            <p className="text-lg font-semibold text-red-500">
                                                Deployment Failed
                                            </p>
                                            <p className="text-sm">
                                                There was an error during
                                                deployment. Please click fix
                                                errors to inform Genesoft
                                                software development AI Agent
                                                team to fix it.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="mt-2 text-white border-white bg-red-500 hover:bg-red-600 hover:text-white"
                                                onClick={handleFixErrors}
                                            >
                                                {isCheckingBuildErrors
                                                    ? "Fixing errors..."
                                                    : "Fix Errors"}
                                                {isCheckingBuildErrors && (
                                                    <Loader2 className="h-4 w-4 animate-spin ml-1 text-white" />
                                                )}
                                            </Button>
                                        </div>
                                    )} */}
                            </div>
                            <style jsx global>{`
                                .conversation-scrollarea pre,
                                .conversation-scrollarea code {
                                    white-space: pre-wrap;
                                    word-break: break-word;
                                    overflow-wrap: break-word;
                                    max-width: 100%;
                                    overflow-x: auto;
                                }

                                .conversation-scrollarea p,
                                .conversation-scrollarea div,
                                .conversation-scrollarea span {
                                    max-width: 100%;
                                    overflow-wrap: break-word;
                                    word-wrap: break-word;
                                }

                                .conversation-scrollarea img {
                                    max-width: 100%;
                                    height: auto;
                                    display: block;
                                }

                                .conversation-scrollarea table {
                                    display: block;
                                    overflow-x: auto;
                                    max-width: 100%;
                                }
                            `}</style>
                        </ScrollArea>
                    </CardContent>
                ) : (
                    <CardContent className="flex p-0 overflow-hidden h-full">
                        <ScrollArea className="h-[60vh] md:h-[calc(100vh-280px)] w-full conversation-scrollarea">
                            <div className="flex flex-col p-4 gap-3">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-[calc(100vh-350px)]">
                                        {/* <div className="relative w-20 h-20 mb-4">
                                            <div className="absolute inset-0 bg-genesoft/10 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                            <div className="absolute inset-2 bg-genesoft/20 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
                                            <div className="absolute inset-4 bg-genesoft/30 rounded-full animate-[spin_5s_linear_infinite]"></div>
                                            <div className="absolute inset-6 bg-genesoft/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                            <div className="absolute inset-8 bg-genesoft flex items-center justify-center rounded-full animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div> */}
                                        <GenesoftLoading />
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
                    <CardFooter className="flex flex-col items-center justify-between p-1 bg-[#222529] border-t border-[#383838] h-fit z-10">
                        {imageUploadUrl && (
                            <div className="w-full mb-2 px-2 flex items-start gap-2 z-10 relative">
                                <img
                                    src={imageUploadUrl}
                                    alt="Upload preview"
                                    className="h-20 w-20 object-cover rounded-md hover:opacity-90 transition-opacity block"
                                    onClick={() =>
                                        handleImagePreview(imageUploadUrl)
                                    }
                                    style={{
                                        display: "block",
                                        maxWidth: "100%",
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex flex-col w-full gap-2 h-fit">
                            <div className="flex flex-col w-full bg-[#2b2d31] rounded-md p-1 h-fit">
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image-upload"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-gray-300"
                                        onClick={() => {
                                            document
                                                .getElementById("image-upload")
                                                ?.click();
                                        }}
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                    <Textarea
                                        value={inputValue}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                        placeholder="Send a message to your own software development team..."
                                        className="text-xs md:text-sm min-h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-white conversation-textarea w-full"
                                    />

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
                        </div>
                    </CardFooter>
                )}
            </Card>

            {/* Image Preview Dialog */}
            <Dialog
                open={!!previewImage}
                onOpenChange={(open) => {
                    if (!open) setPreviewImage(null);
                }}
            >
                <DialogContent className="max-w-4xl bg-transparent border-0">
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-auto max-h-[80vh] object-contain"
                            style={{ display: "block", maxWidth: "100%" }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Message Dialog */}
            <AlertDialog
                open={isImageMessageDialogOpen}
                onOpenChange={setIsImageMessageDialogOpen}
            >
                <AlertDialogContent className="bg-primary-dark border-line-in-dark-bg text-white max-w-[90%] md:max-w-[620px] rounded-lg flex flex-col">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Add a message to your image
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-subtext-in-dark-bg">
                            Your image has been uploaded. Would you like to add
                            a message to go with it?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {imageUploadUrl && (
                        <div className="w-full mb-2 px-2 flex items-center justify-center gap-2 z-10 relative self-center">
                            <img
                                src={imageUploadUrl}
                                alt="Upload preview"
                                className="max-h-60 max-w-full object-contain rounded-md hover:opacity-90 transition-opacity block"
                            />
                        </div>
                    )}

                    <div className="my-4">
                        <Textarea
                            value={imageMessage}
                            onChange={(e) => setImageMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="min-h-[100px] border-tertiary-dark bg-neutral-700 text-white placeholder:text-neutral-400"
                            disabled={isSendingImageWithMessage}
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="bg-secondary-dark text-white border-line-in-dark-bg hover:bg-secondary-dark/80 hover:text-white"
                            onClick={handleCancelImageMessage}
                            disabled={isSendingImageWithMessage}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            onClick={handleSendImageWithMessage}
                            className="bg-genesoft text-white hover:bg-genesoft/80 flex items-center gap-2"
                            disabled={isSendingImageWithMessage}
                        >
                            {isSendingImageWithMessage
                                ? "AI Agent thinking..."
                                : "Send"}
                            {isSendingImageWithMessage && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Conversation;
