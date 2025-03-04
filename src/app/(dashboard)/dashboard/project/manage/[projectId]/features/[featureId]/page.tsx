"use client";

import {
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
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleButton } from "@/components/ui/toggle-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectStore } from "@/stores/project-store";
import { Feature, Project } from "@/types/project";
import {
    ChevronDown,
    ChevronUp,
    MessageSquare,
    MonitorPlay,
} from "lucide-react";
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
    const [isFeatureCollapsed, setIsFeatureCollapsed] = useState(true);

    const [sprintOptions, setSprintOptions] = useState<SprintOption[]>([]);
    const [activeTab, setActiveTab] = useState("conversation");

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
        console.log({
            message: "ManageFeaturePage: Feature id from path params",
            featureId,
        });
        setupFeature(featureId as string);
        setupActiveFeatureConversation(featureId as string);
        setupSprintOptions(featureId as string);
    }, [pathParams]);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    const setupActiveFeatureConversation = async (featureId: string) => {
        setIsLoadingSetupFeatureConversation(true);
        try {
            const activeConversation =
                await getActiveConversationByFeatureId(featureId);
            const conversationForWeb = await getConversationById(
                activeConversation.id,
            );
            setConversation(conversationForWeb);
            setMessages(conversationForWeb.messages);
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
        <div className="flex flex-col min-h-screen">
            <div className="p-2 md:p-4 lg:p-6 flex-1 flex flex-col gap-4">
                {/* Breadcrumb Section -> change to Navbar */}
                <div className="flex items-center sm:flex-row justify-between sm:items-center gap-2 text-white">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                            <SidebarTrigger className="-ml-1 bg-white rounded-md p-1 text-primary-dark hover:bg-primary-dark hover:text-white transition-colors" />
                        </div>
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Collapsible
                            className="w-full text-gray-400 text-xs"
                            open={!isFeatureCollapsed}
                            onOpenChange={(open) =>
                                setIsFeatureCollapsed(!open)
                            }
                        >
                            <CollapsibleTrigger className="text-white border-none font-bold text-lg">
                                <div className="flex flex-col gap-2 items-start">
                                    <span className="text-gray-400 text-xs">
                                        {"Feature"}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-sm">
                                            {feature?.name}
                                        </span>
                                        {isFeatureCollapsed ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronUp className="h-4 w-4" />
                                        )}
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="text-gray-400 text-xs">
                                {feature?.description}
                            </CollapsibleContent>
                        </Collapsible>
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
                <div className="md:hidden flex-1 flex flex-col">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="flex-1 flex flex-col"
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
                            className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden"
                        >
                            <div className="flex-1">
                                <Conversation
                                    type="feature"
                                    channelName={feature?.name || ""}
                                    channelDescription={
                                        feature?.description || ""
                                    }
                                    conversationId={conversation?.id || ""}
                                    initialMessages={messages || []}
                                    isLoading={
                                        isLoadingSetupFeatureConversation
                                    }
                                    sprintOptions={sprintOptions || []}
                                    selectedSprint={selectedSprint || ""}
                                    onSprintChange={handleSprintChange}
                                    onSubmitConversation={
                                        handleSubmitConversation
                                    }
                                    status={conversation?.status || ""}
                                    featureId={pathParams?.featureId as string}
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
                <div className="hidden md:flex flex-1 flex-col lg:flex-row gap-4">
                    {/* Conversation Section */}
                    <div
                        className={`flex-1 min-w-0 ${
                            isCollapsed ? "lg:w-full" : "lg:max-w-[60%]"
                        }`}
                    >
                        <Conversation
                            type="feature"
                            channelName={feature?.name || ""}
                            channelDescription={feature?.description || ""}
                            conversationId={conversation?.id || ""}
                            initialMessages={messages || []}
                            isLoading={isLoadingSetupFeatureConversation}
                            sprintOptions={sprintOptions || []}
                            selectedSprint={selectedSprint || ""}
                            onSprintChange={handleSprintChange}
                            onSubmitConversation={handleSubmitConversation}
                            status={conversation?.status || ""}
                            featureId={pathParams?.featureId as string}
                        />
                    </div>

                    {/* WebPreview Section - Collapsible */}
                    <Collapsible
                        className={`transition-all duration-300 ease-in-out ${
                            isCollapsed ? "w-0 opacity-0" : "flex-1 opacity-100"
                        }`}
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
        </div>
    );
};

export default ManageFeaturePage;
