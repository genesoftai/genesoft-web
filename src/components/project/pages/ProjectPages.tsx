"use client";

import {
    EditPageRequest,
    FileWithUrlFromDb,
    Page,
    PagefromDb,
    ReferenceFromDb,
} from "@/types/project";
import { AddPageDialog } from "./AddPageDialog";

import React, { useEffect, useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditPageDialog } from "./EditPageDialog";
import {
    deletePage,
    editPage,
    getPageFiles,
    getPageReferenceLinks,
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
import { createPage } from "@/actions/page";

type ProjectPagesProps = {
    projectId: string;
};
const componentName = "ProjectPagesComponent";

const ProjectPages = ({ projectId }: ProjectPagesProps) => {
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageToDelete, setPageToDelete] = useState<{
        index: number;
        name: string;
    } | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();
    const { updateChannelStore } = useChannelStore();

    useEffect(() => {
        setupPages();
    }, [projectId]);

    const setupPages = async () => {
        setIsLoading(true);
        try {
            const project = await getProjectById(projectId);
            const pagesFromDb = project.pages;
            if (pagesFromDb.length > 0) {
                const transformedPages = await Promise.all(
                    pagesFromDb.map(async (page: PagefromDb) => {
                        const referenceLinksFromDb =
                            await getPageReferenceLinks(projectId, page.id);
                        const filesFromDb = await getPageFiles(
                            projectId,
                            page.id,
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
                            ...page,
                            references: references || [],
                            files: files || [],
                        };
                    }),
                );
                setPages(transformedPages);
            }
        } catch (error) {
            console.error("Error fetching project pages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDeletePage = (index: number) => {
        posthog.capture("click_remove_page_from_update_project_pages_page");
        setPageToDelete({ index, name: pages[index]?.name || "this page" });
        setShowDeleteDialog(true);
    };

    const handleRemovePage = async () => {
        if (!pageToDelete) return;

        const pageId = pages[pageToDelete.index]?.id;
        console.log({
            message: `${componentName}.handleRemovePage: remove page`,
            pageId,
        });
        if (!pageId) return;

        try {
            setIsLoading(true);
            await deletePage({
                projectId,
                pageId,
            });
            const updatedPages = pages?.filter(
                (_, i) => i !== pageToDelete.index,
            );
            setPages(updatedPages);
        } catch (error) {
            console.error("Error deleting page:", error);
        } finally {
            setIsLoading(false);
            setShowDeleteDialog(false);
            setPageToDelete(null);
        }
    };

    const handleAddPage = async (page: Page) => {
        let pageId = "";
        try {
            setIsLoading(true);
            const result = await createPage({
                project_id: projectId,
                name: page.name,
                description: page.description,
            });
            pageId = result.id;
            updateChannelStore({ id: pageId, category: "page" });
        } catch (error) {
            console.error("Error adding page:", error);
        } finally {
            setIsLoading(false);
            router.push(
                `/dashboard/project/manage/${projectId}/pages/${pageId}`,
            );
        }
    };

    const handleEditPage = async (pageId: string, payload: EditPageRequest) => {
        try {
            setIsLoading(true);
            await editPage({
                projectId,
                pageId,
                payload,
            });
            await setupPages();
        } catch (error) {
            console.error("Error editing page:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectPage = (pageId: string) => {
        updateChannelStore({ id: pageId, category: "page" });
        router.push(`/dashboard/project/manage/${projectId}/pages/${pageId}`);
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex gap-x-4 mt-4 items-center justify-center bg-primary-dark rounded-xl">
                <p className="text-white text-xl font-bold">
                    Loading Project pages
                </p>
                <SimpleLoading color="#2563EB" size={30} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4 p-4 md:p-8 w-full rounded-xl bg-primary-dark text-white">
            <p className="text-2xl text-white font-bold">Project Pages</p>
            {pages?.map((page, index) => (
                <div
                    key={index}
                    className="p-4 rounded-lg bg-secondary-dark relative"
                >
                    <div className="flex w-fit items-center justify-between absolute top-2 right-2">
                        <EditPageDialog
                            page={page}
                            onEditPage={(payload: EditPageRequest) =>
                                handleEditPage(page?.id || "", payload)
                            }
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className=" text-red-500 hover:text-red-600 hover:bg-transparent"
                            onClick={() => confirmDeletePage(index)}
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSelectPage(page.id || "")}
                        >
                            <ExternalLink className="h-5 w-5" />
                        </Button>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 pr-20 break-words">
                        {index + 1}. {page.name}
                    </h3>
                    <p className="text-sm text-subtext-in-dark-bg mb-4 break-words">
                        {page.description}
                    </p>

                    {page?.references?.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-medium mb-2">References</h4>
                            <div className="space-y-2">
                                {page?.references?.map((ref, i) => (
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

                    {page?.files?.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-2">Files</h4>
                            <div className="space-y-2">
                                {page?.files?.map((file, i) => (
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
                <AddPageDialog
                    onAddPage={(page: Page) => handleAddPage(page)}
                    type="update"
                />
            </div>

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent className="bg-primary-dark border-line-in-dark-bg text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Page</AlertDialogTitle>
                        <AlertDialogDescription className="text-subtext-in-dark-bg">
                            Are you sure you want to delete &quot;
                            {pageToDelete?.name}&quot;? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-secondary-dark text-white border-line-in-dark-bg hover:bg-secondary-dark/80 hover:text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemovePage}
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

export default ProjectPages;
