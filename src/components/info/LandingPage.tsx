"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    UserCheck,
    CircleDollarSign,
    Rocket,
    FileCheck,
    Sparkles,
    Command,
    Code,
    Search,
    Loader2,
    Waypoints,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import posthog from "posthog-js";
import { getOrganizationById } from "@/actions/organization";
import PlayWithMeUsage from "@public/image/genesoft-usage/play-with-me-usage.png";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { useProjectStore } from "@/stores/project-store";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { createProjectFromOnboarding, getProjectById } from "@/actions/project";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";

import Showcases from "./Showcases";
import ProjectCreationBox from "../project/ProjectCreationBox";

const StreamingText = ({
    text,
    speed = 20,
    onComplete,
}: {
    text: string;
    speed: number;
    onComplete: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeoutId);
        } else if (onComplete) {
            onComplete();
        }
    }, [text, speed, currentIndex, onComplete]);

    return <span>{displayedText}</span>;
};

export default function LandingPage() {
    const router = useRouter();
    const [heroStage, setHeroStage] = useState(0);
    const { id: user_id } = useGenesoftUserStore();
    const {
        is_onboarding,
        description: projectDescription,
        branding: projectBranding,
        project_type: projectType,
        backend_requirements: backendRequirements,
        clearCreateProjectStore,
    } = useCreateProjectStore();
    const [
        isCreatingProjectFromOnboarding,
        setIsCreatingProjectFromOnboarding,
    ] = useState(false);
    const { updateProjectStore } = useProjectStore();
    const { updateGenesoftOrganization } = useGenesoftOrganizationStore();

    const heroContent = [
        "Deliver full stack web app project 10x faster with AI Agents",
        "Collaborate with project manager, frontend developer, backend developer AI Agents to build web and backend services for your software project",
        "Build by developer for developer",
    ];

    const nextStage = () => {
        setHeroStage((prev) => prev + 1);
    };

    const handleOnboardingComplete = ({
        description,
        logo,
        color,
        project_type,
        backend_requirements,
    }: {
        description: string;
        logo?: string;
        color?: string;
        project_type: string;
        backend_requirements?: string;
    }) => {
        console.log({
            message: "onboarding complete",
            data: {
                description,
                logo,
                color,
                project_type,
                backend_requirements,
            },
        });

        if (user_id) {
            posthog.capture("onboarding_complete_from_landing_page");
            handleCreateProjectFromOnboarding({
                description,
                logo,
                color,
                project_type,
                backend_requirements,
            });
            setIsCreatingProjectFromOnboarding(true);
        } else {
            posthog.capture("onboarding_complete_from_landing_page");
            router.push(`/signup`);
        }
    };

    const handleCreateProjectFromOnboarding = async ({
        description,
        logo,
        color,
        project_type,
        backend_requirements,
    }: {
        description: string;
        logo?: string;
        color?: string;
        project_type: string;
        backend_requirements?: string;
    }) => {
        setIsCreatingProjectFromOnboarding(true);
        let projectId = "";
        try {
            const res = await createProjectFromOnboarding({
                user_id: user_id,
                project_description: description,
                branding: {
                    logo_url: logo,
                    color: color,
                },
                project_type: project_type,
                backend_requirements: backend_requirements,
            });
            if (res.error) {
                posthog.capture(
                    "landing_page_create_project_from_onboarding_failed",
                );
                console.error(res.error);
                alert("Failed to create project, Please try again.");
            } else {
                clearCreateProjectStore();
                projectId = res.project.id;
                const projectInfo = await getProjectById(projectId);
                const organizationInfo = await getOrganizationById(
                    projectInfo.organization_id,
                );
                updateProjectStore(projectInfo);
                updateGenesoftOrganization({
                    id: organizationInfo.id,
                    name: organizationInfo.name,
                    description: organizationInfo.description,
                    image: organizationInfo.image,
                });
                posthog.capture(
                    "landing_page_create_project_from_onboarding_success",
                );
            }
        } catch (error) {
            console.error(error);
            posthog.capture(
                "landing_page_create_project_from_onboarding_failed",
            );
        } finally {
            if (projectId) {
                router.push(`/dashboard/project/${projectId}/ai-agent`);
            }
            setIsCreatingProjectFromOnboarding(false);
        }
    };

    useEffect(() => {
        if (is_onboarding && user_id && projectDescription) {
            posthog.capture("landing_page_viewed_after_onboarding");
            handleCreateProjectFromOnboarding({
                description: projectDescription,
                logo: projectBranding?.logo_url,
                color: projectBranding?.color,
                project_type: projectType || "web",
                backend_requirements: backendRequirements || "",
            });
        }
    }, [is_onboarding, user_id, projectDescription]);

    return (
        <div className="flex flex-col min-h-screen bg-primary-dark text-subtext-in-dark-bg">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative text-center px-5 md:px-10 lg:px-20 pt-0 md:pt-24 pb-24 md:pb-32 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-0 left-1/4 w-1/3 h-1/3 bg-genesoft/10 rounded-full blur-[120px] transform -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-genesoft/10 rounded-full blur-[120px] transform translate-y-1/2"></div>
                    </div>

                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="inline-flex items-center bg-tertiary-dark rounded-full px-4 py-2 mb-8 border border-line-in-dark-bg">
                            <Sparkles className="h-4 w-4 mr-2 text-genesoft" />
                            <span className="text-sm">
                                AI Agents workspace to build full stack web
                                application for software developer
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text">
                            {heroStage === 0 && (
                                <StreamingText
                                    text={heroContent[0]}
                                    speed={30}
                                    onComplete={nextStage}
                                />
                            )}
                            {heroStage > 0 && heroContent[0]}
                        </h1>

                        <p className="text-lg md:text-xl text-subtext-in-dark-bg/90 max-w-3xl mx-auto mb-8">
                            {heroContent[1]}
                        </p>

                        {!isCreatingProjectFromOnboarding ? (
                            <ProjectCreationBox
                                onComplete={handleOnboardingComplete}
                                initialValues={{
                                    description: projectDescription,
                                    logo: projectBranding?.logo_url,
                                    color: projectBranding?.color,
                                    project_type: projectType,
                                }}
                            />
                        ) : (
                            <div className="mb-16">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-genesoft/10 border border-genesoft/30 rounded-xl p-6 max-w-md text-center">
                                        <div className="flex items-center justify-center mb-4">
                                            <Loader2 className="w-8 h-8 text-genesoft animate-spin mr-3" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            Your Project Is Being Created
                                        </h3>
                                        <p className="text-subtext-in-dark-bg/90">
                                            Genesoft is building your project.
                                            This may take a moment as we set up
                                            everything for you.
                                        </p>
                                        <div className="mt-4 text-genesoft text-sm">
                                            Please wait while we prepare your
                                            workspace...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-genesoft/30 to-genesoft/5 opacity-70 blur-lg rounded-xl"></div>
                        <div className="relative bg-tertiary-dark rounded-xl p-1 border border-line-in-dark-bg overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-8 bg-secondary-dark flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <Image
                                src={PlayWithMeUsage}
                                alt="Genesoft AI-powered web development"
                                className="w-full rounded-lg mt-8 transform hover:scale-[1.02] transition-all duration-500"
                                priority
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mt-8">
                        <p className="text-subtext-in-dark-bg/90 text-center max-w-lg">
                            Join our vibrant Discord community to get instant
                            support, share feedback, and connect with other
                            developers building with Genesoft.
                        </p>
                        <a
                            href="https://discord.gg/5jRywzzqDd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] transition-colors duration-200 rounded-lg text-white font-medium"
                        >
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            Join our Discord Community
                        </a>
                        <span className="text-sm text-subtext-in-dark-bg/70">
                            Get help, share ideas, and be part of our growing
                            community
                        </span>
                    </div>
                </section>

                {/* Keyboard-like section inspired by Raycast */}
                <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary-dark to-secondary-dark overflow-hidden">
                    <div className="container mx-auto px-4 text-center mb-16">
                        <h2 className="text-2xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Software development team at your fingertips
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-tertiary-dark p-6 rounded-xl border border-line-in-dark-bg hover:border-genesoft/50 transition-colors duration-300 group">
                                <div className="w-12 h-12 rounded-full bg-genesoft/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-genesoft/30 transition-colors duration-300">
                                    <Code className="w-6 h-6 text-genesoft" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    24/7 Development
                                </h3>
                                <p className="text-subtext-in-dark-bg">
                                    AI agents ready to work for you around the
                                    clock
                                </p>
                            </div>

                            <div className="bg-tertiary-dark p-6 rounded-xl border border-line-in-dark-bg hover:border-genesoft/50 transition-colors duration-300 group">
                                <div className="w-12 h-12 rounded-full bg-genesoft/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-genesoft/30 transition-colors duration-300">
                                    <Command className="w-6 h-6 text-genesoft" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    Simple Requirements
                                </h3>
                                <p className="text-subtext-in-dark-bg">
                                    Just talking with our Project manager AI
                                    agents, no technical knowledge required
                                </p>
                            </div>

                            <div className="bg-tertiary-dark p-6 rounded-xl border border-line-in-dark-bg hover:border-genesoft/50 transition-colors duration-300 group">
                                <div className="w-12 h-12 rounded-full bg-genesoft/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-genesoft/30 transition-colors duration-300">
                                    <Search className="w-6 h-6 text-genesoft" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    Cost Effective
                                </h3>
                                <p className="text-subtext-in-dark-bg">
                                    10x cheaper than hiring traditional
                                    development teams
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="relative max-w-5xl mx-auto px-4">
                        <iframe
                            className="w-full aspect-video rounded-lg shadow-xl z-10 transition-transform duration-300"
                            src="https://www.youtube.com/embed/L5pblM_Tsgc?si=R7LrNhQhxh76DtLp"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div> */}
                </section>

                <Showcases />
                {/* Why Genesoft Section */}
                <section className="py-16 md:py-24 bg-tertiary-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Why Genesoft
                        </h2>
                        <p className="text-lg text-center text-subtext-in-dark-bg/80 mb-16 max-w-3xl mx-auto">
                            Benefits that set us apart from traditional
                            development
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Built for Developer",
                                    description:
                                        "Technical experience of AI Agents integrated with cloud based development experience so you can setup and test web integrated with API service easily",
                                    icon: UserCheck,
                                },
                                {
                                    title: "Cost Effective",
                                    description:
                                        "10x cheaper than hiring in-house developer, we empower you to get 10x productivity with AI Agents",
                                    icon: CircleDollarSign,
                                },
                                {
                                    title: "Improve Anytime",
                                    description:
                                        "Improve latest version of web application and API service anytime follow your feedback and requirements, no need to waiting for working hour, no sick leave, no holiday, and no motivation issue.",
                                    icon: Rocket,
                                },
                                {
                                    title: "Separate but integrated",
                                    description:
                                        "Genesoft help you develop web and API service separately but you can integrated them together so AI Agents can work together",
                                    icon: Waypoints,
                                },
                            ].map((advantage, index) => (
                                <Card
                                    key={index}
                                    className="bg-secondary-dark border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px]"
                                >
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-genesoft/20 flex items-center justify-center mb-4 group-hover:bg-genesoft/30 transition-colors duration-300">
                                            <advantage.icon className="w-6 h-6 text-genesoft" />
                                        </div>
                                        <CardTitle className="text-lg md:text-xl text-white">
                                            {advantage.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-subtext-in-dark-bg">
                                            {advantage.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Subscription Section */}
                <section className="py-16 md:py-24 bg-gradient-to-b from-tertiary-dark to-secondary-dark overflow-hidden">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Subscription Plans
                        </h2>
                        <p className="text-lg text-center text-subtext-in-dark-bg/80 mb-8 max-w-3xl mx-auto">
                            Choose the plan that best fits your project needs
                        </p>

                        <div className="flex justify-center">
                            <Button
                                className="px-6 py-5 text-lg bg-genesoft hover:bg-genesoft/90 text-white font-medium rounded-full shadow-lg shadow-genesoft/20 transition-all duration-300 hover:scale-105"
                                onClick={() => router.push("/subscription")}
                            >
                                View All Plans
                            </Button>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-24 text-center bg-gradient-to-b from-tertiary-dark to-primary-dark relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-genesoft/15 rounded-full blur-[120px] transform -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-genesoft/15 rounded-full blur-[120px] transform translate-y-1/2"></div>
                    </div>

                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text">
                                Ready to get your software project done 10x
                                faster?
                            </h2>
                            <p className="text-lg text-subtext-in-dark-bg/90 mb-8 max-w-2xl mx-auto">
                                Get started with your web application and API
                                service today and see results in day, not week
                            </p>

                            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                <Button
                                    onClick={() => {
                                        posthog.capture(
                                            "click_landing_page_bottom_cta_button",
                                        );
                                        router.push("/signup");
                                    }}
                                    size="lg"
                                    className="w-64 md:w-auto px-8 py-6 text-xl bg-genesoft hover:bg-genesoft/90 text-white font-medium rounded-full shadow-lg shadow-genesoft/20 transition-all duration-300 hover:scale-105"
                                >
                                    <Sparkles className="mr-2 h-5 w-5" /> Get
                                    your project done now!
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-64 md:w-auto px-8 py-6 text-xl border-line-in-dark-bg text-black hover:bg-tertiary-dark hover:text-white rounded-full transition-all duration-300"
                                    onClick={() => router.push("/contact")}
                                >
                                    Contact us
                                </Button>
                            </div>

                            <div className="flex flex-col items-center gap-4 mt-8">
                                <p>or</p>
                                <a
                                    href="https://discord.gg/5jRywzzqDd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] transition-colors duration-200 rounded-lg text-white font-medium"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                    Join our Discord Community
                                </a>
                                <span className="text-sm text-subtext-in-dark-bg/70">
                                    Get help, share ideas, and be part of our
                                    growing community
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Keyboard-inspired visual decoration at the bottom */}
                <div className="py-8 px-4 bg-primary-dark overflow-hidden">
                    <div className="max-w-5xl mx-auto grid grid-cols-10 md:grid-cols-20 gap-1">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-3 rounded-sm ${i % 3 === 0 ? "bg-tertiary-dark" : i % 4 === 0 ? "bg-genesoft/30" : "bg-secondary-dark"}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
