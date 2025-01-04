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
import { useParams, useRouter } from "next/navigation";
import { Files, Trash2 } from "lucide-react";
import { AddPageDialog } from "@/components/project/pages/AddPageDialog";
import {
    addPage,
    deletePage,
    editPage,
    getPageFiles,
    getPageReferenceLinks,
    getProjectById,
} from "@/actions/project";
import {
    EditPageRequest,
    FileWithUrlFromDb,
    Page,
    PagefromDb,
    ReferenceFromDb,
} from "@/types/project";
import { EditPageDialog } from "@/components/project/pages/EditPageDialog";
import PageLoading from "@/components/common/PageLoading";

const pageName = "UpdateProjectPagesPage";

const UpdateProjectPagesPage = () => {
    const pathParams = useParams();
    const router = useRouter();
    const [pages, setPages] = useState<Page[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [projectId, setProjectId] = useState<string>("");

    useEffect(() => {
        const { projectId } = pathParams;
        setProjectId(projectId as string);
    }, [pathParams]);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    const setupProject = async () => {
        setIsLoading(true);
        const project = await getProjectById(projectId);
        if (project?.pages && project?.pages?.length > 0) {
            await setupPages(project.pages);
        }
        setIsLoading(false);
    };

    const setupPages = async (pagesFromDb: PagefromDb[]) => {
        if (pagesFromDb.length > 0) {
            const transformedPages = await Promise.all(
                pagesFromDb.map(async (page) => {
                    const referenceLinksFromDb = await getPageReferenceLinks(
                        projectId,
                        page.id,
                    );
                    const filesFromDb = await getPageFiles(projectId, page.id);
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
                        ...page,
                        references: references || [],
                        files: files || [],
                    };
                }),
            );
            setPages(transformedPages);
        }
    };

    const handleRemovePage = async (index: number) => {
        const pageId = pages[index]?.id;
        console.log({
            message: `${pageName}.handleRemovePage: remove page`,
            pageId,
        });
        if (!pageId) return;
        try {
            await deletePage({
                projectId,
                pageId,
            });
            const updatedPages = pages?.filter((_, i) => i !== index);
            setPages(updatedPages);
        } catch (error) {
            console.error("Error deleting page:", error);
        }
    };

    const handleBack = () => {
        router.push(`/dashboard/project/manage/${projectId}`);
    };

    const handleAddPage = async (page: Page) => {
        try {
            setIsLoading(true);
            await addPage({
                projectId,
                payload: {
                    name: page.name,
                    description: page.description,
                    file_ids: page.files.map((file) => file.id || ""),
                    reference_link_ids: page.references.map(
                        (ref) => ref.id || "",
                    ),
                },
            });
            await setupProject();
        } catch (error) {
            console.error("Error adding page:", error);
        } finally {
            setIsLoading(false);
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
            await setupProject();
        } catch (error) {
            console.error("Error editing page:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <PageLoading size={50} text={"Loading your project pages..."} />;
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
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white">
                                    Pages
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
                            <Files className="w-6 h-6 text-white" />
                            <p className="text-2xl text-white font-bold">
                                Pages
                            </p>
                        </div>

                        <p className="text-base text-subtext-in-dark-bg">
                            View and update your web application pages
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-y-4 p-4 w-full rounded-xl bg-secondary-dark text-white">
                    {pages?.map((page, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-primary-dark relative"
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
                                    onClick={() => handleRemovePage(index)}
                                >
                                    <Trash2 className="h-5 w-5" />
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
                                    <h4 className="font-medium mb-2">
                                        References
                                    </h4>
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

export default UpdateProjectPagesPage;
