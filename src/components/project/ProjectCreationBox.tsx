"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Loader2,
    MessageSquare,
    Server,
    AppWindow,
    Send,
    ImageIcon,
    X,
    AlertCircleIcon,
} from "lucide-react";
import { rgbaToHex } from "@/utils/common/color";
import { RGBColor } from "react-color";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import Image from "next/image";
import NextJSLogo from "@public/tech/nextjs.jpeg";
import NestJSLogo from "@public/tech/nestjs.svg";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { uploadFileFree } from "@/actions/file";
import { toast } from "sonner";
import { useOnboardingConversationStore } from "@/stores/onboarding-conversation-store";
import {
    CreateMessageDto,
    createOnboardingConversation,
    getOnboardingConversationById,
    talkWithAiAgents,
} from "@/actions/onboarding_conversation";
import { Message } from "@/types/message";
import AIAgentMessage from "../conversation/message/AIAgentMessage";
import SystemMessage from "../conversation/message/SystemMessage";
import OnboardingUserMessage from "../conversation/message/OnboardingUserMessage";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import FigmaLogo from "@public/brand/figma.svg";
import { getFigmaFile } from "@/actions/figma";
import { extractFigmaChildren, get_figma_file_key } from "@/utils/figma/file";
import { createSupabaseClient } from "@/utils/supabase/client";
import GithubImportModal from "./GithubImportModal";

interface ProjectCreationBoxProps {
    onComplete: (projectData: {
        description: string;
        logo?: string;
        color?: string;
        project_type: string;
        backend_requirements?: string;
        onboarding_conversation_id?: string;
        figma_file_key?: string;
        github_installation_id?: string;
        github_repo_owner?: string;
        github_repo_name?: string;
        github_repo_fullname?: string;
        github_repository_id?: string;
    }) => void;
    initialValues?: {
        description?: string;
        logo?: string;
        color?: string;
        project_type?: string;
    };
}

const ProjectCreationBox = ({ onComplete }: ProjectCreationBoxProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const brandColor: RGBColor = { r: 75, g: 107, b: 251, a: 1 }; // Default genesoft-like color
    const [checkWeb, setCheckWeb] = useState(true);
    const [checkBackend, setCheckBackend] = useState(false);
    const [isLoadingSendMessage, setIsLoadingSendMessage] = useState(false);
    const [imageUploadUrl, setImageUploadUrl] = useState<string>("");
    const [fileId, setFileId] = useState<string>("");
    const [isImageMessageDialogOpen, setIsImageMessageDialogOpen] =
        useState<boolean>(false);
    const [isSendingImageWithMessage, setIsSendingImageWithMessage] =
        useState<boolean>(false);
    const [figmaUrls, setFigmaUrls] = useState<string[]>([]);
    const [currentFigmaUrl, setCurrentFigmaUrl] = useState<string>("");

    const [imageMessage, setImageMessage] = useState<string>("");
    const [figmaFileChildern, setFigmaFileChildren] = useState<any[]>([]);

    const { updateCreateProjectStore } = useCreateProjectStore();
    const { id: user_id } = useGenesoftUserStore();
    const {
        id: onboarding_conversation_id,
        updateOnboardingConversationStore,
    } = useOnboardingConversationStore();

    const [showGitImportModal, setShowGitImportModal] = useState<boolean>(false);
    const supabase = createSupabaseClient();
    const [ghToken, setGhToken] = useState<string>("");

    useEffect(() => {
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            console.log("first session", session);
        })()
    }, []);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            console.log("userData", data);
            if (data != null && data.user != null) {
                const githubIdentity = data.user.identities?.find(ui => ui.provider == 'github')
                if (githubIdentity != null) {
                    console.log("githubIdentity", githubIdentity);
                    const githubUsername = githubIdentity.identity_data?.user_name
                    const githubSub = githubIdentity.identity_data?.sub
                    console.log("githubUsername", githubUsername);
                    console.log("githubSub", githubSub);

                    const { data: { session } } = await supabase.auth.getSession();
                    console.log("session", session);
                    setGhToken(session?.provider_token || "");
                }
            }
        };
        getUser();
    }, []);

    const handleSendMessage = async () => {
        setIsLoadingSendMessage(true);
        console.log("inputMessage", inputMessage);
        if (!inputMessage.trim()) {
            toast.error("Please enter a message");
            setIsLoadingSendMessage(false);
            return;
        }

        try {
            const newMessage: CreateMessageDto = {
                content: inputMessage,
                sender_type: "user",
                message_type: "text",
            };

            const tempMessage: Message = {
                id: "temp-message-id",
                content: inputMessage,
                sender_type: "user",
                message_type: "text",
                sender_id: user_id,
                created_at: new Date(),
                updated_at: new Date(),
                conversation_id: onboarding_conversation_id,
                sender: {
                    name: "User",
                    image: "https://github.com/shadcn.png",
                    email: "user@genesoft.com",
                },
            };
            setInputMessage("");
            setMessages((prev) => [...prev, tempMessage]);

            const res = await talkWithAiAgents({
                conversation_id: onboarding_conversation_id,
                message: newMessage,
            });

            console.log("res", res);

            setMessages(res.messages);
            setInputMessage("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingSendMessage(false);
        }
    };

    const handleSubmit = async () => {
        if (messages.length === 0) {
            setError(
                "Please have at least one conversation before creating your project",
            );
            return;
        }

        setIsSubmitting(true);
        setError(null);

        let template = "";
        if (checkBackend && checkWeb) {
            template = "web-and-backend";
        } else if (checkBackend && !checkWeb) {
            template = "backend";
        } else if (checkWeb && !checkBackend) {
            template = "web";
        }

        // Extract project description from chat
        const formattedMessages = messages
            .map((message) => {
                return `[${message.sender?.name}] ${message.content}`;
            })
            .join("\n");

        try {
            updateCreateProjectStore({
                description: formattedMessages,
                branding: {
                    logo_url: "",
                    color: rgbaToHex(brandColor),
                    theme: "",
                    perception: "",
                },
                is_onboarding: user_id ? false : true,
                project_type: template,
                backend_requirements:
                    template === "backend" || template === "web-and-backend"
                        ? formattedMessages
                        : undefined,
                onboarding_conversation_id: onboarding_conversation_id,
            });

            let figmaFileKey: string = "";
            if (figmaUrls.length > 0) {
                figmaFileKey = String(get_figma_file_key(figmaUrls[0]));
            }

            console.log({
                message: "figma file key",
                figmaFileKey,
            });

            onComplete({
                description: formattedMessages,
                color: rgbaToHex(brandColor),
                project_type: template,
                backend_requirements:
                    template === "backend" || template === "web-and-backend"
                        ? formattedMessages
                        : undefined,
                onboarding_conversation_id: onboarding_conversation_id,
                figma_file_key: figmaFileKey,
            });
        } catch (err) {
            setError("Failed to create project. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleGitImportSubmit = async (payload: any) => {
        console.log('handleGitImportSubmit', payload)
        console.log('handleGitImportSubmit:installationId', payload.installationId)
        setIsSubmitting(true);
        setError(null);
        const template = "git";
        try {
            updateCreateProjectStore({
                is_onboarding: user_id ? false : true,
                project_type: template,
                github_installation_id: payload.installationId,
                github_repo_owner: payload.owner.login,
                github_repo_name: payload.name,
            });

            onComplete({
                description: 'Imported from Github',
                project_type: template,
                github_installation_id: payload.installationId,
                github_repo_owner: payload.owner.login,
                github_repo_name: payload.name,
                github_repo_fullname: payload.full_name,
                github_repository_id: payload.id,
            });
        } catch (err) {
            setError("Failed to create project. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const timestamp = new Date().getTime();
            const fileName = `${"onboarding-conversation"}-${timestamp}`;
            const description = `Image for conversation ${"onboarding-conversation"}`;

            const res = await uploadFileFree(
                "conversation",
                fileName,
                description,
                "image",
                file,
            );

            if (res.error) {
                toast.error("Failed to upload image. Please try again.", {
                    description: res.error,
                    duration: 5000,
                    position: "top-center",
                });
                return;
            }

            setImageUploadUrl(res.url);
            setFileId(res.id);
            // Open the image message dialog after successful upload
            setIsImageMessageDialogOpen(true);
        } catch (err) {
            toast.error("Failed to upload image. Please try again.");
            console.error(err);
        }
    };

    // Handle sending image with message
    const handleSendImageWithMessage = async () => {
        console.log({
            imageUploadUrl,
            imageMessage,
            fileId,
        });
        if (!imageUploadUrl) return;

        if (!imageMessage.trim()) {
            toast.error("Please enter a message");
            setIsSendingImageWithMessage(false);
            return;
        }

        const newMessage: CreateMessageDto = {
            content: imageMessage,
            sender_type: "user",
            message_type: "image",
            sender_id: user_id,
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
                file_ids: [fileId],
                created_at: new Date(),
                updated_at: new Date(),
                conversation_id: onboarding_conversation_id,
                image_url: imageUploadUrl,
                sender: {
                    name: "User",
                    image: "https://github.com/shadcn.png",
                    email: "user@genesoft.com",
                },
            };
            setMessages([...messages, tempMessage]);

            const result = await talkWithAiAgents({
                conversation_id: onboarding_conversation_id,
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
        }
    };

    const setupOnboardingConversation = async () => {
        const res = await createOnboardingConversation();
        updateOnboardingConversationStore({
            id: res.id,
        });
    };

    const setupOnboardingConversationMessages = async () => {
        try {
            const res = await getOnboardingConversationById(
                onboarding_conversation_id,
            );
            setMessages(res.messages);
        } catch (err) {
            console.error(err);
        }
    };

    // Handle cancel image message
    const handleCancelImageMessage = () => {
        setImageMessage("");
        setImageUploadUrl("");
        setIsImageMessageDialogOpen(false);
    };

    // Add Figma URL to the list
    const handleAddFigmaUrl = async () => {
        if (figmaUrls?.length > 0) {
            toast.error("You can only add one Figma URL at a time");
            return;
        }
        if (currentFigmaUrl.trim() && !figmaUrls.includes(currentFigmaUrl)) {
            setFigmaUrls([...figmaUrls, currentFigmaUrl]);
            setCurrentFigmaUrl("");
            toast.success("Figma URL added successfully");
            const figmaFile = await getFigmaFile(currentFigmaUrl);
            const figmaFileNodes = figmaFile.document.children;
            const extractedFigmaFileNodes =
                extractFigmaChildren(figmaFileNodes);
            setFigmaFileChildren(extractedFigmaFileNodes);
        } else if (figmaUrls.includes(currentFigmaUrl)) {
            toast.error("This Figma URL is already added");
        }
    };

    // Remove Figma URL from the list
    const handleRemoveFigmaUrl = (urlToRemove: string) => {
        setFigmaUrls(figmaUrls.filter((url) => url !== urlToRemove));
    };

    useEffect(() => {
        if (onboarding_conversation_id) {
            setupOnboardingConversationMessages();
        } else {
            setupOnboardingConversation();
        }
    }, [onboarding_conversation_id]);

    console.log({
        message: "onboarding_conversation_id",
        onboarding_conversation_id,
        messages,
        figmaFileChildern,
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                boxShadow: [
                    "0 0 0 rgba(75, 107, 251, 0)",
                    "0 0 20px rgba(75, 107, 251, 0.5)",
                    "0 0 5px rgba(75, 107, 251, 0.2)",
                ],
            }}
            transition={{
                duration: 0.5,
                boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                },
            }}
            className="w-full backdrop-blur-md rounded-xl shadow-lg overflow-hidden flex flex-col relative"
        >

            {
                showGitImportModal && (
                    <GithubImportModal
                        isOpen={true}
                        onClose={() => setShowGitImportModal(false)}
                        githubAccessToken={ghToken}
                        onSelectRepository={(handleGitImportSubmit)}
                    />
                )
            }

            <div className="flex flex-col h-full relative z-10">
                <div className="flex flex-col gap-2 md:gap-4 mb-4 p-6">
                    <div className="flex items-center gap-2 justify-starts">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-fit bg-primary-dark border border-tertiary-dark text-left flex justify-between items-center p-4 h-auto hover:bg-primary-dark/80"
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={FigmaLogo}
                                        alt="Figma Logo"
                                        className="h-5 w-5"
                                    />
                                    <span className="text-white font-medium">
                                        Add Figma Design Reference for web
                                    </span>
                                </div>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-primary-dark border-tertiary-dark max-w-[90%] md:max-w-[620px] rounded-lg flex flex-col">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                    <Image
                                        src={FigmaLogo}
                                        alt="Figma Logo"
                                        className="h-5 w-5"
                                    />
                                    <p className="text-white font-medium">
                                        Add Figma Design Reference for web
                                    </p>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-white/70">
                                    <p className="text-xs md:text-sm flex items-center gap-2">
                                        <AlertCircleIcon className="h-4 w-4 text-red-500" />
                                        <span>
                                            Make sure you set share settings of
                                            the file to be anyone can view
                                        </span>
                                    </p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="mt-3">
                                {figmaUrls.length === 0 && (
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Enter Figma File URL"
                                            className="text-sm md:text-base bg-primary-dark border-tertiary-dark text-white"
                                            value={currentFigmaUrl}
                                            onChange={(e) =>
                                                setCurrentFigmaUrl(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <Button
                                            onClick={handleAddFigmaUrl}
                                            className="bg-genesoft text-white"
                                            disabled={!currentFigmaUrl.trim()}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                )}

                                {figmaUrls.length > 0 && (
                                    <div className="mt-4 w-full">
                                        <p className="text-white/70 mb-2">
                                            Added Figma Design Frame URLs:
                                        </p>
                                        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto w-10/12 self-center">
                                            {figmaUrls.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-tertiary-dark/30 p-2 rounded-md w-10/12 overflow-hidden"
                                                >
                                                    <p className="text-white text-sm truncate max-w-[90%]">
                                                        {url}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleRemoveFigmaUrl(
                                                                url,
                                                            )
                                                        }
                                                        className="h-6 w-6 text-white/70 hover:text-white hover:bg-red-500/20"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-secondary-dark text-white border-line-in-dark-bg">
                                    Close
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex items-center gap-2 justify-center">
                        <div>or </div>
                        <Button
                            variant="outline"
                            className="w-fit bg-primary-dark border border-tertiary-dark text-left flex justify-between items-center p-4 h-auto hover:bg-primary-dark/80"
                            onClick={() => {
                                if (ghToken != '') {
                                    setShowGitImportModal(true);
                                } else {
                                    toast.error("Please login to GitHub to import a repository");
                                }
                            }}
                        >
                            <span className="text-white">Git Import</span>
                            </Button>
                    </div>
                    </div>


                    {figmaFileChildern.length > 0 && (
                        <div className="flex flex-col items-start gap-2 mb-4 p-6 bg-tertiary-dark/30 rounded-lg">
                            <div className="w-full max-h-80 overflow-y-auto">
                                {figmaFileChildern.map((child, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-start mb-2"
                                    >
                                        <div className="flex items-center gap-2 text-white/80 font-medium">
                                            <span className="inline-block w-4 h-4 bg-genesoft rounded-sm"></span>
                                            {child.type} - {child.name}
                                        </div>
                                        {child.children.length > 0 && (
                                            <div className="flex flex-col items-start gap-1 ml-6 mt-1 border-l-2 border-genesoft/40 pl-3">
                                                {child.children.map(
                                                    (
                                                        child: any,
                                                        index: number,
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-2 text-white/70"
                                                        >
                                                            <span className="inline-block w-3 h-3 bg-genesoft/60 rounded-sm"></span>
                                                            {child.type} -{" "}
                                                            {child.name}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 md:gap-4 mb-4 p-6">
                    <p className="text-sm md:text-xl text-white/80 mb-4 text-start">
                        Project Setup
                    </p>
                    <div
                        className="flex flex-col md:flex-row gap-2 md:gap-8 mb-4"
                        id="project-type-toggle"
                    >
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="web"
                                className="border-genesoft text-genesoft h-6 w-6"
                                checked={checkWeb}
                                onCheckedChange={(checked) =>
                                    setCheckWeb(checked === true)
                                }
                            />
                            <Label
                                htmlFor="web"
                                className={`text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 p-1 md:p-2 rounded-md`}
                            >
                                <AppWindow className="h-4 w-4" />
                                <span>Web (NextJS)</span>
                            </Label>
                            <Image
                                src={NextJSLogo}
                                alt="Next.js"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                        </div>


                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="backend"
                                className="border-genesoft  text-genesoft h-6 w-6"
                                checked={checkBackend}
                                onCheckedChange={(checked) =>
                                    setCheckBackend(checked === true)
                                }
                            />
                            <Label
                                htmlFor="backend"
                                className={`text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 p-1 md:p-2 rounded-md`}
                            >
                                <Server className="h-4 w-4" />

                                <span>Backend (NestJS)</span>
                            </Label>
                            <Image
                                src={NestJSLogo}
                                alt="Nest.js"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-400 text-sm mb-4"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Chat messages */}
                <div className="self-center flex-1 overflow-y-auto bg-primary-dark/30 backdrop-blur-sm rounded-md p-1 md:p-4 mb-4 max-w-[420px] max-h-[580px] min-h-[500px] w-full md:max-w-[1024px] md:max-h-[600px] md:min-h-[600px] border-[1px] border-tertiary-dark mx-2 md:mx-4">
                    {messages?.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-center">
                            <div>
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-genesoft/50" />
                                <p className="text-xs md:text-base">
                                    Start a conversation with your own software
                                    development team by describe your project
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 overflow-y-scroll items-center">
                            {messages?.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex flex-col group w-full overflow-hidden px-1 md:px-4 text-start`}
                                >
                                    {message.sender_type === "system" ? (
                                        <SystemMessage message={message} />
                                    ) : message.sender_type === "user" ? (
                                        <OnboardingUserMessage
                                            message={message}
                                        />
                                    ) : (
                                        <AIAgentMessage
                                            message={message}
                                            messagesLength={messages?.length}
                                            index={index}
                                            status={status}
                                            sender_id={message.sender_id || ""}
                                        />
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
                {/* Message input and team member selector */}
                <div className="flex flex-col gap-4 mx-2 md:mx-4">
                    <div className="flex flex-col w-full gap-2 h-fit">
                        <div className="relative flex flex-col w-full bg-[#2b2d31] rounded-md p-1 h-fit">
                            {isLoadingSendMessage ? (
                                <div className="flex items-center justify-center h-full text-gray-400 text-center gap-2">
                                    <Loader2 className="h-8 w-8 animate-spin text-genesoft" />
                                    <p className="text-xs md:text-base">
                                        AI Agents are thinking...
                                    </p>
                                </div>
                            ) : (
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
                                        className="text-gray-400 hover:text-gray-300 relative md:absolute left-2 md:bottom-[-50px] z-10 h-2 w-2 md:h-10 md:w-20 bg-tertiary-dark hover:bg-tertiary-dark/80"
                                        onClick={() => {
                                            document
                                                .getElementById("image-upload")
                                                ?.click();
                                        }}
                                    >
                                        <ImageIcon className="h-2 w-2 md:h-10 md:w-10 text-white hover:text-gray-300" />
                                        <span className="text-white hidden md:block">
                                            Image
                                        </span>
                                    </Button>
                                    <Textarea
                                        value={inputMessage}
                                        onChange={(e) =>
                                            setInputMessage(e.target.value)
                                        }
                                        placeholder="Send a message to your own software development team..."
                                        className="text-xs md:text-base min-h-20 md:min-h-40 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-white conversation-textarea w-full"
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />

                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={
                                            inputMessage.trim() === "" ||
                                            isLoadingSendMessage
                                        }
                                        className={`rounded-md w-8 h-8 flex md:hidden ${inputMessage.trim() === "" ? "bg-[#4b4b4b] text-gray-400" : "bg-[#1e62d0] hover:bg-[#1a56b8] text-white"}`}
                                    >
                                        {isLoadingSendMessage ? (
                                            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-t-transparent border-white rounded-full animate-spin conversation-loading"></div>
                                        ) : (
                                            <Send size={8} />
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

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
                                    Your image has been uploaded. Would you like
                                    to add a message to go with it?
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
                                    onChange={(e) =>
                                        setImageMessage(e.target.value)
                                    }
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

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex justify-center mt-2"
                    >
                        <div className="flex flex-col items-center gap-2  p-2 md:p-4">
                            <p className="text-xs md:text-base text-white/80">
                                {
                                    "Once you think team are understanding requirements correctly, click create to start building your project"
                                }
                            </p>
                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting || messages?.length === 0
                                }
                                className="w-fit px-4 md:px-8 bg-genesoft hover:bg-genesoft/90 text-white font-medium py-2 md:py-6 rounded-lg shadow-lg shadow-genesoft/20 transition-all duration-300 text-xs md:text-base"
                            >
                                {isSubmitting ? "Creating ..." : "Create"}
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                ) : (
                                    <motion.div
                                        animate={{
                                            rotate: [0, 15, -15, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "loop",
                                        }}
                                    >
                                        <Sparkles className="w-4 h-4 ml-2" />
                                    </motion.div>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCreationBox;
