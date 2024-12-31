"use client";

import React, { useState } from "react";
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
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProjectStore } from "@/stores/create-project-store";

const CreateProjectInfoPage = () => {
    const router = useRouter();
    const {
        name,
        description,
        purpose,
        target_audience,
        updateCreateProjectStore,
    } = useCreateProjectStore();

    const [projectName, setProjectName] = useState(name);
    const [projectDescription, setProjectDescription] = useState(description);
    const [projectPurpose, setProjectPurpose] = useState(purpose);
    const [projectTargetAudience, setProjectTargetAudience] =
        useState(target_audience);

    const handleNext = () => {
        updateCreateProjectStore({
            name: projectName,
            description: projectDescription,
            purpose: projectPurpose,
            target_audience: projectTargetAudience,
        });
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
                                <BreadcrumbSeparator />
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
                        <div className="flex items-center gap-x-2">
                            <Info className="w-6 h-6 text-white" />
                            <p className="text-2xl text-white font-bold">
                                Basic Information
                            </p>
                        </div>

                        <p className="text-base text-subtext-in-dark-bg">
                            Basic information of your web application project
                        </p>

                        <p className="text-base text-white">Step 1 of 4</p>
                    </div>
                </div>

                <div className="flex flex-col gap-y-4 p-4 w-full rounded-xl bg-secondary-dark">
                    <div className="grid w-full max-w-sm items-center gap-1.5 text-subtext-in-dark-bg">
                        <Label
                            className="text-xl font-bold flex items-center gap-x-4"
                            htmlFor="name"
                        >
                            <span>Project Name</span>
                            <span className="text-xs">(required)</span>
                        </Label>
                        <Input
                            type="text"
                            id="name"
                            placeholder="Enter name of your project"
                            className="border-tertiary-dark bg-neutral-700 w-8/12"
                            required
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full gap-1.5 text-subtext-in-dark-bg">
                        <Label
                            className="text-xl font-bold flex items-center gap-x-4"
                            htmlFor="description"
                        >
                            <span>Project Description</span>
                            <span className="text-xs">(required)</span>
                        </Label>
                        <Textarea
                            placeholder="Enter description of your project"
                            id="description"
                            className="border-tertiary-dark bg-neutral-700 w-full"
                            required
                            value={projectDescription}
                            onChange={(e) =>
                                setProjectDescription(e.target.value)
                            }
                        />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5 text-subtext-in-dark-bg">
                        <Label
                            className="text-xl font-bold flex items-center gap-x-4"
                            htmlFor="purpose"
                        >
                            <span>Purpose</span>
                            <span className="text-xs">(required)</span>
                        </Label>
                        <Textarea
                            placeholder="Enter purpose of your project, How it should be so it can help your users"
                            id="purpose"
                            className="border-tertiary-dark bg-neutral-700 w-full"
                            required
                            value={projectPurpose}
                            onChange={(e) => setProjectPurpose(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full gap-1.5 text-subtext-in-dark-bg">
                        <Label
                            className="text-xl font-bold flex items-center gap-x-4"
                            htmlFor="target-audience"
                        >
                            <span>Target Audience</span>
                            <span className="text-xs">(required)</span>
                        </Label>
                        <span className="text-xs text-subtext-in-dark-bg"></span>
                        <Textarea
                            placeholder="Enter target audience (users) of your project, who will use your project"
                            id="target-audience"
                            className="border-tertiary-dark bg-neutral-700 w-full"
                            required
                            value={projectTargetAudience}
                            onChange={(e) =>
                                setProjectTargetAudience(e.target.value)
                            }
                        />
                    </div>
                </div>

                <Button
                    className="flex items-center p-4 self-end w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                    onClick={handleNext}
                >
                    <span>Next</span>
                </Button>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
            </div>
        </div>
    );
};

export default CreateProjectInfoPage;
