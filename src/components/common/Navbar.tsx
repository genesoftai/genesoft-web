"use client";

import Link from "next/link";
import {
    Menu,
    ExternalLink,
    ChevronDown,
    Send,
    Folders,
    Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import GenesoftLogo from "@/components/common/GenesoftLogo";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/client";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sendSupportEmail } from "@/actions/email";

type UserData = { user: User } | { user: null };

export default function Navbar() {
    const supabase = createSupabaseClient();
    const [isOpen, setIsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userData, setUserData] = useState<UserData>();
    const { updateUser } = useUserStore();
    const [scrolled, setScrolled] = useState(false);
    const { updateGenesoftUser } = useGenesoftUserStore();
    const { id: organizationId, updateGenesoftOrganization } =
        useGenesoftOrganizationStore();
    const { id: projectId, updateProjectStore } = useProjectStore();
    const [supportDialogOpen, setSupportDialogOpen] = useState(false);
    const [supportEmail, setSupportEmail] = useState("");
    const [supportQuery, setSupportQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    useEffect(() => {
        if (userEmail) {
            setSupportEmail(userEmail);
        }
    }, [userEmail]);

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

    const handleGoToDashboard = () => {
        if (userEmail) {
            // if (projectId) {
            //     router.push(`/dashboard/project/${projectId}/ai-agent`);
            // } else {
            //     router.push(`/dashboard`);
            // }
            router.push(`/dashboard`);
        } else {
            posthog.capture("click_dashboard_from_navbar_but_not_logged_in");
            router.push("/signin");
        }
    };

    const handleGoToCollections = () => {
        if (userEmail) {
            if (organizationId) {
                router.push(`/dashboard/collection`);
            } else {
                router.push(`/dashboard`);
            }
        } else {
            posthog.capture("click_collections_from_navbar_but_not_logged_in");
            router.push("/signin");
        }
    };
    const handleSupportClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setSupportDialogOpen(true);
    };

    const handleSupportSubmit = async () => {
        if (!supportEmail || !supportQuery) {
            toast({
                title: "Missing information",
                description: "Please provide both email and your question",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await sendSupportEmail({
                email: supportEmail,
                query: supportQuery,
            });

            if (response) {
                toast({
                    title: "Support request sent",
                    description: "We'll get back to you as soon as possible!",
                });
                setSupportQuery("");
                setSupportDialogOpen(false);
            } else {
                throw new Error("Failed to send support request");
            }
        } catch (error) {
            console.error("Error sending support request:", error);
            toast({
                title: "Error",
                description: "Failed to send your request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
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
                                <div className="flex flex-col gap-2 bg-tertiary-dark border border-line-in-dark-bg rounded-xl p-2 shadow-lg min-w-[200px]">
                                    <div
                                        onClick={handleGoToDashboard}
                                        className="flex items-center p-2 hover:bg-secondary-dark rounded-lg text-sm text-subtext-in-dark-bg hover:text-white transition-colors cursor-pointer w-full"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-genesoft/20 flex items-center justify-center mr-2">
                                            <Users className="h-4 w-4 text-genesoft" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                AI Agent Workspace
                                            </p>
                                            <p className="text-xs text-subtext-in-dark-bg/70">
                                                Talk with AI Agents to develop
                                                and manage software
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={handleGoToCollections}
                                        className="flex items-center p-2 hover:bg-secondary-dark rounded-lg text-sm text-subtext-in-dark-bg hover:text-white transition-colors cursor-pointer w-full"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-genesoft/20 flex items-center justify-center mr-2">
                                            <Folders className="h-4 w-4 text-genesoft" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                Collections
                                            </p>
                                            <p className="text-xs text-subtext-in-dark-bg/70 w-full truncate">
                                                Integrate web and backend
                                                projects
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p
                            className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70 cursor-pointer"
                            onClick={handleGoToDashboard}
                        >
                            Dashboard
                        </p>

                        <p
                            className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70 cursor-pointer"
                            onClick={handleGoToCollections}
                        >
                            Collections
                        </p>

                        <button
                            onClick={handleSupportClick}
                            className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70 flex items-center"
                        >
                            Support
                            <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </button>

                        <button
                            onClick={() => {
                                router.push("/subscription");
                            }}
                            className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70 flex items-center"
                        >
                            Pricing
                        </button>

                        <a
                            href="https://discord.gg/5jRywzzqDd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70 flex items-center"
                        >
                            Discord
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
                                <p
                                    className="text-subtext-in-dark-bg hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-tertiary-dark/70 cursor-pointer"
                                    onClick={handleGoToCollections}
                                >
                                    Collections
                                </p>
                                <button
                                    className="text-subtext-in-dark-bg hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-tertiary-dark/70 flex items-center text-left"
                                    onClick={(e) => {
                                        handleSupportClick(e);
                                        setIsOpen(false);
                                    }}
                                >
                                    Support
                                </button>
                                <a
                                    href="https://discord.gg/5jRywzzqDd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-subtext-in-dark-bg hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-tertiary-dark/70 flex items-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Discord
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

            <AlertDialog
                open={supportDialogOpen}
                onOpenChange={setSupportDialogOpen}
            >
                <AlertDialogContent className="bg-tertiary-dark border-line-in-dark-bg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Get Support
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-subtext-in-dark-bg">
                            Please provide your details and we'll get back to
                            you as soon as possible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="support-email"
                                className="text-white"
                            >
                                Your Email
                            </Label>
                            <Input
                                id="support-email"
                                placeholder="email@example.com"
                                className="bg-secondary-dark border-line-in-dark-bg text-white"
                                value={supportEmail}
                                onChange={(e) =>
                                    setSupportEmail(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="support-query"
                                className="text-white"
                            >
                                How can we help you?
                            </Label>
                            <Textarea
                                id="support-query"
                                placeholder="Describe your question, issue, or feature request in detail..."
                                className="min-h-[120px] bg-secondary-dark border-line-in-dark-bg text-white"
                                value={supportQuery}
                                onChange={(e) =>
                                    setSupportQuery(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-secondary-dark text-white hover:bg-secondary-dark/80 border-line-in-dark-bg">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSupportSubmit}
                            className="bg-genesoft hover:bg-genesoft/90 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </nav>
    );
}
