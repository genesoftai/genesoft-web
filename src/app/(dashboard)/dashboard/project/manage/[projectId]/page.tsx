"use client";

import React, { useEffect, useState } from "react";
import SimpleLoading from "@/components/common/SimpleLoading";
import {
    Breadcrumb,
    BreadcrumbPage,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getProjectById } from "@/actions/project";
import { Project } from "@/types/project";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { WebInfo } from "@/components/project/manage/WebInfo";
import { WebPreview } from "@/components/project/manage/WebPreview";
import EditProjectInfoDialog from "@/components/project/manage/EditProjectInfoDialog";
import { useParams } from "next/navigation";
const pageName = "ManageProjectPage";

export default function ProjectManage() {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        console.log({
            message: `${pageName}: Project ID`,
            projectId,
        });
        if (projectId) {
            setupProject();
        }
    }, [projectId]);

    const setupProject = async () => {
        setLoading(true);
        try {
            const projectData = await getProjectById(projectId);
            setProject(projectData);
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log({
        message: `${pageName}: Project`,
        project,
        projectId,
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-primary-dark text-white">
                <SimpleLoading color="#2563EB" size={100} />
                <p className="text-2xl">Loading project information...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary-dark text-white w-full">
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
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                <div className="flex flex-col gap-4 p-8 w-full rounded-xl bg-secondary-dark">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Project
                            </h1>
                            <p className="text-muted-foreground">
                                Preview, Manage, and Feedback your web
                                application project
                            </p>
                        </div>

                        <Card className="bg-primary-dark border-none text-white">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {project?.name}
                                    </CardTitle>
                                    <CardDescription className="mt-2 max-w-2xl text-subtext-in-dark-bg">
                                        {project?.description}
                                    </CardDescription>
                                </div>
                                <EditProjectInfoDialog
                                    projectId={projectId}
                                    projectName={project?.name || ""}
                                    projectDescription={
                                        project?.description || ""
                                    }
                                    onSuccess={setupProject}
                                />
                            </CardHeader>
                        </Card>
                    </div>

                    <WebPreview project={project} />

                    <WebInfo />
                </div>
            </div>
        </div>
    );
}
