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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, Files, MonitorCog } from "lucide-react";
import { useRouter } from "next/navigation";
const pageName = "ManageProjectPage";

export default function ManageProjectPage({
    params,
}: {
    params: { projectId: string };
}) {
    const { projectId } = params;
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const router = useRouter();

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
                                    <div className="mt-4 space-y-2">
                                        <div>
                                            <Label className="text-sm font-semibold">
                                                Purpose
                                            </Label>
                                            <p className="text-subtext-in-dark-bg px-4">
                                                {project?.purpose}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold">
                                                Target Audience
                                            </Label>
                                            <p className="text-subtext-in-dark-bg px-4">
                                                {project?.target_audience}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <EditProjectInfoDialog
                                    projectId={projectId}
                                    projectName={project?.name || ""}
                                    projectDescription={
                                        project?.description || ""
                                    }
                                    projectPurpose={project?.purpose || ""}
                                    projectTargetAudience={
                                        project?.target_audience || ""
                                    }
                                    onSuccess={setupProject}
                                />
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Project Requirements */}
                    <Card className="bg-primary-dark border-none text-white">
                        <CardHeader className="flex flex-col space-y-4">
                            <div>
                                <CardTitle className="text-2xl">
                                    Project Requirements
                                </CardTitle>
                                <CardDescription className="mt-2 text-subtext-in-dark-bg">
                                    Click button to view and update each section
                                    requirements of this project
                                </CardDescription>
                            </div>

                            <div className="flex flex-row gap-4">
                                <Button
                                    className="flex items-center gap-2 bg-genesoft text-white hover:text-black hover:bg-white"
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/project/manage/${projectId}/branding`,
                                        )
                                    }
                                >
                                    <Eye className="w-6 h-6" />
                                    <span>Branding</span>
                                </Button>

                                <Button
                                    className="flex items-center gap-2 bg-genesoft text-white hover:text-black hover:bg-white"
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/project/manage/${projectId}/pages`,
                                        )
                                    }
                                >
                                    <Files className="w-6 h-6" />
                                    <span>Pages</span>
                                </Button>

                                <Button
                                    className="flex items-center gap-2 bg-genesoft text-white hover:text-black hover:bg-white"
                                    onClick={() =>
                                        router.push(
                                            `/dashboard/project/manage/${projectId}/features`,
                                        )
                                    }
                                >
                                    <MonitorCog className="w-6 h-6" />
                                    <span>Features</span>
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    <WebPreview project={project} />

                    <WebInfo />
                </div>
            </div>
        </div>
    );
}
