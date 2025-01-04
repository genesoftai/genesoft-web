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
import { Eye, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getProjectById, updateProjectBranding } from "@/actions/project";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UploadLogo from "@/components/project/branding/UploadLogo";
import { SketchPicker } from "react-color";
import { Textarea } from "@/components/ui/textarea";
import { hexToRgba, rgbaToHex } from "@/utils/common/color";

const UpdateProjectBrandingPage = () => {
    const pathParams = useParams();
    const router = useRouter();
    const [projectId, setProjectId] = useState<string>("");

    const [logoUrl, setLogoUrl] = useState("");
    const [perception, setPerception] = useState("");
    const [selectedColor, setSelectedColor] = useState(hexToRgba("#000000"));
    const [webTheme, setWebTheme] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const { projectId } = pathParams;
        setProjectId(projectId as string);
    }, [pathParams]);

    useEffect(() => {
        setupProject();
    }, [projectId]);

    const setupProject = async () => {
        const project = await getProjectById(projectId);
        console.log({
            message: "setupProject",
            project,
        });
        setLogoUrl(project.branding?.logo_url || "");
        setPerception(project.branding?.perception || "");
        setSelectedColor(hexToRgba(project.branding?.color || "#000000"));
        setWebTheme(project.branding?.theme || "");
    };

    const handleUpdateBranding = async () => {
        setIsUpdating(true);
        try {
            await updateProjectBranding({
                projectId,
                payload: {
                    logo_url: logoUrl,
                    color: rgbaToHex(selectedColor),
                    theme: webTheme,
                    perception,
                },
            });
            router.push(`/dashboard/project/manage/${projectId}`);
        } catch (error) {
            console.error("Error updating project branding:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBack = () => {
        router.push(`/dashboard/project/manage/${projectId}`);
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
                                    Project
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
                            View and update your web application branding
                            information
                        </p>
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
                    <div className="flex flex-col space-y-1.5 w-fit">
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
                        <Label
                            className="text-xl font-semibold"
                            htmlFor="perception"
                        >
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

                <div className="flex w-full justify-between items-center">
                    <Button
                        className="flex items-center p-4 self-end w-fit bg-gray-500 font-medium hover:bg-gray-500/80 text-black"
                        onClick={handleBack}
                    >
                        <span>Back</span>
                    </Button>
                    <Button
                        className="flex items-center p-4 self-end w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                        onClick={handleUpdateBranding}
                        disabled={isUpdating}
                    >
                        <span>Update</span>
                        {isUpdating && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                    </Button>
                </div>

                <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
            </div>
        </div>
    );
};

export default UpdateProjectBrandingPage;
