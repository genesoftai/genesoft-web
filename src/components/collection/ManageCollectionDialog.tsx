"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collection } from "@/types/collection";
import posthog from "posthog-js";
import { Project } from "@/types/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrganizationProjects } from "@/actions/organization";
import Image from "next/image";
import NextjsLogo from "@public/tech/nextjs.jpeg";
import NestjsLogo from "@public/tech/nestjs.svg";
import { getFirstCharacterUppercase } from "@/utils/common/text";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
    addBackendProjectIntoCollection,
    changeWebProjectInCollection,
    getAvailableWebProjectsForOrganization,
    removeBackendProjectFromCollection,
    removeWebProjectFromCollection,
    updateCollection,
} from "@/actions/collection";

interface ManageCollectionDialogProps {
    collection: Collection;
    onUpdateCollection: (updatedCollection: Collection) => void;
    webProject: Project;
    backendProjects: Project[];
}

const ManageCollectionDialog = ({
    collection,
    onUpdateCollection,
    webProject,
    backendProjects,
}: ManageCollectionDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(collection.name);
    const [description, setDescription] = useState(collection.description);
    const [error, setError] = useState<string | null>(null);
    const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [availableWebProjects, setAvailableWebProjects] = useState<Project[]>(
        [],
    );

    useEffect(() => {
        if (open) {
            fetchAvailableProjects();
            setupAvailableWebProjects();
        }
    }, [open]);

    const fetchAvailableProjects = async () => {
        try {
            // Assuming getOrganizationCollections returns projects as well
            // In a real implementation, you would use a proper API call to get all projects
            console.log(
                "fetching available projects",
                collection.organization_id,
            );
            const organizationProjects = await getOrganizationProjects(
                collection.organization_id,
            );
            console.log("organizationProjects", organizationProjects);
            const existingProjectIds = [
                ...backendProjects.map((p) => p.id),
                ...(webProject ? [webProject.id] : []),
            ];
            setAvailableProjects(
                organizationProjects.filter(
                    (p: Project) => !existingProjectIds.includes(p.id),
                ),
            );
        } catch (error) {
            console.error("Error fetching available projects:", error);
        }
    };

    const handleUpdateCollection = async () => {
        posthog.capture("click_save_changes_from_manage_collection_dialog");
        setError(null);

        try {
            const updatedCollection = await updateCollection({
                collectionId: collection.id,
                payload: {
                    name,
                    description,
                },
            });
            console.log({
                message: "updatedCollection",
                updatedCollection,
            });
            onUpdateCollection(updatedCollection);

            setOpen(false);
        } catch (err) {
            console.error("Error updating collection:", err);
            setError("Failed to update collection");
        }
    };
    const handleRemoveBackendProject = async (projectId: string) => {
        setLoading(true);
        try {
            // Remove backend project from collection
            const updatedCollection = await removeBackendProjectFromCollection(
                collection.id,
                projectId,
            );
            onUpdateCollection(updatedCollection);
        } catch (error) {
            console.error("Error removing backend project:", error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleRemoveWebProject = async () => {
        setLoading(true);
        try {
            // Remove web project from collection
            const updatedCollection = await removeWebProjectFromCollection(
                collection.id,
            );
            onUpdateCollection(updatedCollection);
        } catch (error) {
            console.error("Error removing web project:", error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleAddBackendProject = async (projectId: string) => {
        setLoading(true);
        try {
            const updatedCollection = await addBackendProjectIntoCollection(
                collection.id,
                projectId,
            );
            console.log({
                message: "updatedCollection for handleAddBackendProject",
                updatedCollection,
            });
            onUpdateCollection(updatedCollection);
        } catch (error) {
            console.error("Error adding backend project:", error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleAddWebProject = async (projectId: string) => {
        setLoading(true);
        try {
            const updatedCollection = await changeWebProjectInCollection(
                collection.id,
                projectId,
            );
            onUpdateCollection(updatedCollection);
        } catch (error) {
            console.error("Error adding web project:", error);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const renderProjectCard = (
        project: Project,
        isBackend: boolean = false,
        showActions: boolean = false,
    ) => {
        const projectType = project.project_template_type?.startsWith("backend")
            ? "backend"
            : "frontend";

        return (
            <div className="bg-primary-dark rounded-lg p-4 mb-4 border border-secondary-dark w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-lg font-bold">{project.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-subtext-in-dark-bg">
                                {getFirstCharacterUppercase(projectType)}
                            </span>
                            <span className="text-xs text-subtext-in-dark-bg">
                                {project.project_template_type
                                    ?.split("_")[1]
                                    ?.toUpperCase() || ""}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {projectType === "backend" ? (
                            <Image
                                src={NestjsLogo}
                                alt="Nestjs Logo"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                        ) : (
                            <Image
                                src={NextjsLogo}
                                alt="Nextjs Logo"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                        )}
                        {showActions &&
                            (isBackend ? (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        handleRemoveBackendProject(project.id)
                                    }
                                    className="ml-2 h-8 w-8 p-0"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            ) : (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveWebProject()}
                                    className="ml-2 text-xs"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            ))}
                    </div>
                </div>
                <p className="text-sm mt-2 text-subtext-in-dark-bg">
                    {projectType === "backend"
                        ? "Backend Requirements:"
                        : "Description:"}
                </p>
                <p className="text-xs text-subtext-in-dark-bg">
                    {projectType === "backend"
                        ? project.backend_requirements
                        : project.description}
                </p>
            </div>
        );
    };

    const getAvailableBackendProjects = () => {
        return availableProjects.filter((p) =>
            p.project_template_type?.startsWith("backend"),
        );
    };

    const setupAvailableWebProjects = async () => {
        try {
            const availableWebProjects =
                await getAvailableWebProjectsForOrganization(
                    collection.organization_id,
                );
            setAvailableWebProjects(availableWebProjects);
        } catch (error) {
            console.error("Error fetching available web projects:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-genesoft text-white rounded-lg text-xs md:text-base">
                    <span className="text-xs md:text-base">
                        Edit Collection
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll flex flex-col bg-primary-dark text-white border-none">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Edit Collection
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Collection Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter collection name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Collection Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the purpose and contents of this collection"
                                className="min-h-[100px] break-words"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-fit self-center bg-genesoft text-white px-2 py-4"
                            size="lg"
                            onClick={handleUpdateCollection}
                        >
                            Save Changes
                        </Button>
                    </div>

                    <Tabs defaultValue="web" className="w-full">
                        <TabsList className="grid grid-cols-2 mb-4 bg-secondary-dark">
                            <TabsTrigger value="web">
                                Web Application
                            </TabsTrigger>
                            <TabsTrigger value="backend">
                                Backend Service
                            </TabsTrigger>
                        </TabsList>

                        {loading ? (
                            <div className="flex items-center gap-2 text-sm text-subtext-in-white-bg w-full justify-center">
                                <span className="text-white text-sm md:text-base">
                                    Editing collection...
                                </span>
                                <Loader2
                                    className="animate-spin text-genesoft"
                                    size={16}
                                />
                            </div>
                        ) : (
                            <div>
                                <TabsContent
                                    value="web"
                                    className="mt-2 space-y-4"
                                >
                                    <h3 className="text-lg font-semibold">
                                        Current Web Project
                                    </h3>
                                    {webProject ? (
                                        renderProjectCard(
                                            webProject,
                                            false,
                                            true,
                                        )
                                    ) : (
                                        <p className="text-sm text-subtext-in-white-bg">
                                            No Web Project selected. Please add
                                            one from available projects.
                                        </p>
                                    )}

                                    {!webProject && (
                                        <div>
                                            <h3 className="text-lg font-semibold mt-4">
                                                Available Web Projects
                                            </h3>
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                {availableWebProjects.length >
                                                0 ? (
                                                    availableWebProjects.map(
                                                        (project) => (
                                                            <div
                                                                key={project.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                {renderProjectCard(
                                                                    project,
                                                                    false,
                                                                    false,
                                                                )}
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleAddWebProject(
                                                                            project.id,
                                                                        )
                                                                    }
                                                                    className="ml-2 h-8 w-8 p-0 text-xs bg-green-500"
                                                                >
                                                                    <Plus
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <p className="text-sm text-subtext-in-white-bg">
                                                        No available web
                                                        projects found.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent
                                    value="backend"
                                    className="mt-2 space-y-4"
                                >
                                    <h3 className="text-lg font-semibold">
                                        Current Backend Services
                                    </h3>
                                    <div className="space-y-2">
                                        {backendProjects.length > 0 ? (
                                            backendProjects.map((project) => (
                                                <div key={project.id}>
                                                    {renderProjectCard(
                                                        project,
                                                        true,
                                                        true,
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-subtext-in-white-bg">
                                                No backend services associated
                                                with this collection.
                                            </p>
                                        )}
                                    </div>

                                    {backendProjects.length == 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mt-4">
                                                Available Backend Services
                                            </h3>
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                {getAvailableBackendProjects()
                                                    .length > 0 ? (
                                                    getAvailableBackendProjects().map(
                                                        (project) => (
                                                            <div
                                                                key={project.id}
                                                                className="flex items-center gap-2"
                                                            >
                                                                {renderProjectCard(
                                                                    project,
                                                                    true,
                                                                    false,
                                                                )}
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleAddBackendProject(
                                                                            project.id,
                                                                        )
                                                                    }
                                                                    className="ml-2 h-8 w-8 p-0 text-xs bg-green-500"
                                                                >
                                                                    <Plus
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <p className="text-sm text-subtext-in-white-bg">
                                                        No available backend
                                                        services found.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        )}
                    </Tabs>
                </div>

                {error && (
                    <div className="text-red-500 text-sm self-center break-words">
                        {error}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ManageCollectionDialog;
