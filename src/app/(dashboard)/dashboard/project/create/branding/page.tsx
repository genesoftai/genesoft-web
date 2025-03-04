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
import { Eye, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useCreateProjectStore } from "@/stores/create-project-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UploadLogo from "@/components/project/branding/UploadLogo";
import { RGBColor, SketchPicker } from "react-color";
import { Textarea } from "@/components/ui/textarea";
import { hexToRgba, rgbaToHex } from "@/utils/common/color";
import posthog from "posthog-js";
import { CreateProjectRequest } from "@/types/project";
import { createProject } from "@/actions/project";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";

const pageName = "CreateProjectBrandingPage";

const CreateProjectBrandingPage = () => {
    posthog.capture("pageview_create_project_branding");
    const router = useRouter();
    const {
        name,
        description,
        purpose,
        target_audience,
        branding,
        clearCreateProjectStore,
    } = useCreateProjectStore();
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    // const { organization } = useGenesoftUserStore();
    const { id: organizationId } = useGenesoftOrganizationStore();
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => {
        posthog.capture("click_back_from_create_project_branding_page");
        router.push("/dashboard/project/create/info");
    };

    const handleCreateProject = async () => {
        posthog.capture(
            "click_create_project_from_create_project_branding_page",
        );
        setIsCreatingProject(true);

        const project: CreateProjectRequest = {
            organization_id: organizationId || "",
            name,
            description,
            purpose,
            target_audience,
            branding,
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
            router.push(`/dashboard/project/manage/${response.id}`);
        } catch (error) {
            console.error(
                `${pageName}.handleCreateProject: Error creating project`,
                error,
            );
            if (
                error instanceof Error &&
                error.message === "Can only have one project per organization"
            ) {
                setError(
                    "For Genesoft Free Tier, we allow only one project per organization, if you want to create more, please upgrade to Genesoft Standard or Genesoft Advanced to create more projects",
                );
            } else {
                setError("Error creating project, please try again");
            }
        } finally {
            setIsCreatingProject(false);
        }
    };

    const [perception, setPerception] = useState(branding?.perception);
    const [selectedColor, setSelectedColor] = useState<RGBColor>(
        hexToRgba(branding?.color || "#000000"),
    );
    const [webTheme, setWebTheme] = useState(branding?.theme);

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
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-col gap-4 p-8 w-full rounded-xl bg-secondary-dark">
                <div>
                    <div className="flex flex-col gap-y-2 mb-8">
                        <div className="flex items-center gap-x-2">
                            <Eye className="w-6 h-6 text-white" />
                            <p className="text-2xl text-white font-bold">
                                Branding
                            </p>
                        </div>

                        <p className="text-base text-subtext-in-dark-bg">
                            Your web application branding information
                        </p>

                        <p className="text-base text-white">Step 2 of 4</p>
                    </div>
                </div>

                <div className="flex flex-col gap-y-12 p-4 w-full rounded-xl bg-secondary-dark">
                    {/* Upload Logo */}
                    <UploadLogo />

                    {/* Brand Color */}
                    <div className="flex flex-col gap-y-4">
                        <Label
                            htmlFor="brand-color"
                            className="text-xl font-semibold"
                        >
                            Brand Color
                        </Label>
                        <p className="text-subtext-in-dark-bg text-sm">
                            Select your brand color
                        </p>

                        <SketchPicker
                            onChange={(color) => {
                                setSelectedColor(color.rgb);
                            }}
                            color={selectedColor}
                            className="text-black"
                        />

                        <div
                            style={{
                                backgroundColor: rgbaToHex(selectedColor),
                                width: 100,
                                height: 50,
                                border: "2px solid white",
                            }}
                        ></div>
                    </div>

                    {/* Web Theme */}
                    <div className="flex flex-col space-y-1.5 w-48">
                        <Label
                            htmlFor="web-application-theme"
                            className="text-xl font-semibold"
                        >
                            <span>Web Application Theme</span>
                        </Label>
                        <Select
                            value={webTheme}
                            onValueChange={(value) => setWebTheme(value)}
                        >
                            <SelectTrigger id="web-application-theme">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="light-and-dark">
                                    Light and Dark with toggle
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Perception */}
                    <div className="flex flex-col w-full max-w-lg gap-y-2 text-subtext-in-dark-bg">
                        <Label className="text-xl font-semibold" htmlFor="name">
                            <span>Brand Perception</span>
                        </Label>
                        <Textarea
                            placeholder="What feeling or thinking you want when your audience see your web application (ex. east going, innovative, luxury, and etc.)"
                            id="perception"
                            className="border-tertiary-dark bg-neutral-700 w-full"
                            required
                            value={perception}
                            onChange={(e) => setPerception(e.target.value)}
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
                        disabled={isCreatingProject}
                    >
                        <div className="flex items-center gap-x-2">
                            <span>Create Project</span>
                            {isCreatingProject && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                        </div>
                    </Button>
                </div>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
            </div>
        </div>
    );
};

export default CreateProjectBrandingPage;
