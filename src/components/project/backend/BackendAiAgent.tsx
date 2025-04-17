import { ConversationMessageForWeb, Message } from "@/types/message";
import { Project } from "@/types/project";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import GenesoftBlack from "@public/assets/genesoft-logo-black.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppWindow, MonitorPlay, Server } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { getConversationById } from "@/actions/conversation";
import { getActiveConversationByProjectId } from "@/actions/conversation";
import PageLoading from "@/components/common/PageLoading";
import BackendConversation from "@/components/conversation/BackendConversation";
import { BackendPreview } from "../manage/BackendPreview";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import BackendGenerations from "./BackendGenerations";
import { useCollectionStore } from "@/stores/collection-store";
import BackendProjectInfoSheet from "../services/BackendProjectInfoSheet";
import { getLatestIteration } from "@/actions/development";
import ServicesIntegrationSheet from "../services/ServicesIntegrationSheet";
import DeploymentSheet from "../services/DeploymentSheet";
import { Toaster } from "sonner";
import EnvironmentVariablesSheet from "@/components/project/services/EnvironmentVariablesSheet";

type Props = {
    project: Project;
    handleGoToWebProject: () => void;
    handleGoToBackendProject: () => void;
    onSaveProjectInfo: (project: Project) => void;
};

const BackendAiAgent = ({
    project,
    handleGoToWebProject,
    handleGoToBackendProject,
    onSaveProjectInfo,
}: Props) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("conversation");
    const [activeTabOverview, setActiveTabOverview] = useState("preview");
    const [conversationKey, setConversationKey] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingSetupPageConversation, setIsLoadingSetupPageConversation] =
        useState<boolean>(false);
    const [conversation, setConversation] =
        useState<ConversationMessageForWeb | null>(null);
    const pathParams = useParams();
    const [loading, setLoading] = useState(false);
    const [isProjectInfoSheetOpen, setIsProjectInfoSheetOpen] = useState(false);
    const [isServicesSheetOpen, setIsServicesSheetOpen] = useState(false);
    const [isDeploymentSheetOpen, setIsDeploymentSheetOpen] = useState(false);
    const [isEnvSheetOpen, setIsEnvSheetOpen] = useState(false);

    const setupProjectGeneration = async (projectId: string) => {
        setupActivePageConversation(projectId);
    };
    const [activeTabForCollection] = useState("backend");
    const { id: collectionId } = useCollectionStore();

    useEffect(() => {
        const { projectId } = pathParams;
        setupProjectGeneration(projectId as string);
    }, [pathParams]);

    useEffect(() => {
        if (project) {
            checkLatestIteration();
        }
    }, [project]);

    const setupActivePageConversation = async (projectId: string) => {
        setLoading(true);
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
            setLoading(false);
        }
    };
    const checkLatestIteration = async () => {
        if (!project?.id) return;

        try {
            const data = await getLatestIteration(project.id);
            if (data.status === "in_progress") {
                setActiveTabOverview("generations");
            }
        } catch (error) {
            console.error("Error fetching latest iteration:", error);
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

    const handleSaveProjectInfo = async (project: Project) => {
        onSaveProjectInfo(project);
    };

    if (loading) {
        return <PageLoading text="Loading page information..." />;
    }

    return (
        <div className="flex flex-col max-h-screen p-2 md:p-4 lg:px-2 lg:py-2 flex-1 gap-1">
            <Toaster position="top-center" />
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

                    <BackendProjectInfoSheet
                        isOpen={isProjectInfoSheetOpen}
                        onOpenChange={setIsProjectInfoSheetOpen}
                        project={project as Project}
                        onSave={handleSaveProjectInfo}
                    />

                    <ServicesIntegrationSheet
                        isOpen={isServicesSheetOpen}
                        onOpenChange={setIsServicesSheetOpen}
                    />

                    <EnvironmentVariablesSheet
                        isOpen={isEnvSheetOpen}
                        onOpenChange={setIsEnvSheetOpen}
                    />

                    <DeploymentSheet
                        isOpen={isDeploymentSheetOpen}
                        onOpenChange={setIsDeploymentSheetOpen}
                    />

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

                <Tabs
                    value={activeTabOverview}
                    onValueChange={setActiveTabOverview}
                    className="flex-1 flex flex-col max-w-xs md:max-w-sm rounded-lg"
                >
                    <TabsList className="grid self-center w-full grid-cols-2 mb-2 bg-primary-dark text-subtext-in-dark-bg">
                        <TabsTrigger
                            value="preview"
                            className="flex items-center gap-2 text-xs md:text-sm"
                            onClick={() => setActiveTabOverview("preview")}
                        >
                            <MonitorPlay className="h-2 w-2 md:h-4 md:w-4" />

                            <span>Preview</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="generations"
                            className="flex items-center gap-2 text-xs md:text-sm"
                            onClick={() => setActiveTabOverview("generations")}
                        >
                            <MessageSquare className="h-2 w-2 md:h-4 md:w-4" />
                            <span>Generations</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Mobile View (Tabs) - Only visible below md breakpoint */}
            <div className="md:hidden flex-1 flex flex-col w-full items-center overflow-x-scroll">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col h-[calc(100vh-60px)]"
                >
                    <TabsList className="grid self-center w-full sm:w-6/12 grid-cols-2 mb-2 bg-primary-dark text-subtext-in-dark-bg">
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
                            <BackendConversation
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
                            <BackendPreview project={project} />
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
                    <BackendConversation
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
                        <BackendPreview project={project} />
                    )}
                    {activeTabOverview === "generations" && (
                        <BackendGenerations project={project} />
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
            {/* <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-1">
                <div
                    className={`flex-1 min-w-0 ${
                        isCollapsed ? "lg:w-full" : "lg:max-w-[60%]"
                    } h-[calc(100vh-60px)]`}
                >
                    <BackendConversation
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
                            <BackendPreview project={project} />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div> */}
        </div>
    );
};

export default BackendAiAgent;
