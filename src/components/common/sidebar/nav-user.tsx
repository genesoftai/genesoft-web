"use client";

import React, { useEffect, useState } from "react";
import { CalendarCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { UserStore, useUserStore } from "@/stores/user-store";
import { User } from "@supabase/supabase-js";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { getUserByEmail } from "@/actions/user";
import { SubscriptionLookupKey } from "@/constants/subscription";
import { nextAppBaseUrl } from "@/constants/web";
import { getOrganizationById } from "@/actions/organization";
import { useProjectStore } from "@/stores/project-store";

type UserData = { user: User } | { user: null };

export function NavUser() {
    const supabase = createSupabaseClient();
    const { isMobile } = useSidebar();
    const [userEmail, setUserEmail] = useState("");
    const [userData, setUserData] = useState<UserData>();
    const { updateUser, clearUserStore } = useUserStore();
    const { clearGenesoftUserStore } = useGenesoftUserStore();
    const {
        id: organization_id,
        name: organization_name,
        clearGenesoftOrganizationStore,
    } = useGenesoftOrganizationStore();
    const { clearCreateProjectStore } = useCreateProjectStore();
    const { clearProjectStore } = useProjectStore();
    const router = useRouter();

    useEffect(() => {
        setupUserData();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                window.localStorage.removeItem("session");
                setUserEmail("");
            } else if (session) {
                window.localStorage.setItem("session", JSON.stringify(session));
                setUserEmail(session.user.email ?? "");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const setupUserData = async () => {
        const { data } = await supabase.auth.getUser();
        if (!userEmail) {
            const user = data?.user;
            updateUser(user as Partial<UserStore>);
            setUserEmail(user?.email ?? "");
        }
        setUserData(data);
    };

    const signOut = async () => {
        posthog.capture("click_signout_from_nav_user");
        clearUserStore();
        clearGenesoftUserStore();
        clearGenesoftOrganizationStore();
        clearCreateProjectStore();
        clearProjectStore();
        await supabase.auth.signOut();
        router.push("/");
    };

    const handleSubscription = async () => {
        const { data: userData } = await supabase.auth.getUser();
        const user = await getUserByEmail({
            email: userData?.user?.email ?? "",
        });
        const organization = await getOrganizationById(organization_id);

        if (organization.customer_id) {
            const response = await fetch(
                `${nextAppBaseUrl}/api/stripe/create-portal-session`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        customer_id: organization.customer_id,
                    }),
                },
            );
            const data = await response.json();
            router.push(data.url);
        } else {
            const response = await fetch(
                `${nextAppBaseUrl}/api/stripe/create-checkout-session`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        customer_email: user.email,
                        lookup_key: SubscriptionLookupKey.Startup,
                        organization_id: organization_id,
                        organization_name: organization_name,
                    }),
                },
            );
            const data = await response.json();
            console.log({ message: "Stripe checkout session", data });
            router.push(data.url);
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={
                                        userData?.user?.user_metadata
                                            ?.avatar_url
                                    }
                                    alt={userData?.user?.user_metadata?.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {userData?.user?.user_metadata?.name
                                        ?.slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {userData?.user?.user_metadata?.name}
                                </span>
                                <span className="truncate text-xs">
                                    {userData?.user?.user_metadata?.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-primary-dark border-tertiary-dark"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal text-white">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={
                                            userData?.user?.user_metadata
                                                ?.avatar_url
                                        }
                                        alt={
                                            userData?.user?.user_metadata?.name
                                        }
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {userData?.user?.user_metadata?.name
                                            ?.slice(0, 2)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {userData?.user?.user_metadata?.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {userData?.user?.user_metadata?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-tertiary-dark" />
                        <DropdownMenuItem
                            className="cursor-pointer focus:bg-genesoft focus:text-white text-white"
                            onClick={handleSubscription}
                        >
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            <span>Subscription</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-tertiary-dark" />
                        {/* <DropdownMenuGroup>
                            <DropdownMenuItem className="text-white hover:bg-secondary-dark">
                                <Sparkles className="text-white" />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-tertiary-dark" />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="text-white hover:bg-secondary-dark">
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-secondary-dark">
                                <CreditCard />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-secondary-dark">
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-tertiary-dark" /> */}
                        <DropdownMenuItem
                            className="text-white hover:bg-secondary-dark"
                            onClick={signOut}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
