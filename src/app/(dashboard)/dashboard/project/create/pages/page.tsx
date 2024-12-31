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
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Props = {};

const CreateProjectPagesPage = (props: Props) => {
    const router = useRouter();

    const handleNext = () => {
        router.push("/dashboard/project/create/features");
    };

    const handleBack = () => {
        router.push("/dashboard/project/create/branding");
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
                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                                <BreadcrumbPage className="text-white">
                                    Info
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-col gap-4 p-8 w-full rounded-xl bg-secondary-dark">
                <div>
                    <div className="flex flex-col gap-y-2 mb-8">
                        <div className="flex items-start gap-x-2">
                            <p className="text-2xl text-subtext-in-dark-bg font-bold">
                                Pages
                            </p>
                        </div>

                        <p className="text-base text-subtext-in-dark-bg">
                            Pages of your web application project
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-y-4 p-4 w-full rounded-xl bg-secondary-dark"></div>

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
