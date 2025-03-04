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
import { WebPreview } from "@/components/project/manage/WebPreview";
import EditProjectInfoDialog from "@/components/project/manage/EditProjectInfoDialog";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import posthog from "posthog-js";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { useProjectStore } from "@/stores/project-store";
import { getOrganizationById } from "@/actions/organization";
import { GenesoftOrganization } from "@/types/organization";
import Image from "next/image";

const pageName = "ManageProjectPage";

export default function ManageProjectPage() {
    posthog.capture("pageview_manage_project");
    const pathParams = useParams();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<Project | null>(null);

    const [projectId, setProjectId] = useState<string>("");
    const { updateGenesoftUser } = useGenesoftUserStore();
    const { updateProjectStore } = useProjectStore();
    const [organization, setOrganization] =
        useState<GenesoftOrganization | null>(null);

    useEffect(() => {
        const { projectId } = pathParams;
        setProjectId(projectId as string);
    }, [pathParams]);

    useEffect(() => {
        console.log({
            message: `${pageName}: Project ID`,
            projectId,
        });
        if (projectId) {
            updateGenesoftUser({ project_id: projectId });
            setupProject();
        }
    }, [projectId]);

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

    const setupOrganization = async (organizationId: string) => {
        const organizationData = await getOrganizationById(organizationId);
        setOrganization(organizationData);
    };

    console.log({
        message: `${pageName}: Project`,
        project,
        projectId,
        organization,
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

            <div className="flex flex-1 flex-col gap-4 p-0 md:p-4 pt-0 w-full">
                <div className="flex flex-col gap-4 p-4 md:p-8 w-full rounded-xl bg-secondary-dark">
                    <div className="space-y-6">
                        <Card className="bg-primary-dark border-none text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="flex flex-col items-start justify-between space-y-0 p-8">
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row  gap-y-4 items-start md:items-center gap-x-8">
                                        <div className="flex items-center gap-4">
                                            {project?.branding?.logo_url && (
                                                <Image
                                                    src={
                                                        project.branding
                                                            .logo_url
                                                    }
                                                    alt={`${project?.name} logo`}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full mr-4"
                                                />
                                            )}
                                            <CardTitle
                                                className="text-3xl font-bold"
                                                style={{
                                                    color:
                                                        project?.branding
                                                            ?.color ||
                                                        "#2563EB", // Default color if branding color is not available
                                                }}
                                            >
                                                {project?.name}
                                            </CardTitle>
                                        </div>

                                        <EditProjectInfoDialog
                                            projectId={projectId}
                                            projectName={project?.name || ""}
                                            projectDescription={
                                                project?.description || ""
                                            }
                                            projectPurpose={
                                                project?.purpose || ""
                                            }
                                            projectTargetAudience={
                                                project?.target_audience || ""
                                            }
                                            onSuccess={setupProject}
                                        />
                                    </div>
                                    <CardDescription className="mt-3 max-w-2xl text-gray-300 leading-relaxed">
                                        {project?.description}
                                    </CardDescription>
                                </div>

                                <div className="space-y-4 bg-black/20 rounded-lg p-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm uppercase tracking-wider text-blue-400 font-bold">
                                            Purpose
                                        </Label>
                                        <p className="text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-400/30">
                                            {project?.purpose}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm uppercase tracking-wider text-purple-400 font-bold">
                                            Target Audience
                                        </Label>
                                        <p className="text-gray-300 leading-relaxed pl-4 border-l-2 border-purple-400/30">
                                            {project?.target_audience}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    <WebPreview project={project} />
                </div>
            </div>

            <Toaster />
        </div>
    );
}
