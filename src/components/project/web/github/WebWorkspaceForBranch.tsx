import React, { useEffect, useState } from "react";
import {
    ResizablePanel,
    ResizablePanelGroup,
    ResizableHandle,
} from "@/components/ui/resizable";
import Image from "next/image";
import { useCollectionStore } from "@/stores/collection-store";
import { useParams, useRouter } from "next/navigation";
import { ConversationMessageForWeb, Message } from "@/types/message";
import { Project } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { getConversationById } from "@/actions/conversation";
import { getActiveConversationByProjectId } from "@/actions/conversation";
import PageLoading from "@/components/common/PageLoading";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AppWindow,
    MessageSquare,
    MonitorPlay,
    Server,
    ChevronDown,
    ChevronRight,
    GithubIcon,
    Code2,
} from "lucide-react";
import { WebPreview } from "../../manage/WebPreview";
import Conversation from "@/components/conversation/Conversation";
import { getLatestIteration } from "@/actions/development";
import { Toaster } from "sonner";
import { LatestIteration } from "@/types/development";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import GenesoftNewLogo from "@public/assets/genesoft-new-logo.png";

type Props = {
    project: Project | null;
    handleGoToBackendProject: () => void;
    handleGoToWebProject: () => void;
    onSaveProjectInfo: (project: Project) => void;
    repository: any;
    branch: any;
};

const WebWorkspaceForBranch = ({
    project,
    handleGoToBackendProject,
    handleGoToWebProject,
    onSaveProjectInfo,
    repository,
    branch,
}: Props) => {
    const router = useRouter();
    const { id: projectId } = useProjectStore();
    const [activeTab, setActiveTab] = useState("conversation");
    const [conversationKey, setConversationKey] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoadingSetupPageConversation, setIsLoadingSetupPageConversation] =
        useState<boolean>(false);
    const [conversation, setConversation] =
        useState<ConversationMessageForWeb | null>(null);
    const pathParams = useParams();
    const [loading, setLoading] = useState(false);
    const [isServicesSheetOpen, setIsServicesSheetOpen] = useState(false);
    const [isEnvSheetOpen, setIsEnvSheetOpen] = useState(false);
    const { id: collectionId, web_project_id } = useCollectionStore();
    const [isProjectInfoSheetOpen, setIsProjectInfoSheetOpen] = useState(false);
    const [isReadyShowPreview, setIsReadyShowPreview] = useState(false);
    const [latestIteration, setLatestIteration] =
        useState<LatestIteration | null>(null);
    const [isLoadingLatestIteration, setIsLoadingLatestIteration] =
        useState(false);

    const fetchLatestIteration = async () => {
        if (!project?.id) return;
        console.log("fetchLatestIteration for project", project.id);
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

    const setupProjectGeneration = async (projectId: string) => {
        setupActivePageConversation(projectId);
    };

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
        setActiveTab("conversation");
    };

    const handleSendImageWithMessage = async (messages: Message[]) => {
        setMessages(messages);
        // Force conversation component to reload by changing its key
        setConversationKey((prevKey) => prevKey + 1);
    };

    const handleSaveProjectInfo = async (project: Project) => {
        onSaveProjectInfo(project);
    };

    useEffect(() => {
        const { projectId } = pathParams;
        setupProjectGeneration(projectId as string);
    }, [pathParams]);

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
        <div className="w-full flex flex-col flex-1 gap-1 h-full bg-genesoft-dark">
            <Toaster position="top-right" />

            <div
                style={{ borderBottom: "1px solid #222" }}
                className="ps-0 flex items-center sm:flex-row justify-between sm:items-center gap-2 text-white w-full"
            >
                <div className="flex justify-between items-center gap-4 w-full">
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
                                    onClick={() => setIsEnvSheetOpen(true)}
                                >
                                    Environment Variables
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 z-10">
                        <div className="flex items-center gap-2 px-2 sm:px-4">
                            <SidebarTrigger className="-ml-0.5 sm:-ml-1 text-white" />
                            <Separator orientation="vertical" className="h-4" />
                            <div className="hidden md:flex items-center gap-2">
                                <Image
                                    src={GenesoftNewLogo}
                                    alt="Genesoft Logo"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8"
                                />
                            </div>
                            <div className="hidden sm:flex md:hidden items-center gap-1.5">
                                <Image
                                    src={GenesoftNewLogo}
                                    alt="Genesoft Logo"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="flex sm:hidden items-center gap-1">
                                <Image
                                    src={GenesoftNewLogo}
                                    alt="Genesoft Logo"
                                    width={16}
                                    height={16}
                                    className="w-4 h-4"
                                />
                            </div>

                            <Breadcrumb className="flex">
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        <BreadcrumbLink
                                            href={`/dashboard/github/repository/${repository.id}`}
                                            className="text-white text-sm font-bold hover:text-blue-300"
                                        >
                                            {repository.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbPage>
                                    <ChevronRight className="w-4 h-4" />
                                    <BreadcrumbPage className="text-white text-sm font-bold">
                                        {branch.name}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </header>

                    <div className="hidden md:flex md:flex-row items-center gap-2">
                        <Tabs defaultValue="preview" className="w-auto">
                            <TabsList className="bg-primary-dark border-line-in-dark-bg">
                                <TabsTrigger
                                    value="preview"
                                    className="text-white flex items-center gap-2"
                                >
                                    <MonitorPlay className="h-4 w-4" />
                                    <span>Preview</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="development"
                                    className="text-white flex items-center gap-2"
                                >
                                    <Code2 className="h-4 w-4" />
                                    <span>Development</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-primary-dark hover:bg-genesoft text-white hover:text-white transition-colors duration-200 rounded-md px-4 py-2 shadow-sm border border-primary-dark/20 text-base font-bold"
                        >
                            <GithubIcon className="h-4 w-4" />
                            <span>Create PR</span>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {collectionId && web_project_id === projectId && (
                        <Tabs
                            defaultValue="web"
                            className="w-auto hidden md:flex"
                            value={"web"}
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
            <div className="md:hidden flex-1 flex flex-col w-full items-center overflow-x-scroll">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full flex-1 flex flex-col h-[calc(100vh-60px)]"
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
                            <span>Preview </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="conversation"
                        className="w-100 flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden h-full overflow-hidden"
                    >
                        <div className="w-100 flex-1 min-w-0 h-full">
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
                                project={project as Project}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="preview"
                        className="w-full flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden h-full"
                    >
                        <WebPreview
                            project={project}
                            isReadyShowPreview={isReadyShowPreview}
                            setIsReadyShowPreview={setIsReadyShowPreview}
                            latestIteration={latestIteration}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* TODO: develop new WebConversation component for this use case */}
            {/* TODO: develop new WebPreview component for this use case (able to reference Figma frame) */}

            <div className="hidden md:flex">
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
                            project={project as Project}
                        />
                    </ResizablePanel>
                    <ResizableHandle
                        className="bg-primary-dark w-1 rounded-full"
                        withHandle
                    />
                    <ResizablePanel defaultSize={50}>
                        <WebPreview
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

export default WebWorkspaceForBranch;
