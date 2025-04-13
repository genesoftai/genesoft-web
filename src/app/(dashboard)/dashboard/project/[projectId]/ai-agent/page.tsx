"use client";

import {
    getActiveConversationByProjectId,
    getConversationById,
} from "@/actions/conversation";
import { getProjectById } from "@/actions/project";
import PageLoading from "@/components/common/PageLoading";
import { WebPreview } from "@/components/project/manage/WebPreview";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProjectStore } from "@/stores/project-store";
import { Project } from "@/types/project";
import { AppWindow, MessageSquare, MonitorPlay, Server } from "lucide-react";
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
import { ResizableHandle } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import BackendGenerations from "@/components/project/backend/BackendGenerations";
import { useCollectionStore } from "@/stores/collection-store";
import { getWebApplicationInfo } from "@/actions/web-application";
import { WebApplicationInfo } from "@/types/web-application";

const AiAgentPage = () => {
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
    const [activeTab, setActiveTab] = useState("conversation");
    const router = useRouter();
    const [activeTabForCollection, setActiveTabForCollection] = useState("web");
    const [activeTabOverview, setActiveTabOverview] = useState("preview");
    const {
        id: collectionId,
        web_project_id,
        backend_service_project_ids,
    } = useCollectionStore();
    const [webApplicationInfo, setWebApplicationInfo] =
        useState<WebApplicationInfo | null>(null);

    const setupProject = async () => {
        setLoading(true);
        try {
            const projectData = await getProjectById(projectId);
            setProject(projectData);
            updateProjectStore(projectData);
            if (
                projectData?.project_template_type &&
                projectData?.project_template_type.startsWith("web")
            ) {
                console.log("fetchLatestData", projectData?.id);
                fetchLatestData();
            }
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
        setupTabForCollection();
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

    if (loading) {
        return <PageLoading text="Loading page information..." />;
    }

    const handleGoToWebProject = () => {
        if (web_project_id) {
            updateProjectStore({
                id: web_project_id,
            });
            router.push(`/dashboard/project/${web_project_id}/ai-agent`);
        }
    };

    const handleGoToBackendProject = () => {
        if (
            backend_service_project_ids &&
            backend_service_project_ids.length > 0
        ) {
            updateProjectStore({
                id: backend_service_project_ids[0],
            });
            router.push(
                `/dashboard/project/${backend_service_project_ids[0]}/ai-agent`,
            );
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

    const fetchLatestData = async () => {
        console.log("fetchLatestData", project?.id);
        if (!projectId) return;

        try {
            const webAppInfo = await getWebApplicationInfo(projectId);

            setWebApplicationInfo(webAppInfo);
        } catch (error) {
            console.error("Error fetching latest data:", error);
        }
    };

    const setupTabForCollection = () => {
        if (projectId === web_project_id) {
            setActiveTabForCollection("web");
        } else {
            setActiveTabForCollection("backend");
        }
    };

    if (
        project?.project_template_type &&
        project?.project_template_type.startsWith("backend")
    ) {
        return (
            <BackendAiAgent
                project={project}
                handleGoToBackendProject={handleGoToBackendProject}
                handleGoToWebProject={handleGoToWebProject}
            />
        );
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

                    {collectionId && (
                        <Tabs
                            defaultValue="web"
                            className="w-auto"
                            value={activeTabForCollection}
                        >
                            <TabsList className="bg-primary-dark border-line-in-dark-bg">
                                <TabsTrigger
                                    value="web"
                                    className="text-white flex items-center gap-2"
                                    onClick={handleGoToWebProject}
                                >
                                    <AppWindow className="h-4 w-4" />
                                    <span>Web</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="backend"
                                    className="text-white flex items-center gap-2"
                                    onClick={handleGoToBackendProject}
                                >
                                    <Server className="h-4 w-4" />
                                    <span>Backend</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
                </div>

                <ServicesIntegrationSheet
                    isOpen={isServicesSheetOpen}
                    onOpenChange={setIsServicesSheetOpen}
                />

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
                            <WebPreview
                                project={project}
                                webApplicationInfo={webApplicationInfo}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Desktop View - Only visible at md breakpoint and up */}

            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] w-full rounded-lg md:min-w-[450px] p-0 gap-1 h-full"
            >
                <ResizablePanel defaultSize={50}>
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
                </ResizablePanel>
                <ResizableHandle
                    className="bg-primary-dark w-1 rounded-full"
                    withHandle
                />

                <ResizablePanel defaultSize={50}>
                    {activeTabOverview === "preview" && (
                        <WebPreview
                            project={project}
                            webApplicationInfo={webApplicationInfo}
                            onRefresh={fetchLatestData}
                        />
                    )}
                    {activeTabOverview === "generations" && (
                        <BackendGenerations project={project} />
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default AiAgentPage;
