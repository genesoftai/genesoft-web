"use client";

import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbPage,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MonitorCog, Trash2 } from "lucide-react";
import {
    addFeature,
    deleteFeature,
    editFeature,
    getFeatureFiles,
    getFeatureReferenceLinks,
    getProjectById,
} from "@/actions/project";
import { AddFeatureDialog } from "@/components/project/features/AddFeatureDialog";
import {
    Feature,
    FeaturefromDb,
    FileWithUrlFromDb,
    ReferenceFromDb,
    EditFeatureRequest,
} from "@/types/project";
import { EditFeatureDialog } from "@/components/project/features/EditFeatureDialog";
import PageLoading from "@/components/common/PageLoading";
const pageName = "UpdateProjectFeaturesPage";

const UpdateProjectFeaturesPage = ({
    params,
}: {
    params: { projectId: string };
}) => {
    const router = useRouter();
    const { projectId } = params;
    const [features, setFeatures] = useState<Feature[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    const setupProject = async () => {
        try {
            setIsLoading(true);
            const project = await getProjectById(projectId);
            if (project?.features && project?.features?.length > 0) {
                await setupFeatures(project.features);
            }
        } catch (error) {
            console.error("Error setting up project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const setupFeatures = async (featuresFromDb: FeaturefromDb[]) => {
        if (featuresFromDb.length > 0) {
            const transformedFeatures = await Promise.all(
                featuresFromDb.map(async (feature) => {
                    const referenceLinksFromDb = await getFeatureReferenceLinks(
                        projectId,
                        feature.id,
                    );
                    const filesFromDb = await getFeatureFiles(
                        projectId,
                        feature.id,
                    );
                    const references = referenceLinksFromDb.map(
                        (ref: ReferenceFromDb) => {
                            return {
                                id: ref.id,
                                name: ref.name,
                                url: ref.url,
                                context: ref.description,
                            };
                        },
                    );
                    const files = filesFromDb.map((file: FileWithUrlFromDb) => {
                        return {
                            id: file.id,
                            name: file.name,
                            url: file.url,
                            context: file.description,
                        };
                    });
                    return {
                        ...feature,
                        references: references || [],
                        files: files || [],
                    };
                }),
            );
            setFeatures(transformedFeatures);
        }
    };

    const handleRemoveFeature = async (index: number) => {
        try {
            await deleteFeature({
                projectId,
                featureId: features[index].id,
            });
            const updatedFeatures = features?.filter((_, i) => i !== index);
            setFeatures(updatedFeatures);
        } catch (error) {
            console.error("Error removing feature:", error);
        }
    };

    const handleEditFeature = async (
        featureId: string,
        payload: EditFeatureRequest,
    ) => {
        try {
            setIsLoading(true);
            await editFeature({
                projectId,
                featureId,
                payload,
            });
            await setupProject();
        } catch (error) {
            console.error("Error editing feature:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddFeature = async (feature: Feature) => {
        try {
            setIsLoading(true);
            await addFeature({
                projectId,
                payload: {
                    name: feature.name,
                    description: feature.description,
                    file_ids: feature.files?.map((file) => file.id || "") || [],
                    reference_link_ids:
                        feature.references?.map((ref) => ref.id || "") || [],
                },
            });
            await setupProject();
        } catch (error) {
            console.error("Error adding feature:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        router.push(`/dashboard/project/manage/${projectId}`);
    };

    if (isLoading) {
        return <PageLoading size={50} text="Loading Project Features..." />;
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
                            View and update your web application features
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-y-4 p-4 w-full rounded-xl bg-secondary-dark text-white">
                    {features?.map((feature, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-primary-dark relative"
                        >
                            <div className="flex w-fit items-center justify-between absolute top-2 right-2">
                                <EditFeatureDialog
                                    feature={feature}
                                    onEditFeature={(
                                        payload: EditFeatureRequest,
                                    ) =>
                                        handleEditFeature(
                                            feature?.id || "",
                                            payload,
                                        )
                                    }
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-transparent"
                                    onClick={() => handleRemoveFeature(index)}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                {index + 1}. {feature.name}
                            </h3>
                            <p className="text-sm text-subtext-in-dark-bg mb-4">
                                {feature.description}
                            </p>

                            {feature?.references &&
                                feature?.references?.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-medium mb-2">
                                            References
                                        </h4>
                                        <div className="space-y-2">
                                            {feature.references.map(
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

                            {feature?.files && feature?.files?.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Files</h4>
                                    <div className="space-y-2">
                                        {feature.files.map((file, i) => (
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
                            onAddFeature={(feature: Feature) => {
                                handleAddFeature(feature);
                            }}
                            type="update"
                        />
                    </div>
                </div>

                <Button
                    className="flex items-center p-4 self-start w-fit bg-gray-500 font-medium hover:bg-gray-500/80 text-black"
                    onClick={handleBack}
                >
                    <span>Back</span>
                </Button>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
            </div>
        </div>
    );
};

export default UpdateProjectFeaturesPage;
