"use client";

import {
    getActiveConversationByProjectId,
    getConversationById,
} from "@/actions/conversation";
import { getProjectById } from "@/actions/project";
import PageLoading from "@/components/common/PageLoading";
import { WebPreview } from "@/components/project/manage/WebPreview";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProjectStore } from "@/stores/project-store";
import { Project } from "@/types/project";
import { MessageSquare, MonitorPlay } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ConversationMessageForWeb, Message } from "@/types/message";
import { ToggleButton } from "@/components/ui/toggle-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenesoftBlack from "@public/assets/genesoft-logo-black.png";
import Image from "next/image";
import ServicesIntegrationSheet from "@/components/project/services/ServicesIntegrationSheet";
import Conversation from "@/components/conversation/Conversation";
import BackendAiAgent from "@/components/project/backend/BackendAiAgent";
import { EnvironmentVariablesSheet } from "@/components/project/services/EnvironmentVariablesSheet";

const ManagePagePage = () => {
    const pathParams = useParams();
    const { id: projectId, updateProjectStore } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [conversation, setConversation] =
        useState<ConversationMessageForWeb | null>(null);
    const [isLoadingSetupPageConversation, setIsLoadingSetupPageConversation] =
        useState<boolean>(false);
    const [conversationKey, setConversationKey] = useState<number>(0);
    const [isServicesSheetOpen, setIsServicesSheetOpen] = useState(false);
    const [isEnvSheetOpen, setIsEnvSheetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("conversation");
    const router = useRouter();

    const setupProject = async () => {
        setLoading(true);
        try {
            const projectData = await getProjectById(projectId);
            setProject(projectData);
            updateProjectStore(projectData);
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    const setupProjectGeneration = async (projectId: string) => {
        setupActivePageConversation(projectId);
    };

    useEffect(() => {
        const { projectId } = pathParams;
        setupProjectGeneration(projectId as string);
    }, [pathParams]);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    const setupActivePageConversation = async (projectId: string) => {
        setIsLoadingSetupPageConversation(true);
        try {
            const activeConversation =
                await getActiveConversationByProjectId(projectId);
            const conversationForWeb = await getConversationById(
                activeConversation.id,
            );
            setConversation(conversationForWeb);
            setMessages(conversationForWeb.messages);
        } catch (error) {
            console.error("Error fetching active project conversation:", error);
        } finally {
            setIsLoadingSetupPageConversation(false);
        }
    };

    const handleSubmitConversation = async () => {
        window.location.reload();
    };

    const handleSendImageWithMessage = async (messages: Message[]) => {
        setMessages(messages);
        // Force conversation component to reload by changing its key
        setConversationKey((prevKey) => prevKey + 1);
    };

    if (loading) {
        return <PageLoading text="Loading page information..." />;
    }

    console.log({
        message: "project",
        project,
    });

    if (project?.project_template_type?.startsWith("backend")) {
        return <BackendAiAgent project={project} />;
    }

    return (
        <div className="flex flex-col max-h-screen p-2 md:p-4 lg:px-2 lg:py-2 flex-1 gap-1">
            <div className="flex items-center sm:flex-row justify-between sm:items-center gap-2 text-white">
                <div className="flex items-center gap-4">
                    <Image
                        src={GenesoftBlack}
                        alt="Genesoft Logo"
                        width={40}
                        height={40}
                        className="rounded-md hidden md:block cursor-pointer"
                        onClick={() => {
                            router.push("/");
                        }}
                    />
                    <div className="flex flex-col items-center gap-1">
                        <SidebarTrigger className="-ml-1 bg-white rounded-md p-1 text-primary-dark hover:bg-primary-dark hover:text-white transition-colors" />
                    </div>
                </div>

                <div className="flex items-center gap-[6px]">
                    <ServicesIntegrationSheet
                        isOpen={isServicesSheetOpen}
                        onOpenChange={setIsServicesSheetOpen}
                    />

                    <EnvironmentVariablesSheet
                        isOpen={isEnvSheetOpen}
                        onOpenChange={setIsEnvSheetOpen}
                    />
                </div>

                {/* Toggle Button - Only visible on md and up */}
                <div className="hidden md:block">
                    <ToggleButton
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                        className="ml-auto"
                    />
                </div>
            </div>

            {/* Mobile View (Tabs) - Only visible below md breakpoint */}
            <div className="md:hidden flex-1 flex flex-col w-full items-center">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col h-[calc(100vh-60px)]"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-2 bg-primary-dark text-subtext-in-dark-bg">
                        <TabsTrigger
                            value="conversation"
                            className="flex items-center gap-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>Conversation</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="flex items-center gap-2"
                        >
                            <MonitorPlay className="h-4 w-4" />
                            <span>Preview</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="conversation"
                        className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden h-full overflow-hidden"
                    >
                        <div className="flex-1 min-w-0 h-auto">
                            <Conversation
                                key={`mobile-conversation-${conversationKey}`}
                                conversationId={conversation?.id || ""}
                                initialMessages={messages || []}
                                isLoading={isLoadingSetupPageConversation}
                                onSubmitConversation={handleSubmitConversation}
                                status={conversation?.status || ""}
                                pageId={pathParams?.pageId as string}
                                onSendImageWithMessage={
                                    handleSendImageWithMessage
                                }
                            />
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="preview"
                        className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden"
                    >
                        <div className="flex-1">
                            <WebPreview project={project} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Desktop View - Only visible at md breakpoint and up */}
            <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-1">
                {/* Conversation Section */}
                <div
                    className={`flex-1 min-w-0 ${
                        isCollapsed ? "lg:w-full" : "lg:max-w-[60%]"
                    } h-[calc(100vh-60px)]`}
                >
                    <Conversation
                        key={`desktop-conversation-${conversationKey}`}
                        conversationId={conversation?.id || ""}
                        initialMessages={messages || []}
                        isLoading={isLoadingSetupPageConversation}
                        onSubmitConversation={handleSubmitConversation}
                        status={conversation?.status || ""}
                        pageId={pathParams?.pageId as string}
                        onSendImageWithMessage={handleSendImageWithMessage}
                    />
                </div>

                {/* WebPreview Section - Collapsible */}
                <Collapsible
                    className={`transition-all duration-300 ease-in-out ${
                        isCollapsed ? "w-0 opacity-0" : "flex-1 opacity-100"
                    } h-[calc(100vh-60px)]`}
                    open={!isCollapsed}
                    onOpenChange={(open) => setIsCollapsed(!open)}
                >
                    <CollapsibleContent
                        className="w-full h-full data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
                        forceMount
                    >
                        <div className="h-full overflow-auto">
                            <WebPreview project={project} />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    );
};

export default ManagePagePage;
