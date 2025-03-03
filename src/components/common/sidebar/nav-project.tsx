"use client";

import {
    ChevronRight,
    Files,
    Layers,
    Loader2,
    ScanEye,
    Info,
} from "lucide-react";
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
import { Feature, Page } from "@/types/project";
import { useChannelStore } from "@/stores/channel-store";
import { sleep } from "@/utils/common/time";
import { createPage } from "@/actions/page";
import { createFeature } from "@/actions/feature";

export function NavProject() {
    const { id, name, pages, features, branding } = useProjectStore();
    const { id: channelId, category, updateChannelStore } = useChannelStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    console.log({
        message: "NavProject: branding",
        branding,
    });

    const handleAddPage = async (page: Page) => {
        let pageId = "";
        try {
            setIsLoading(true);
            const newPage = await createPage({
                project_id: id,
                name: page.name,
                description: page.description,
            });
            pageId = newPage.id;
            updateChannelStore({ id: newPage.id, category: "page" });
            sleep(1000);
        } catch (error) {
            console.error("Error adding page:", error);
        } finally {
            setIsLoading(false);
            router.push(`/dashboard/project/manage/${id}/pages/${pageId}`);
        }
    };

    const handleAddFeature = async (feature: Feature) => {
        let featureId = "";
        try {
            setIsLoading(true);
            const newFeature = await createFeature({
                project_id: id,
                name: feature.name,
                description: feature.description,
            });
            featureId = newFeature.id;
            updateChannelStore({ id: newFeature.id, category: "feature" });
            sleep(1000);
        } catch (error) {
            console.error("Error adding feature:", error);
        } finally {
            setIsLoading(false);
            router.push(
                `/dashboard/project/manage/${id}/features/${featureId}`,
            );
        }
    };

    const handleSelectPage = (pageId: string) => {
        updateChannelStore({ id: pageId, category: "page" });
        router.push(`/dashboard/project/manage/${id}/pages/${pageId}`);
    };
    const handleSelectFeature = (featureId: string) => {
        updateChannelStore({ id: featureId, category: "feature" });
        router.push(`/dashboard/project/manage/${id}/features/${featureId}`);
    };

    if (!id) {
        return null;
    }

    console.log({
        message: "NavProject: branding",
        branding,
    });

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
                    className={`truncate`}
                    style={
                        branding?.color
                            ? { color: branding.color }
                            : { color: "white" }
                    }
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
                    <SidebarMenuButton
                        asChild
                        tooltip="Overview"
                        className="text-white hover:bg-secondary-dark"
                    >
                        <a href={`/dashboard/project/manage/${id}`}>
                            <Info className="text-subtext-in-dark-bg" />
                            <span className="text-subtext-in-dark-bg">
                                Overview
                            </span>
                        </a>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                        asChild
                        tooltip="Branding"
                        className="text-white hover:bg-secondary-dark"
                    >
                        <a href={`/dashboard/project/manage/${id}/branding`}>
                            <ScanEye className="text-subtext-in-dark-bg" />
                            <span className="text-subtext-in-dark-bg">
                                Branding
                            </span>
                        </a>
                    </SidebarMenuButton>
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
                                                        className={`cursor-pointer text-subtext-in-dark-bg hover:bg-secondary-dark hover:text-white ${category === "page" && channelId === page.id ? "bg-genesoft text-white" : ""}`}
                                                    >
                                                        <p
                                                            onClick={() =>
                                                                handleSelectPage(
                                                                    page.id,
                                                                )
                                                            }
                                                        >
                                                            <span>
                                                                {page.name}
                                                            </span>
                                                        </p>
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
                                                        className={`cursor-pointer text-subtext-in-dark-bg hover:bg-secondary-dark hover:text-white ${category === "feature" && channelId === feature.id ? "bg-genesoft text-white" : ""}`}
                                                    >
                                                        <p
                                                            onClick={() =>
                                                                handleSelectFeature(
                                                                    feature.id,
                                                                )
                                                            }
                                                        >
                                                            <span>
                                                                {feature.name}
                                                            </span>
                                                        </p>
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
