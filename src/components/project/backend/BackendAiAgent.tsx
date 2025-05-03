import { ConversationMessageForWeb, Message } from "@/types/message";
import { Project } from "@/types/project";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import GenesoftBlack from "@public/assets/genesoft-logo-black.png";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppWindow, ChevronDown, MonitorPlay, Server } from "lucide-react";
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
import { useCollectionStore } from "@/stores/collection-store";
import BackendProjectInfoSheet from "../services/BackendProjectInfoSheet";
import { getLatestIteration } from "@/actions/development";
import ServicesIntegrationSheet from "../services/ServicesIntegrationSheet";
import { Toaster } from "sonner";
import EnvironmentVariablesSheet from "@/components/project/services/EnvironmentVariablesSheet";
import { LatestIteration } from "@/types/development";
import {
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
    const [isLoadingLatestIteration, setIsLoadingLatestIteration] =
        useState(false);
    const [latestIteration, setLatestIteration] =
        useState<LatestIteration | null>(null);
    const [isReadyShowPreview, setIsReadyShowPreview] = useState(false);

    const setupProjectGeneration = async (projectId: string) => {
        setupActivePageConversation(projectId);
    };
    const [activeTabForCollection] = useState("backend");
    const { id: collectionId } = useCollectionStore();

    const fetchLatestIteration = async () => {
        if (!project?.id) return;
        try {
            setIsLoadingLatestIteration(true);
            const data = await getLatestIteration(project.id);
            console.log("fetchLatestIteration", data);
            if (data.status !== "done") {
                setIsReadyShowPreview(false);
            }
            setLatestIteration(data);
        } catch (error) {
            console.error("Error fetching latest iteration:", error);
        } finally {
            setIsLoadingLatestIteration(false);
        }
    };

    useEffect(() => {
        const { projectId } = pathParams;
        setupProjectGeneration(projectId as string);
    }, [pathParams]);

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

    const refreshPreview = () => {
        setIsReadyShowPreview(false);
    };

    // Poll for latest iteration every minute
    useEffect(() => {
        if (!project?.id) return;

        fetchLatestIteration();

        // Set up polling every 1 minute
        const iterationPollingInterval = setInterval(() => {
            fetchLatestIteration();
        }, 60000);

        // Clean up interval on component unmount
        return () => clearInterval(iterationPollingInterval);
    }, [project?.id]);

    if (loading) {
        return <PageLoading text="Loading page information..." />;
    }

    return (
        <div className="px-4 flex flex-col mb-8 h-full p-2 md:p-4 lg:px-2 lg:py-2 flex-1 bg-genesoft-dark">
            <Toaster position="top-center" />
            <div
                style={{ borderBottom: "1px solid #222" }}
                className="ps-0 p-2 pb-4 mb-4 flex items-center sm:flex-row justify-between sm:items-center gap-2 text-white"
            >
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

                    <div className="relative md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 bg-white text-primary-dark hover:bg-primary-dark hover:text-white"
                                >
                                    Settings <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() =>
                                        setIsProjectInfoSheetOpen(true)
                                    }
                                >
                                    Project Info
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsServicesSheetOpen(true)}
                                >
                                    Services Integration
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsEnvSheetOpen(true)}
                                >
                                    Environment Variables
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem
                                    onClick={() =>
                                        setIsDeploymentSheetOpen(true)
                                    }
                                >
                                    Deployment
                                </DropdownMenuItem> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="hidden md:flex md:flex-row items-center gap-2">
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
                            onSetEnv={refreshPreview}
                        />

                        {/* <DeploymentSheet
                            isOpen={isDeploymentSheetOpen}
                            onOpenChange={setIsDeploymentSheetOpen}
                        /> */}
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
            </div>

            {/* Mobile View (Tabs) - Only visible below md breakpoint */}
            <div className="w-full md:hidden flex-1 flex flex-col items-center overflow-x-scroll">
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
                        className="w-full flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden h-full overflow-hidden"
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
                                project={project}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="preview"
                        className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden h-full"
                    >
                        <BackendPreview
                            project={project}
                            isReadyShowPreview={isReadyShowPreview}
                            setIsReadyShowPreview={setIsReadyShowPreview}
                            latestIteration={latestIteration}
                        />
                    </TabsContent>
                </Tabs>
            </div>
            <div className="hidden md:flex">
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
                            project={project}
                        />
                    </ResizablePanel>
                    <ResizableHandle
                        className="bg-primary-dark w-1 rounded-full"
                        withHandle
                    />
                    <ResizablePanel defaultSize={50}>
                        <BackendPreview
                            project={project}
                            isReadyShowPreview={isReadyShowPreview}
                            setIsReadyShowPreview={setIsReadyShowPreview}
                            latestIteration={latestIteration}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default BackendAiAgent;
