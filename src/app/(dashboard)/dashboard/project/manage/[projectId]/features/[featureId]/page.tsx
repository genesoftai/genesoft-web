"use client";

import { getOrganizationById } from "@/actions/organization";
import { getFeatureById } from "@/actions/feature";
import { getProjectById } from "@/actions/project";
import PageLoading from "@/components/common/PageLoading";
import Conversation from "@/components/conversation/Conversation";
import { ConversationMessageForWeb, Message } from "@/types/message";
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
import { GenesoftOrganization } from "@/types/organization";
import { Feature, Project } from "@/types/project";
import { AppWindow, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    getActiveConversationByFeatureId,
    getConversationById,
} from "@/actions/conversation";

type Props = {
    featureId: string;
};

const ManageFeaturePage = ({ featureId }: Props) => {
    const pathParams = useParams();
    const { id: projectId, updateProjectStore } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);
    const [organization, setOrganization] =
        useState<GenesoftOrganization | null>(null);
    const [loading, setLoading] = useState(false);
    const [feature, setFeature] = useState<Feature | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [conversation, setConversation] =
        useState<ConversationMessageForWeb | null>(null);

    const sprintOptions = [
        { id: "sprint-1", name: "Sprint 1: Initial Design" },
        { id: "sprint-2", name: "Sprint 2: Feature Implementation" },
        { id: "sprint-3", name: "Sprint 3: Testing & Refinement" },
        { id: "sprint-4", name: "Sprint 4: Final Integration" },
    ];

    const setupProject = async () => {
        setLoading(true);
        try {
            const projectData = await getProjectById(projectId);
            setProject(projectData);
            setupOrganization(projectData.organization_id);
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
    }, [pathParams]);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    const setupOrganization = async (organizationId: string) => {
        const organizationData = await getOrganizationById(organizationId);
        setOrganization(organizationData);
    };

    console.log({
        message: "ManageFeaturePage",
        featureId,
        feature,
    });

    if (loading) {
        return <PageLoading text="Loading feature information..." />;
    }

    const setupActiveFeatureConversation = async (featureId: string) => {
        const activeConversation =
            await getActiveConversationByFeatureId(featureId);
        const conversationForWeb = await getConversationById(
            activeConversation.id,
        );
        setConversation(conversationForWeb);
        setMessages(conversationForWeb.messages);
    };

    console.log({
        message: "ManageFeaturePage",
        featureId,
        feature,
        conversation,
        messages,
    });

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
            <div className="flex w-full gap-x-4">
                {/* Conversation */}
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isCollapsed ? "w-full" : "w-[640px] shrink-0"
                    }`}
                >
                    <Conversation
                        type="feature"
                        channelName={feature?.name || ""}
                        channelDescription={feature?.description || ""}
                        initialMessages={messages}
                        sprintSelection={sprintOptions}
                        selectedSprint={selectedSprint || undefined}
                        onSprintChange={setSelectedSprint}
                        conversationId={conversation?.id || ""}
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

export default ManageFeaturePage;
