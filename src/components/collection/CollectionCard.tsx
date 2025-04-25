import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Collection } from "@/types/collection";
import { Project } from "@/types/project";
import { getProjectById, getProjects } from "@/actions/project";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/project/ProjectCard";
import ManageCollectionDialog from "./ManageCollectionDialog";
import { Loader2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCollection } from "@/actions/collection";

interface CollectionCardProps {
    collectionProps: Collection;
}

export function CollectionCard({ collectionProps }: CollectionCardProps) {
    const [webProject, setWebProject] = useState<Project | null>(null);
    const [backendProjects, setBackendProjects] = useState<Project[]>([]);
    const [collection, setCollection] = useState<Collection>(collectionProps);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const setUpCollection = async () => {
        setLoading(true);
        try {
            if (collection.web_project_id) {
                const webProject = await getProjectById(
                    collection.web_project_id,
                );
                setWebProject(webProject);
            }

            if (
                collection.backend_service_project_ids &&
                collection.backend_service_project_ids.length > 0
            ) {
                const backendProjects = await getProjects(
                    collection.backend_service_project_ids,
                );
                setBackendProjects(backendProjects);
            }
        } catch (error) {
            console.error("Error loading collection projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const onUpdateCollection = async (updatedCollection: Collection) => {
        console.log({
            message: "onUpdateCollection",
            updatedCollection,
        });
        setCollection(updatedCollection);
        setWebProject(null);
        setBackendProjects([]);
        await setUpCollectionFromUpdatedCollection(updatedCollection);
    };

    const setUpCollectionFromUpdatedCollection = async (
        updatedCollection: Collection,
    ) => {
        setLoading(true);
        try {
            if (updatedCollection.web_project_id) {
                const webProject = await getProjectById(
                    updatedCollection.web_project_id,
                );
                setWebProject(webProject);
            }

            if (updatedCollection.backend_service_project_ids) {
                const backendProjects = await getProjects(
                    updatedCollection.backend_service_project_ids,
                );
                setBackendProjects(backendProjects);
            }
        } catch (error) {
            console.error("Error loading collection projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCollection = async () => {
        setIsDeleting(true);
        try {
            await deleteCollection(collection.id);
        } catch (error) {
            console.error("Error deleting collection:", error);
        } finally {
            setIsDeleting(false);
            setOpen(false);
            window.location.reload();
        }
    };

    useEffect(() => {
        setUpCollection();
    }, [collection.id]);

    return (
        <Card className="w-full md:w-8/12 h-8/12 md:h-auto bg-primary-dark text-white flex flex-col border-none mb-4 md:mb-0">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col items-start gap-2">
                    <CardTitle className="text-base md:text-xl flex flex-row items-center gap-2 justify-between">
                        <div className="flex flex-col items-start gap-2">
                            <span className="text-lg md:text-xl font-bold">
                                {collection.name}
                            </span>
                        </div>
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base mt-2">
                        {collection.description}
                    </CardDescription>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Trash2 size={16} className="cursor-pointer" />
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-primary-dark text-white border-none">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete Collection
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this
                                    collection? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-secondary-dark text-white border-none">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={handleDeleteCollection}
                                >
                                    {isDeleting ? (
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        "Delete"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <Separator className="w-full bg-secondary-dark" />

            <CardContent className="pt-6">
                <Tabs defaultValue="web" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4 bg-secondary-dark">
                        <TabsTrigger value="web">Web Application</TabsTrigger>
                        <TabsTrigger value="backend">
                            Backend Service
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="web" className="mt-2">
                        {loading ? (
                            <div className="text-center py-4 text-subtext-in-dark-bg">
                                Loading web project...
                            </div>
                        ) : webProject ? (
                            <div className="bg-secondary-dark/50 rounded-lg p-4 w-full items-center flex justify-center">
                                {webProject && (
                                    <ProjectCard
                                        id={webProject.id}
                                        name={webProject.name}
                                        description={webProject.description}
                                        purpose={webProject.purpose || ""}
                                        target_audience={
                                            webProject.target_audience || ""
                                        }
                                        project_template_type={
                                            webProject.project_template_type ||
                                            "frontend_nextjs"
                                        }
                                        backend_requirements={
                                            webProject.backend_requirements ||
                                            ""
                                        }
                                        collectionId={collection.id}
                                        created_at={webProject.created_at}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-subtext-in-dark-bg">
                                No Web Project Found
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="backend" className="mt-2">
                        {loading ? (
                            <div className="text-center py-4 text-subtext-in-dark-bg">
                                Loading backend services...
                            </div>
                        ) : backendProjects.length > 0 ? (
                            <div className="space-y-4">
                                {backendProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="bg-secondary-dark/50 rounded-lg p-4 w-full items-center flex justify-center"
                                    >
                                        <ProjectCard
                                            id={project.id}
                                            name={project.name}
                                            description={project.description}
                                            purpose={project.purpose || ""}
                                            target_audience={
                                                project.target_audience || ""
                                            }
                                            project_template_type={
                                                project.project_template_type ||
                                                "backend_nestjs"
                                            }
                                            backend_requirements={
                                                project.backend_requirements ||
                                                ""
                                            }
                                            collectionId={collection.id}
                                            created_at={project.created_at}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-subtext-in-dark-bg">
                                No Backend Services Found
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CardFooter className="flex justify-end md:justify-start self-center md:self-end mt-4">
                <ManageCollectionDialog
                    collection={collection}
                    onUpdateCollection={onUpdateCollection}
                    webProject={webProject as Project}
                    backendProjects={backendProjects as Project[]}
                />
            </CardFooter>
        </Card>
    );
}
