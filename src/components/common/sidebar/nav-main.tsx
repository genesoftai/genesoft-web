"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import React from "react";
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

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                    >
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                className="text-white hover:bg-secondary-dark"
                            >
                                <a href={item.url}>
                                    <item.icon className="text-subtext-in-dark-bg" />
                                    <span className="text-subtext-in-dark-bg">
                                        {item.title}
                                    </span>
                                </a>
                            </SidebarMenuButton>
                            {/* {item.items?.length ? (
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
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        className="text-subtext-in-dark-bg hover:bg-secondary-dark hover:text-white"
                                                    >
                                                        <a href={subItem.url}>
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            ) : null} */}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
