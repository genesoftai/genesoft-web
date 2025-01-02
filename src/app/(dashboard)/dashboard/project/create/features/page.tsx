"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbPage,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { Loader2, MonitorCog, Trash2 } from "lucide-react";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { AddFeatureDialog } from "@/components/project/features/AddFeatureDialog";
import { getPages, getFeatures } from "@/utils/project/create";
import { CreateProjectRequest, Page, Feature } from "@/types/project";
import { createProject } from "@/actions/project";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
const pageName = "CreateProjectFeaturesPage";

const CreateProjectFeaturesPage = () => {
    const router = useRouter();
    const {
        name,
        description,
        purpose,
        target_audience,
        branding,
        pages,
        features,
        updateCreateProjectStore,
        clearCreateProjectStore,
    } = useCreateProjectStore();
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const { organization } = useGenesoftUserStore();
    const [error, setError] = useState<string | null>(null);

    const handleCreateProject = async () => {
        setIsCreatingProject(true);

        const project: CreateProjectRequest = {
            organization_id: organization?.id || "",
            name,
            description,
            purpose,
            target_audience,
            branding,
            pages: getPages(pages as Page[]),
            features: getFeatures(features as Feature[]),
        };

        console.log({
            message: `${pageName}.handleCreateProject: Create project request`,
            project,
        });

        try {
            const response = await createProject(project);
            console.log({
                message: `${pageName}.handleCreateProject: Create project response`,
                response,
            });
            clearCreateProjectStore();
            router.push("/dashboard");
        } catch (error) {
            console.error(
                `${pageName}.handleCreateProject: Error creating project`,
                error,
            );
            setError("Error creating project, please try again");
        } finally {
            setIsCreatingProject(false);
        }
    };

    const handleBack = () => {
        router.push("/dashboard/project/create/pages");
    };

    const handleRemoveFeeature = (index: number) => {
        const updatedFeatures = features?.filter((_, i) => i !== index);
        updateCreateProjectStore({ features: updatedFeatures });
    };

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
                                    Create Project
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Info
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Branding
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Pages
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Features
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-col gap-4 p-8 w-full rounded-xl bg-secondary-dark">
                <div>
                    <div className="flex flex-col gap-y-2 mb-8">
                        <div className="flex items-center gap-x-2">
                            <MonitorCog className="w-6 h-6 text-white" />
                            <p className="text-2xl text-white font-bold">
                                Features
                            </p>
                        </div>

                        <p className="text-base text-subtext-in-dark-bg">
                            Features of your web application project, what your
                            web application can do, will do, will not do, will
                            have
                        </p>

                        <p className="text-base text-white">Step 4 of 4</p>
                    </div>
                </div>

                <div className="flex flex-col gap-y-4 p-4 w-full rounded-xl bg-secondary-dark text-white">
                    {features?.map((feature, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-primary-dark relative"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-transparent"
                                onClick={() => handleRemoveFeeature(index)}
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                            <h3 className="text-lg font-semibold mb-2">
                                {index + 1}. {feature.name}
                            </h3>
                            <p className="text-sm text-subtext-in-dark-bg mb-4">
                                {feature.description}
                            </p>

                            {feature?.references?.length &&
                                feature?.references?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-medium mb-2">
                                            References
                                        </h4>
                                        <div className="space-y-2">
                                            {feature?.references?.map(
                                                (ref, i) => (
                                                    <div
                                                        key={i}
                                                        className="border-[1px] border-line-in-dark-bg p-2 rounded"
                                                    >
                                                        <p className="font-medium text-sm truncate">
                                                            {ref.name}
                                                        </p>
                                                        <a
                                                            href={ref.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-500 mt-1 hover:underline"
                                                        >
                                                            {ref.url}
                                                        </a>
                                                        <p className="text-sm text-subtext-in-dark-bg">
                                                            {ref.context}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {feature?.files?.length &&
                                feature?.files?.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">
                                            Files
                                        </h4>
                                        <div className="space-y-2">
                                            {feature?.files?.map((file, i) => (
                                                <div
                                                    key={i}
                                                    className="border-[1px] border-line-in-dark-bg p-2 rounded"
                                                >
                                                    <p className="font-medium text-sm truncate">
                                                        {file.name}
                                                    </p>
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-500 mt-1 hover:underline"
                                                    >
                                                        {file.url}
                                                    </a>
                                                    <p className="text-sm text-subtext-in-dark-bg">
                                                        {file.context}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    ))}
                    <div className="self-center">
                        <AddFeatureDialog
                            onAddFeature={() => {}}
                            type="create"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-center my-8">{error}</p>
                )}

                <div className="flex w-full justify-between items-center">
                    <Button
                        className="flex items-center p-4 self-end w-fit bg-gray-500 font-medium hover:bg-gray-500/80 text-black"
                        onClick={handleBack}
                    >
                        <span>Back</span>
                    </Button>
                    <Button
                        className="flex items-center p-4 self-end w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                        onClick={handleCreateProject}
                    >
                        <span>Create Project</span>
                        {isCreatingProject && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                    </Button>
                </div>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
            </div>
        </div>
    );
};

export default CreateProjectFeaturesPage;
