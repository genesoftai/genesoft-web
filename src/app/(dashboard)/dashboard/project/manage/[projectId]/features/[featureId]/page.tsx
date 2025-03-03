"use client";

import {
    createConversation,
    getActiveConversationByFeatureId,
    getConversationById,
    getConversationsByFeatureId,
} from "@/actions/conversation";
import { getFeatureById } from "@/actions/feature";
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
import { Feature, Project } from "@/types/project";
import { AppWindow, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    ConversationByFeatureId,
    ConversationMessageForWeb,
    Message,
} from "@/types/message";

const ManageFeaturePage = () => {
    const pathParams = useParams();
    const { id: projectId, updateProjectStore } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [feature, setFeature] = useState<Feature | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [conversation, setConversation] =
        useState<ConversationMessageForWeb | null>(null);
    const [
        isLoadingSetupFeatureConversation,
        setIsLoadingSetupFeatureConversation,
    ] = useState<boolean>(false);

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

    const setupFeature = async (featureId: string) => {
        const featureFromDb = await getFeatureById(featureId);
        setFeature(featureFromDb);
    };

    useEffect(() => {
        const { featureId } = pathParams;

        // Only proceed if featureId exists and is a string
        if (featureId && typeof featureId === "string") {
            console.log({
                message: "ManageFeaturePage: Feature id from path params",
                featureId,
            });

            // Run these in sequence to avoid race conditions
            const setupData = async () => {
                try {
                    await setupFeature(featureId);
                    await setupActiveFeatureConversation(featureId);
                    await setupSprintOptions(featureId);
                } catch (error) {
                    console.error("Error setting up feature data:", error);
                }
            };

            setupData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathParams]); // Add a proper dependency array

    useEffect(() => {
        if (projectId) {
            setupProject();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]); // Ensure this doesn't run unnecessarily

    const setupActiveFeatureConversation = async (featureId: string) => {
        setIsLoadingSetupFeatureConversation(true);
        try {
            const activeConversation =
                await getActiveConversationByFeatureId(featureId);
            if (activeConversation) {
                const conversationForWeb = await getConversationById(
                    activeConversation.id,
                );
                setConversation(conversationForWeb);
                setMessages(conversationForWeb.messages);
            } else {
                const conversationForWeb = await createConversation({
                    feature_id: featureId,
                    project_id: projectId,
                });
                setConversation(conversationForWeb);
                setMessages(conversationForWeb.messages);
            }
        } catch (error) {
            console.error("Error fetching active feature conversation:", error);
        } finally {
            setIsLoadingSetupFeatureConversation(false);
        }
    };

    const setupSprintOptions = async (featureId: string) => {
        const conversations = await getConversationsByFeatureId(featureId);
        const sprintOptions = conversations.map(
            (conversation: ConversationByFeatureId, index: number) => ({
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
        message: "ManageFeaturePage",
        feature,
        conversation,
        messages,
    });

    if (loading) {
        return <PageLoading text="Loading feature information..." />;
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
                                    Feature
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    {feature?.name || ""}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-col items-center md:flex-row w-full gap-x-2">
                {/* Conversation */}
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isCollapsed ? "w-full" : "w-[640px] shrink-0"
                    } pb-4`}
                >
                    <Conversation
                        type="feature"
                        channelName={feature?.name || ""}
                        channelDescription={feature?.description || ""}
                        initialMessages={messages}
                        sprintOptions={sprintOptions}
                        selectedSprint={selectedSprint || undefined}
                        onSprintChange={handleSprintChange}
                        conversationId={conversation?.id || ""}
                        isLoading={isLoadingSetupFeatureConversation}
                        onSubmitConversation={handleSubmitConversation}
                        status={conversation?.status || ""}
                        featureId={feature?.id || ""}
                    />
                </div>
                {/* Web Development - Collapsible */}
                <div className="relative flex-1 w-full">
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

export default ManageFeaturePage;
