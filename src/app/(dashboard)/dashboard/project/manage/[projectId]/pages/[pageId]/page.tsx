"use client";

import {
    getActiveConversationByPageId,
    getConversationById,
    getConversationsByPageId,
} from "@/actions/conversation";
import { getPageById } from "@/actions/page";
import { getProjectById } from "@/actions/project";
import PageLoading from "@/components/common/PageLoading";
import Conversation, {
    SprintOption,
} from "@/components/conversation/Conversation";
import { WebPreview } from "@/components/project/manage/WebPreview";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProjectStore } from "@/stores/project-store";
import { Page, Project } from "@/types/project";
import { AppWindow, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    ConversationByPageId,
    ConversationMessageForWeb,
    Message,
} from "@/types/message";

const ManagePagePage = () => {
    const pathParams = useParams();
    const { id: projectId, updateProjectStore } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<Page | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [conversation, setConversation] =
        useState<ConversationMessageForWeb | null>(null);
    const [isLoadingSetupPageConversation, setIsLoadingSetupPageConversation] =
        useState<boolean>(false);

    const [sprintOptions, setSprintOptions] = useState<SprintOption[]>([]);

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

    const setupPage = async (pageId: string) => {
        const pageFromDb = await getPageById(pageId);
        setPage(pageFromDb);
    };

    useEffect(() => {
        const { pageId } = pathParams;
        console.log({
            message: "ManagePagePage: Page id from path params",
            pageId,
        });
        setupPage(pageId as string);
        setupActivePageConversation(pageId as string);
        setupSprintOptions(pageId as string);
    }, [pathParams]);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    const setupActivePageConversation = async (pageId: string) => {
        setIsLoadingSetupPageConversation(true);
        try {
            const activeConversation =
                await getActiveConversationByPageId(pageId);
            const conversationForWeb = await getConversationById(
                activeConversation.id,
            );
            setConversation(conversationForWeb);
            setMessages(conversationForWeb.messages);
        } catch (error) {
            console.error("Error fetching active page conversation:", error);
        } finally {
            setIsLoadingSetupPageConversation(false);
        }
    };

    const setupSprintOptions = async (pageId: string) => {
        const conversations = await getConversationsByPageId(pageId);
        const sprintOptions = conversations.map(
            (conversation: ConversationByPageId, index: number) => ({
                id: conversation.id,
                name: `Sprint ${index + 1}: ${conversation.name || "untitled"}`,
                status: conversation.status,
            }),
        );
        setSprintOptions(sprintOptions);
    };

    const handleSubmitConversation = async () => {
        window.location.reload();
    };

    const handleSprintChange = async (sprintId: string) => {
        setSelectedSprint(sprintId);
        const conversationForWeb = await getConversationById(sprintId);
        setConversation(conversationForWeb);
        setMessages(conversationForWeb.messages);
    };

    console.log({
        message: "ManagePagePage",

        page,
        conversation,
        messages,
    });

    if (loading) {
        return <PageLoading text="Loading page information..." />;
    }

    return (
        <div className="flex flex-col w-full h-full relative px-2">
            <div
                className="absolute top-4 right-2 z-10 bg-white text-primary-dark p-1 rounded-md hover:bg-white/80 cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <div className="flex items-center gap-x-2">
                        <ChevronLeft className="h-5 w-5 text-primary-dark" />
                        <p className="text-sm text-primary-dark">Open</p>
                        <AppWindow className="h-5 w-5 text-primary-dark" />
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2">
                        <ChevronRight className="h-5 w-5 text-primary-dark" />
                        <p className="text-sm text-primary-dark">Close</p>
                        <AppWindow className="h-5 w-5 text-primary-dark" />
                    </div>
                )}
            </div>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1 text-white" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white">
                                    Project
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Manage
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Page
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    {page?.name || ""}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex w-full gap-x-2">
                {/* Conversation */}
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isCollapsed ? "w-full" : "w-[640px] shrink-0"
                    } pb-4`}
                >
                    <Conversation
                        type="page"
                        channelName={page?.name || ""}
                        channelDescription={page?.description || ""}
                        initialMessages={messages}
                        sprintOptions={sprintOptions}
                        selectedSprint={selectedSprint || undefined}
                        onSprintChange={handleSprintChange}
                        conversationId={conversation?.id || ""}
                        isLoading={isLoadingSetupPageConversation}
                        onSubmitConversation={handleSubmitConversation}
                        status={conversation?.status || ""}
                        pageId={page?.id || ""}
                    />
                </div>
                {/* Web Development - Collapsible */}
                <div className="relative flex-1">
                    <Collapsible
                        className={`transition-all duration-300 ease-in-out ${
                            isCollapsed ? "w-0 opacity-0" : "flex-1 opacity-100"
                        }`}
                        open={!isCollapsed}
                        onOpenChange={(open) => setIsCollapsed(!open)}
                    >
                        <CollapsibleContent
                            className="w-full data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
                            forceMount
                        >
                            <WebPreview project={project} />
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
        </div>
    );
};

export default ManagePagePage;
