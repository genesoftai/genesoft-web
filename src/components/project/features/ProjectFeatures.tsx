"use client";

import {
    EditFeatureRequest,
    FileWithUrlFromDb,
    Feature,
    FeaturefromDb,
    ReferenceFromDb,
} from "@/types/project";
import { AddFeatureDialog } from "./AddFeatureDialog";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditFeatureDialog } from "./EditFeatureDialog";
import {
    deleteFeature,
    editFeature,
    getFeatureFiles,
    getFeatureReferenceLinks,
    getProjectById,
} from "@/actions/project";
import posthog from "posthog-js";
import SimpleLoading from "@/components/common/SimpleLoading";
import { useRouter } from "next/navigation";
import { useChannelStore } from "@/stores/channel-store";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createFeature } from "@/actions/feature";

type ProjectFeaturesProps = {
    projectId: string;
};
const componentName = "ProjectFeaturesComponent";

const ProjectFeatures = ({ projectId }: ProjectFeaturesProps) => {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { updateChannelStore } = useChannelStore();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState<{
        index: number;
        name: string;
    } | null>(null);

    useEffect(() => {
        setupFeatures();
    }, [projectId]);

    const setupFeatures = async () => {
        setIsLoading(true);
        try {
            const project = await getProjectById(projectId);
            const featuresFromDb = project.features;
            if (featuresFromDb.length > 0) {
                const transformedFeatures = await Promise.all(
                    featuresFromDb.map(async (feature: FeaturefromDb) => {
                        const referenceLinksFromDb =
                            await getFeatureReferenceLinks(
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
                        const files = filesFromDb.map(
                            (file: FileWithUrlFromDb) => {
                                return {
                                    id: file.id,
                                    name: file.name,
                                    url: file.url,
                                    context: file.description,
                                };
                            },
                        );
                        return {
                            ...feature,
                            references: references || [],
                            files: files || [],
                        };
                    }),
                );
                setFeatures(transformedFeatures);
            }
        } catch (error) {
            console.error("Error fetching project features:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDeleteFeature = (index: number) => {
        posthog.capture(
            "click_remove_feature_from_update_project_features_page",
        );
        setFeatureToDelete({
            index,
            name: features[index]?.name || "this feature",
        });
        setShowDeleteDialog(true);
    };

    const handleRemoveFeature = async () => {
        if (!featureToDelete) return;

        const featureId = features[featureToDelete.index]?.id;
        console.log({
            message: `${componentName}.handleRemoveFeature: remove feature`,
            featureId,
        });
        if (!featureId) return;
        try {
            setIsLoading(true);
            await deleteFeature({
                projectId,
                featureId,
            });
            const updatedFeatures = features?.filter(
                (_, i) => i !== featureToDelete.index,
            );
            setFeatures(updatedFeatures);
        } catch (error) {
            console.error("Error deleting feature:", error);
        } finally {
            setIsLoading(false);
            setShowDeleteDialog(false);
            setFeatureToDelete(null);
        }
    };

    const handleAddFeature = async (feature: Feature) => {
        let featureId = "";
        try {
            setIsLoading(true);
            const result = await createFeature({
                project_id: projectId,
                name: feature.name,
                description: feature.description,
            });
            featureId = result.id;
            updateChannelStore({ id: featureId, category: "feature" });
        } catch (error) {
            console.error("Error adding feature:", error);
        } finally {
            setIsLoading(false);
            router.push(
                `/dashboard/project/manage/${projectId}/features/${featureId}`,
            );
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
            await setupFeatures();
        } catch (error) {
            console.error("Error editing feature:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex gap-x-4 mt-4 items-center justify-center bg-primary-dark rounded-xl">
                <p className="text-white text-xl font-bold">
                    Loading Project Features
                </p>
                <SimpleLoading color="#2563EB" size={30} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4 p-4 md:p-8 w-full rounded-xl bg-primary-dark text-white">
            <p className="text-2xl text-white font-bold">Project Features</p>
            {features?.map((feature, index) => (
                <div
                    key={index}
                    className="p-4 rounded-lg bg-secondary-dark relative"
                >
                    <div className="flex w-fit items-center justify-between absolute top-2 right-2">
                        <EditFeatureDialog
                            feature={feature}
                            onEditFeature={(payload: EditFeatureRequest) =>
                                handleEditFeature(feature?.id || "", payload)
                            }
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-transparent"
                            onClick={() => confirmDeleteFeature(index)}
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 pr-20 break-words">
                        {index + 1}. {feature.name}
                    </h3>
                    <p className="text-sm text-subtext-in-dark-bg mb-4 break-words">
                        {feature.description}
                    </p>

                    {(feature.references?.length ?? 0) > 0 && (
                        <div className="mb-4">
                            <h4 className="font-medium mb-2">References</h4>
                            <div className="space-y-2">
                                {feature.references?.map((ref, i) => (
                                    <div
                                        key={i}
                                        className="border-[1px] border-line-in-dark-bg p-2 rounded w-full overflow-hidden"
                                    >
                                        <p className="font-medium text-sm break-words">
                                            {ref.name}
                                        </p>
                                        <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-500 mt-1 hover:underline break-all inline-block max-w-full"
                                        >
                                            {ref.url}
                                        </a>
                                        <p className="text-sm text-subtext-in-dark-bg break-words">
                                            {ref.context}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(feature.files?.length ?? 0) > 0 && (
                        <div>
                            <h4 className="font-medium mb-2">Files</h4>
                            <div className="space-y-2">
                                {feature.files?.map((file, i) => (
                                    <div
                                        key={i}
                                        className="border-[1px] border-line-in-dark-bg p-2 rounded overflow-hidden"
                                    >
                                        <p className="font-medium text-sm break-words">
                                            {file.name}
                                        </p>
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-500 mt-1 hover:underline break-all inline-block max-w-full"
                                        >
                                            {file.url}
                                        </a>
                                        <p className="text-sm text-subtext-in-dark-bg break-words">
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
                    onAddFeature={(feature: Feature) =>
                        handleAddFeature(feature)
                    }
                    type="update"
                />
            </div>

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent className="bg-primary-dark border-line-in-dark-bg text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Feature</AlertDialogTitle>
                        <AlertDialogDescription className="text-subtext-in-dark-bg">
                            Are you sure you want to delete &quot;
                            {featureToDelete?.name}&quot;? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-secondary-dark text-white border-line-in-dark-bg hover:bg-secondary-dark/80 hover:text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoveFeature}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ProjectFeatures;
