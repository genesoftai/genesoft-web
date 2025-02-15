"use client";

import React from "react";
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
import { Files, Trash2 } from "lucide-react";
import { AddPageDialog } from "@/components/project/pages/AddPageDialog";
import { useCreateProjectStore } from "@/stores/create-project-store";
import posthog from "posthog-js";

const CreateProjectPagesPage = () => {
    posthog.capture("pageview_create_project_pages");
    const router = useRouter();
    const { pages, updateCreateProjectStore } = useCreateProjectStore();

    const handleNext = () => {
        posthog.capture("click_next_from_create_project_pages_page");
        router.push("/dashboard/project/create/features");
    };

    const handleBack = () => {
        posthog.capture("click_back_from_create_project_pages_page");
        router.push("/dashboard/project/create/branding");
    };

    const handleRemovePage = (index: number) => {
        posthog.capture("click_remove_page_from_create_project_pages_page");
        const updatedPages = pages?.filter((_, i) => i !== index);
        updateCreateProjectStore({ pages: updatedPages });
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
                            Pages of your web application project
                        </p>

                        <p className="text-base text-white">Step 3 of 4</p>
                    </div>
                </div>

                <div className="flex flex-col gap-y-4 p-4 w-full rounded-xl bg-secondary-dark text-white">
                    {pages?.map((page, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-primary-dark relative"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-transparent"
                                onClick={() => handleRemovePage(index)}
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                            <h3 className="text-lg font-semibold mb-2">
                                {index + 1}. {page.name}
                            </h3>
                            <p className="text-sm text-subtext-in-dark-bg mb-4">
                                {page.description}
                            </p>

                            {page.references.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">
                                        References
                                    </h4>
                                    <div className="space-y-2">
                                        {page.references.map((ref, i) => (
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
                                        ))}
                                    </div>
                                </div>
                            )}

                            {page.files.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Files</h4>
                                    <div className="space-y-2">
                                        {page.files.map((file, i) => (
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
                        <AddPageDialog onAddPage={() => {}} type="create" />
                    </div>
                </div>

                <div className="flex w-full justify-between items-center">
                    <Button
                        className="flex items-center p-4 self-end w-fit bg-gray-500 font-medium hover:bg-gray-500/80 text-black"
                        onClick={handleBack}
                    >
                        <span>Back</span>
                    </Button>
                    <Button
                        className="flex items-center p-4 self-end w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                        onClick={handleNext}
                    >
                        <span>Next</span>
                    </Button>
                </div>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
            </div>
        </div>
    );
};

export default CreateProjectPagesPage;
