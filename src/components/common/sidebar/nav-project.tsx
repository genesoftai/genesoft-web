"use client";

import { ChevronRight, Files, Layers, Loader2 } from "lucide-react";
import React, { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProjectStore } from "@/stores/project-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AddPageDialog } from "@/components/project/pages/AddPageDialog";
import { AddFeatureDialog } from "@/components/project/features/AddFeatureDialog";
import { addFeature, addPage } from "@/actions/project";
import { Feature, Page } from "@/types/project";

export function NavProject() {
    const { id, name, pages, features, branding } = useProjectStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!id || !name || !pages || !features) {
        return null;
    }

    console.log({
        message: "NavProject: branding",
        branding,
    });

    const handleAddPage = async (page: Page) => {
        try {
            setIsLoading(true);
            const newPage = await addPage({
                projectId: id,
                payload: {
                    name: page.name,
                    description: page.description,
                    file_ids: page.files.map((file) => file.id || ""),
                    reference_link_ids: page.references.map(
                        (ref) => ref.id || "",
                    ),
                },
            });
            router.push(`/dashboard/project/manage/${id}/pages/${newPage.id}`);
        } catch (error) {
            console.error("Error adding page:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddFeature = async (feature: Feature) => {
        try {
            setIsLoading(true);
            const newFeature = await addFeature({
                projectId: id,
                payload: {
                    name: feature.name,
                    description: feature.description,
                    file_ids: feature.files?.map((file) => file.id || "") || [],
                    reference_link_ids:
                        feature.references?.map((ref) => ref.id || "") || [],
                },
            });
            router.push(
                `/dashboard/project/manage/${id}/features/${newFeature.id}`,
            );
        } catch (error) {
            console.error("Error adding feature:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel
                className="text-genesoft font-bold text-lg cursor-pointer hover:text-white transition-colors flex gap-x-2"
                onClick={() => {
                    router.push(`/dashboard/project/manage/${id}`);
                }}
            >
                <Image
                    src={branding?.logo_url || ""}
                    alt={name}
                    width={24}
                    height={24}
                    className="rounded-full"
                />
                <span
                    className={`truncate ${branding?.color ? `text-[${branding?.color}]` : "text-genesoft"}`}
                >
                    {name}
                </span>
            </SidebarGroupLabel>
            {isLoading ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                        <span className="text-white text-sm">
                            processing...
                        </span>
                    </div>
                </div>
            ) : (
                <SidebarMenu>
                    {/* Pages */}
                    <Collapsible asChild defaultOpen>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip="Pages"
                                className="text-white hover:bg-secondary-dark"
                            >
                                <a
                                    href={`/dashboard/project/manage/${id}/pages`}
                                >
                                    <Files className="text-subtext-in-dark-bg" />
                                    <span className="text-subtext-in-dark-bg">
                                        Pages
                                    </span>
                                </a>
                            </SidebarMenuButton>
                            {pages && pages.length > 0 && (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90 text-subtext-in-dark-bg">
                                            <ChevronRight />
                                            <span className="sr-only">
                                                Toggle
                                            </span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {pages.map((page) => (
                                                <SidebarMenuSubItem
                                                    key={page.id}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className="text-subtext-in-dark-bg hover:bg-secondary-dark hover:text-white"
                                                    >
                                                        <a
                                                            href={`/dashboard/project/manage/${id}/pages/${page.id}`}
                                                        >
                                                            <span>
                                                                {page.name}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            )}
                        </SidebarMenuItem>
                    </Collapsible>
                    <button className="flex items-center justify-center gap-1.5 p-2 rounded-lg transition-colors hover:bg-secondary-dark/20 group">
                        {/* <PlusCircleIcon className="w-5 h-5 text-genesoft group-hover:text-white transition-colors" />
                    <span className="text-subtext-in-dark-bg text-xs font-medium group-hover:text-white transition-colors">
                        Add Page
                    </span> */}
                        <AddPageDialog
                            onAddPage={handleAddPage}
                            type="update"
                        />
                    </button>

                    {/* Features */}
                    <Collapsible asChild defaultOpen>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip="Features"
                                className="text-white hover:bg-secondary-dark"
                            >
                                <a
                                    href={`/dashboard/project/manage/${id}/features`}
                                >
                                    <Layers className="text-subtext-in-dark-bg" />
                                    <span className="text-subtext-in-dark-bg">
                                        Features
                                    </span>
                                </a>
                            </SidebarMenuButton>
                            {features && features.length > 0 && (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90 text-subtext-in-dark-bg">
                                            <ChevronRight />
                                            <span className="sr-only">
                                                Toggle
                                            </span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {features.map((feature) => (
                                                <SidebarMenuSubItem
                                                    key={feature.id}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className="text-subtext-in-dark-bg hover:bg-secondary-dark hover:text-white"
                                                    >
                                                        <a
                                                            href={`/dashboard/project/manage/${id}/features/${feature.id}`}
                                                        >
                                                            <span>
                                                                {feature.name}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            )}
                        </SidebarMenuItem>
                    </Collapsible>
                    <button className="flex items-center justify-center gap-1.5 p-2 rounded-lg transition-colors hover:bg-secondary-dark/20 group">
                        <AddFeatureDialog
                            type="update"
                            onAddFeature={handleAddFeature}
                        />
                    </button>
                </SidebarMenu>
            )}
        </SidebarGroup>
    );
}
