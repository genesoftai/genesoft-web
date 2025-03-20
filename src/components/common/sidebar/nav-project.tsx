"use client";

import { Loader2, ScanEye, Info } from "lucide-react";
import React, { useState } from "react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useProjectStore } from "@/stores/project-store";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function NavProject() {
    const { id, name, branding } = useProjectStore();

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    if (!id) {
        return null;
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel
                className="text-genesoft font-bold text-lg cursor-pointer hover:text-white transition-colors flex gap-x-2"
                onClick={() => {
                    router.push(`/dashboard/project/manage/${id}`);
                }}
            >
                {branding?.logo_url ? (
                    <Image
                        src={branding?.logo_url || ""}
                        alt={name}
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                ) : (
                    <div className="rounded-full bg-white/10 size-8 flex items-center justify-center">
                        <span className="text-white text-sm">
                            {name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
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
                    <SidebarMenuButton
                        asChild
                        tooltip="Branding"
                        className="text-white hover:bg-secondary-dark"
                    >
                        <a href={`/dashboard/project/${id}/ai-agent`}>
                            <ScanEye className="text-subtext-in-dark-bg" />
                            <span className="text-subtext-in-dark-bg">
                                Conversation
                            </span>
                        </a>
                    </SidebarMenuButton>
                    {/* <SidebarMenuButton
                        asChild
                        tooltip="Branding"
                        className="text-white hover:bg-secondary-dark"
                    >
                        <a href={`/dashboard/project/manage/${id}/branding`}>
                            <Database className="text-subtext-in-dark-bg" />
                            <span className="text-subtext-in-dark-bg">
                                Database
                            </span>
                        </a>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                        asChild
                        tooltip="Branding"
                        className="text-white hover:bg-secondary-dark"
                    >
                        <a href={`/dashboard/project/manage/${id}/branding`}>
                            <Users className="text-subtext-in-dark-bg" />
                            <span className="text-subtext-in-dark-bg">
                                Authentication
                            </span>
                        </a>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                        asChild
                        tooltip="Branding"
                        className="text-white hover:bg-secondary-dark"
                    >
                        <a href={`/dashboard/project/manage/${id}/branding`}>
                            <CloudUpload className="text-subtext-in-dark-bg" />
                            <span className="text-subtext-in-dark-bg">
                                Deployment
                            </span>
                        </a>
                    </SidebarMenuButton> */}
                </SidebarMenu>
            )}
        </SidebarGroup>
    );
}
