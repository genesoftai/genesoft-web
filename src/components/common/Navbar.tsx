"use client";

import Link from "next/link";
import { Menu, ExternalLink, ChevronDown, AppWindow } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import GenesoftLogo from "@/components/common/GenesoftLogo";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import UserNav from "./UserNav";
import { UserStore, useUserStore } from "@/stores/user-store";
import { User } from "@supabase/supabase-js";
import posthog from "posthog-js";
import { getUserByEmail, updateUserImageByEmail } from "@/actions/user";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { useProjectStore } from "@/stores/project-store";
import {
    getOrganizationProjects,
    getOrganizationsByUserId,
} from "@/actions/organization";

type UserData = { user: User } | { user: null };

export default function Navbar() {
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userData, setUserData] = useState<UserData>();
    const { updateUser } = useUserStore();
    const [scrolled, setScrolled] = useState(false);
    const { updateGenesoftUser } = useGenesoftUserStore();
    const { id: organizationId, updateGenesoftOrganization } =
        useGenesoftOrganizationStore();
    const { id: projectId, updateProjectStore } = useProjectStore();

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

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const setupUserData = async () => {
        const { data } = await supabase.auth.getUser();
        if (!userEmail) {
            const user = data?.user;
            updateUser(user as Partial<UserStore>);
            setUserEmail(user?.email ?? "");
            const genesoftUser = await getUserByEmail({
                email: user?.email ?? "",
            });
            updateGenesoftUser(genesoftUser);
            if (!organizationId || !projectId) {
                setupOrganizationAndProjectData(genesoftUser.id);
            }
        }
        setUserData(data);
        // update user image
        if (data?.user?.user_metadata?.avatar_url) {
            updateUserImageByEmail({
                email: data.user.email ?? "",
                imageUrl: data.user.user_metadata.avatar_url,
            });
        }
    };

    const setupOrganizationAndProjectData = async (userId: string) => {
        const organizations = await getOrganizationsByUserId(userId);
        updateGenesoftOrganization(organizations[0]);
        const organizationId = organizations[0].id;
        if (!projectId) {
            const projects = await getOrganizationProjects(organizationId);
            updateProjectStore(projects[0]);
        }
    };

    return (
        <nav
            className={`border-b border-line-in-dark-bg w-full sticky top-0 z-50 bg-primary-dark/90 backdrop-blur-md transition-all duration-300 ${
                scrolled ? "shadow-md py-2" : "py-4"
            }`}
        >
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
                <Link href="/" className="flex items-center">
                    <GenesoftLogo />
                </Link>

                <div className="hidden md:flex items-center">
                    {/* <div className="relative mx-4 px-1">
                        <div className="hidden lg:flex items-center bg-tertiary-dark/80 hover:bg-tertiary-dark border border-line-in-dark-bg rounded-full px-3 py-1.5 text-sm text-subtext-in-dark-bg transition-colors duration-200">
                            <Command className="h-3.5 w-3.5 mr-2 text-subtext-in-dark-bg/70" />
                            <span>Press</span>
                            <kbd className="ml-1.5 bg-secondary-dark rounded px-1.5 py-0.5 text-xs border border-line-in-dark-bg">
                                ⌘
                            </kbd>
                            <kbd className="ml-1 bg-secondary-dark rounded px-1.5 py-0.5 text-xs border border-line-in-dark-bg">
                                K
                            </kbd>
                            <span className="ml-1.5">to search</span>
                        </div>
                    </div> */}

                    <div className="flex items-center space-x-1">
                        <div className="relative group">
                            <Button
                                variant="ghost"
                                className="text-subtext-in-dark-bg hover:text-white hover:bg-tertiary-dark/70 rounded-full px-4"
                            >
                                <span className="flex items-center">
                                    Products
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </span>
                            </Button>
                            <div className="absolute left-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                                <div className="bg-tertiary-dark border border-line-in-dark-bg rounded-xl p-2 shadow-lg min-w-[200px]">
                                    <Link
                                        href="/signup"
                                        className="flex items-center p-2 hover:bg-secondary-dark rounded-lg text-sm text-subtext-in-dark-bg hover:text-white transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-genesoft/20 flex items-center justify-center mr-2">
                                            <AppWindow className="h-4 w-4 text-genesoft" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                Web Development
                                            </p>
                                            <p className="text-xs text-subtext-in-dark-bg/70">
                                                AI-powered web apps
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/project/manage/${projectId}`}
                            className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70"
                        >
                            Dashboard
                        </Link>

                        <a
                            href="mailto:support@genesoftai.com"
                            className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70 flex items-center"
                        >
                            Support
                            <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-3">
                    {userEmail ? (
                        <UserNav
                            email={userEmail}
                            avatarUrl={
                                userData?.user?.user_metadata?.avatar_url
                            }
                            name={userData?.user?.user_metadata?.name}
                        />
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Button
                                onClick={() => {
                                    posthog.capture("click_signin_from_navbar");
                                    router.push("/signin");
                                }}
                                variant="ghost"
                                className="text-sm font-medium transition-colors bg-transparent text-subtext-in-dark-bg hover:text-white hover:bg-tertiary-dark/70 rounded-full"
                            >
                                Sign in
                            </Button>

                            <Button
                                onClick={() => {
                                    posthog.capture("click_signup_from_navbar");
                                    router.push("/signup");
                                }}
                                className="text-sm font-medium transition-colors bg-genesoft hover:bg-genesoft/90 text-white rounded-full px-6"
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-subtext-in-dark-bg hover:text-white hover:bg-tertiary-dark/70"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="bg-primary-dark border-line-in-dark-bg p-0"
                    >
                        <div className="p-6 border-b border-line-in-dark-bg">
                            <GenesoftLogo />
                        </div>
                        <nav className="flex flex-col p-4">
                            <div className="flex flex-col space-y-1 mb-6">
                                <Link
                                    href="/"
                                    className="text-subtext-in-dark-bg hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-tertiary-dark/70"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="text-subtext-in-dark-bg hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-tertiary-dark/70"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <a
                                    href="mailto:support@genesoftai.com"
                                    className="text-subtext-in-dark-bg hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-tertiary-dark/70 flex items-center"
                                >
                                    Support
                                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                                </a>
                            </div>

                            {userEmail ? (
                                <UserNav
                                    email={userEmail}
                                    avatarUrl={
                                        userData?.user?.user_metadata
                                            ?.avatar_url
                                    }
                                    name={userData?.user?.user_metadata?.name}
                                />
                            ) : (
                                <div className="flex flex-col space-y-2 pt-4 border-t border-line-in-dark-bg">
                                    <Button
                                        onClick={() => {
                                            posthog.capture(
                                                "click_signin_from_navbar",
                                            );
                                            router.push("/signin");
                                            setIsOpen(false);
                                        }}
                                        variant="ghost"
                                        className="w-full text-sm font-medium transition-colors bg-transparent text-subtext-in-dark-bg hover:text-white hover:bg-tertiary-dark/70 rounded-lg justify-start"
                                    >
                                        Sign in
                                    </Button>

                                    <Button
                                        onClick={() => {
                                            posthog.capture(
                                                "click_signup_from_navbar",
                                            );
                                            router.push("/signup");
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-sm font-medium transition-colors bg-genesoft hover:bg-genesoft/90 text-white rounded-lg"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
