"use client";

import { getOrganizationById } from "@/actions/organization";
import { getPageById } from "@/actions/page";
import { getProjectById } from "@/actions/project";
import PageLoading from "@/components/common/PageLoading";
import Conversation, { IMessage } from "@/components/Conversation";
import { WebPreview } from "@/components/project/manage/WebPreview";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProjectStore } from "@/stores/project-store";
import { GenesoftOrganization } from "@/types/organization";
import { Page, Project } from "@/types/project";
import { AppWindow, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
    pageId: string;
};

const ManagePagePage = ({ pageId }: Props) => {
    const pathParams = useParams();
    const { id: projectId, updateProjectStore } = useProjectStore();
    const [project, setProject] = useState<Project | null>(null);
    const [organization, setOrganization] =
        useState<GenesoftOrganization | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<Page | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sprintOptions = [
        { id: "sprint-1", name: "Sprint 1: Initial Design" },
        { id: "sprint-2", name: "Sprint 2: Homepage Development" },
        { id: "sprint-3", name: "Sprint 3: User Authentication" },
        { id: "sprint-4", name: "Sprint 4: Payment Integration" },
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
    }, [pathParams]);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    useEffect(() => {
        setMessages([
            {
                id: "1",
                content:
                    "We receive your requirements well, let me revise again that you want ... details ... on A page?",
                sender: "ai",
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                user: {
                    name: "Project Manager",
                    avatar: "",
                },
            },
            {
                id: "2",
                content:
                    "Project manager is waiting for your confirmation (sent to user_email@gmail.com)",
                sender: "system",
                timestamp: new Date(Date.now() - 1000 * 60 * 25),
            },
            {
                id: "3",
                content: "Hi, sorry for late reply",
                sender: "user",
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                user: {
                    name: "User A",
                },
            },
            {
                id: "4",
                content:
                    "Yes, I want feature A to implement on section B of A Page",
                sender: "user",
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                user: {
                    name: "User A",
                },
            },
            {
                id: "5",
                content: "Please continue",
                sender: "user",
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                user: {
                    name: "User A",
                },
            },
        ]);
    }, []);

    const setupOrganization = async (organizationId: string) => {
        const organizationData = await getOrganizationById(organizationId);
        setOrganization(organizationData);
    };

    console.log({
        message: "ManagePagePage",
        pageId,
        page,
    });

    if (loading) {
        return <PageLoading text="Loading page information..." />;
    }

    return (
        <div className="flex flex-col w-full h-full">
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
            <div className="flex w-full gap-x-4">
                {/* Conversation */}
                <div
                    className={`transition-all duration-300 ease-in-out ${
                        isCollapsed ? "w-full" : "w-[640px] shrink-0"
                    }`}
                >
                    <Conversation
                        type="page"
                        channelName={page?.name || ""}
                        initialMessages={messages}
                        sprintSelection={sprintOptions}
                        selectedSprint={selectedSprint || undefined}
                        onSprintChange={setSelectedSprint}
                    />
                </div>
                {/* Web Development - Collapsible */}
                <div className="relative flex-1">
                    <div
                        className="absolute top-4 right-2 z-10 bg-white text-primary-dark p-1 rounded-md hover:bg-white/80 cursor-pointer"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        {isCollapsed ? (
                            <div className="flex items-center gap-x-2">
                                <ChevronRight className="h-5 w-5 text-primary-dark" />
                                <p className="text-sm text-primary-dark">
                                    Open
                                </p>
                                <AppWindow className="h-5 w-5 text-primary-dark" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-x-2">
                                <ChevronLeft className="h-5 w-5 text-primary-dark" />
                                <p className="text-sm text-primary-dark">
                                    Close
                                </p>
                                <AppWindow className="h-5 w-5 text-primary-dark" />
                            </div>
                        )}
                    </div>
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
