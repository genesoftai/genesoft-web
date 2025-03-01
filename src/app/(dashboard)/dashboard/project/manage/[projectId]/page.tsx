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
import { User } from "lucide-react";
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

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                {/* <div className="flex flex-row gap-4">
                        <ProjectSidebar />
                    </div> */}
                <div className="flex flex-col gap-4 p-8 w-full rounded-xl bg-secondary-dark">
                    <div className="space-y-6">
                        <Card className="bg-primary-dark border-none text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8">
                                <div className="space-y-6">
                                    <div>
                                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                            {project?.name}
                                        </CardTitle>
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

                    {/* Project Requirements
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
                    </Card> */}

                    <WebPreview project={project} />

                    <div className="flex flex-col gap-4  p-8 w-full rounded-xl bg-primary-dark">
                        <h2 className="text-2xl font-bold">Project Members</h2>
                        <div className="flex flex-row gap-4">
                            {organization?.users?.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-2 p-4 border rounded-lg"
                                >
                                    {user.image ? (
                                        <Image
                                            src={user.image || ""}
                                            alt={user.name || user.email}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-gray-500" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-white">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Toaster />
        </div>
    );
}
