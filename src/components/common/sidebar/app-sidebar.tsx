"use client";

import * as React from "react";
import { AppWindow, BookOpen, Building, LifeBuoy, Send } from "lucide-react";

import { NavMain } from "@/components/common/sidebar/nav-main";
import { NavSecondary } from "@/components/common/sidebar/nav-secondary";
import { NavUser } from "@/components/common/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { NavProject } from "./nav-project";

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Organization",
            url: "/dashboard/organization/info",
            icon: Building,
            items: [
                {
                    title: "Info",
                    url: "/dashboard/organization/info",
                },
                // {
                //     title: "Usage",
                //     url: "/dashboard/organization/usage",
                // },
                // {
                //     title: "Invoices",
                //     url: "/dashboard/organization/invoices",
                // },
            ],
        },
        {
            title: "Projects",
            url: "/dashboard",
            icon: AppWindow,
            items: [
                {
                    title: "Projects",
                    url: "/dashboard",
                },
                {
                    title: "Create",
                    url: "/dashboard/create-project/info",
                },
            ],
        },
        // {
        //     title: "Documentation",
        //     url: "/documentation/introduction",
        //     icon: BookOpen,
        //     items: [
        //         {
        //             title: "Introduction",
        //             url: "/documentation/introduction",
        //         },
        //         {
        //             title: "Get Started",
        //             url: "/documentation/get-started",
        //         },
        //         {
        //             title: "Tutorials",
        //             url: "/documentation/tutorials",
        //         },
        //         {
        //             title: "Pricing",
        //             url: "/documentation/pricing",
        //         },
        //     ],
        // },
    ],
    navSecondary: [
        {
            title: "support@genesoftai.com",
            url: "mailto:support@genesoftai.com",
            icon: LifeBuoy,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { organization, project_id } = useGenesoftUserStore();
    console.log({
        message: "AppSidebar",
        project_id,
    });
    return (
        <Sidebar
            variant="inset"
            {...props}
            className="bg-primary-dark text-white"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-dark text-white">
                                    <Building className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {organization?.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {"Standard"}
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProject />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
