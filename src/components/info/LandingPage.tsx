"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    UserCheck,
    Rocket,
    Sparkles,
    Loader2,
    Waypoints,
    Workflow,
} from "lucide-react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { getOrganizationById } from "@/actions/organization";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { useProjectStore } from "@/stores/project-store";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { createProjectFromOnboarding, getProjectById } from "@/actions/project";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";

import ProjectCreationBox from "../project/ProjectCreationBox";
import { useCollectionStore } from "@/stores/collection-store";
import Image from "next/image";
import frontendTeam from "@public/image/genesoft-usage/v2/frontend-team.png";
import backendTeam from "@public/image/genesoft-usage/v2/backend-team.png";
import Showcase1 from "@public/image/genesoft-usage/v2/showcase-1.png";
import ManageEnvironmentVariables from "@public/image/genesoft-usage/v2/environment-variables.png";
import EditCode from "@public/image/genesoft-usage/v2/code-editor.png";
import DevMode from "@public/image/genesoft-usage/v2/dev-mode.png";
import InfrastructureManagement from "@public/image/genesoft-usage/v2/github-integration-and-infrastructure.png";
import { useOnboardingConversationStore } from "@/stores/onboarding-conversation-store";

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
        figma_file_key,
        clearCreateProjectStore,
    } = useCreateProjectStore();
    const { updateCollectionStore, clearCollectionStore } =
        useCollectionStore();
    const [
        isCreatingProjectFromOnboarding,
        setIsCreatingProjectFromOnboarding,
    ] = useState(false);
    const { updateProjectStore } = useProjectStore();
    const { updateGenesoftOrganization } = useGenesoftOrganizationStore();
    const { id: onboarding_conversation_id, clearOnboardingConversationStore } =
        useOnboardingConversationStore();

    const heroContent = [
        "Build serious full stack web app",
        "Project Manager, Technical Project Manager, UX/UI Designer, Frontend Developer, Software Architect, Backend Developer",
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
        figma_file_key,
    }: {
        description: string;
        logo?: string;
        color?: string;
        project_type: string;
        backend_requirements?: string;
        figma_file_key?: string;
    }) => {
        console.log({
            message: "onboarding complete",
            data: {
                description,
                logo,
                color,
                project_type,
                backend_requirements,
                figma_file_key,
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
                figma_file_key,
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
        conversation_id,
        figma_file_key,
    }: {
        description: string;
        logo?: string;
        color?: string;
        project_type: string;
        backend_requirements?: string;
        conversation_id?: string;
        figma_file_key?: string;
    }) => {
        setIsCreatingProjectFromOnboarding(true);
        let projectId = "";
        let collectionId = "";
        try {
            const payload = {
                user_id,
                project_description: description,
                branding: {
                    logo_url: logo,
                    color,
                },
                project_type,
                backend_requirements,
                onboarding_conversation_id: conversation_id,
                figma_file_key,
            };
            console.log({
                message: "create project from onboarding",
                payload,
            });
            const res = await createProjectFromOnboarding(payload);
            if (res.error) {
                posthog.capture(
                    "landing_page_create_project_from_onboarding_failed",
                );
                console.error(res.error);
                alert("Failed to create project, Please try again.");
            } else {
                clearCreateProjectStore();
                clearOnboardingConversationStore();
                if (res?.project) {
                    clearCollectionStore();
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
                } else if (res?.backendProject && res?.collection) {
                    projectId = res.backendProject.id;
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
                    updateCollectionStore({
                        id: res.collection.id,
                        name: res.collection.name,
                        description: res.collection.description,
                        is_active: res.collection.is_active,
                        web_project_id: res.webProject.id,
                        backend_service_project_ids: [projectId],
                        organization_id: res.collection.organization_id,
                        created_at: res.collection.created_at,
                        updated_at: res.collection.updated_at,
                    });
                    collectionId = res.collection.id;
                }

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
            if (collectionId) {
                router.push(
                    `/dashboard/collection/${collectionId}/collection-creation`,
                );
            } else if (projectId) {
                router.push(`/dashboard/project/${projectId}/ai-agent`);
            }
            setIsCreatingProjectFromOnboarding(false);
        }
    };

    useEffect(() => {
        if (is_onboarding && user_id && projectDescription) {
            posthog.capture("landing_page_viewed_after_onboarding");
            console.log({
                message: "create project from onboarding useEffect",
            });
            handleCreateProjectFromOnboarding({
                description: projectDescription,
                logo: projectBranding?.logo_url,
                color: projectBranding?.color,
                project_type: projectType || "web",
                backend_requirements: backendRequirements || "",
                conversation_id: onboarding_conversation_id,
                figma_file_key: figma_file_key,
            });
        }
    }, [is_onboarding, user_id, projectDescription]);

    return (
        <div className="flex flex-col min-h-screen text-subtext-in-dark-bg">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative text-center px-5 md:px-10 lg:px-20 pb-24 md:pb-32 overflow-hidden py-16">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-0 left-1/4 w-1/3 h-1/3 bg-genesoft/10 rounded-full blur-[120px] transform -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-genesoft/10 rounded-full blur-[120px] transform translate-y-1/2"></div>
                    </div>

                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="flex flex-col items-center justify-center relative z-10 py-10">
                            {/* Background effects */}
                            <div className="absolute -z-10 w-full h-1/4">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] bg-[#2563EB]/20 rounded-full blur-[80px]"></div>
                                <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-[#2563EB]/50 rounded-full blur-[60px] animate-pulse"></div>
                                <div
                                    className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#2563EB]/50 rounded-full blur-[70px] animate-pulse"
                                    style={{ animationDelay: "1s" }}
                                ></div>
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#2563EB]/5 to-transparent opacity-70"></div>
                            </div>

                            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text relative">
                                {heroStage === 0 && (
                                    <StreamingText
                                        text={heroContent[0]}
                                        speed={30}
                                        onComplete={nextStage}
                                    />
                                )}
                                {heroStage > 0 && heroContent[0]}
                            </h1>

                            <h1 className="text-5xl md:text-5xl lg:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r">
                                <span className="relative">10x Easier</span>
                            </h1>
                            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text relative">
                                with Software Development team of AI Agents
                            </h1>

                            <p className="text-subtext-in-dark-bg/80 text-center">
                                Project Manager, Technical Project Manager,
                                Frontend Developer, Backend Developer, UX/UI
                                Designer, Software Architect
                            </p>
                        </div>

                        {/* TODO: Show list of AI Agents */}

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
                </section>

                <div className="w-full h-fit flex flex-col items-center justify-center">
                    <h2 className="text-2xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        How Genesoft work
                    </h2>

                    {/* Desktop version */}
                    <iframe
                        className="hidden md:block w-8/12 h-[600px]"
                        src="https://www.youtube.com/embed/JE-8u9FRYz0?si=N2rQn-C-GFNCUtjd"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>

                    {/* Mobile version */}
                    <iframe
                        className="block md:hidden w-[90%] h-[300px]"
                        src="https://www.youtube.com/embed/JE-8u9FRYz0?si=N2rQn-C-GFNCUtjd"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Teams */}
                <section className="py-16 mx-4  md:py-24 rounded-xl my-8">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Your own software development team of AI Agents
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Card className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px]">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg md:text-xl text-white">
                                        {"Frontend development team (web)"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <p className="text-subtext-in-dark-bg">
                                        {
                                            "Team of AI Agents focus on develop web application for your use case incldue User experience, User interface, and user facing web features."
                                        }
                                    </p>
                                    <Image
                                        src={frontendTeam}
                                        alt="Frontend development team"
                                        width={400}
                                        height={400}
                                        className="rounded-lg hidden md:block"
                                    />
                                    <Image
                                        src={frontendTeam}
                                        alt="Frontend development team"
                                        width={250}
                                        height={250}
                                        className="rounded-lg block md:hidden"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px]">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg md:text-xl text-white">
                                        {
                                            "Backend development team (API service)"
                                        }
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <p className="text-subtext-in-dark-bg">
                                        {
                                            "Team of AI Agents focus on develop API service for your core business logic, data processing , monitoring, service integration, background jobs, and other advanced backend features."
                                        }
                                    </p>
                                    <Image
                                        src={backendTeam}
                                        alt="Backend development team"
                                        width={400}
                                        height={400}
                                        className="rounded-lg hidden md:block"
                                    />
                                    <Image
                                        src={backendTeam}
                                        alt="Backend development team"
                                        width={250}
                                        height={250}
                                        className="rounded-lg block md:hidden"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="py-16 mx-4  md:py-24 rounded-xl my-8">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            How Genesoft can help you develop and deliver your
                            next software project
                        </h2>

                        <div className="flex flex-col items-center gap-4">
                            <Card className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px] w-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg md:text-xl text-white">
                                        {"Conversation with AI Agents"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2 items-center">
                                    <p className="text-subtext-in-dark-bg">
                                        {
                                            "Talk with AI Agents for improve your project, you can ask them to improve your project, add new features, or fix bugs. After conversation done click Execute button to allow AI Agents to work on your project based on your latest conversation."
                                        }
                                    </p>
                                    <Image
                                        src={Showcase1}
                                        alt="Conversation with AI Agents"
                                        width={800}
                                        height={800}
                                        className="rounded-lg hidden md:block"
                                    />
                                    <Image
                                        src={Showcase1}
                                        alt="Conversation with AI Agents"
                                        width={400}
                                        height={400}
                                        className="rounded-lg block md:hidden"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px] w-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg md:text-xl text-white">
                                        {"Manage Environment Variables"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <p className="text-subtext-in-dark-bg">
                                        {
                                            "Manage environment variables for your project, you can add, edit, or delete environment variables for your project."
                                        }
                                    </p>
                                    <Image
                                        src={ManageEnvironmentVariables}
                                        alt="Manage Environment Variables"
                                        width={800}
                                        height={800}
                                        className="rounded-lg hidden md:block"
                                    />
                                    <Image
                                        src={ManageEnvironmentVariables}
                                        alt="Manage Environment Variables"
                                        width={400}
                                        height={400}
                                        className="rounded-lg block md:hidden"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px] w-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg md:text-xl text-white">
                                        {"Edit Code"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <p className="text-subtext-in-dark-bg">
                                        {
                                            "Edit code for your project, you can edit code for your project based on existing files."
                                        }
                                    </p>
                                    <Image
                                        src={EditCode}
                                        alt="Edit Code"
                                        width={800}
                                        height={800}
                                        className="rounded-lg hidden md:block"
                                    />
                                    <Image
                                        src={EditCode}
                                        alt="Edit Code"
                                        width={400}
                                        height={400}
                                        className="rounded-lg block md:hidden"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px] w-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg md:text-xl text-white">
                                        {"Dev Mode"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <p className="text-subtext-in-dark-bg">
                                        {
                                            "You can see development environement that AI Agents using for software development real time. And you can also run baisc command in their development environment."
                                        }
                                    </p>
                                    <Image
                                        src={DevMode}
                                        alt="Dev Mode"
                                        width={800}
                                        height={800}
                                        className="rounded-lg hidden md:block"
                                    />
                                    <Image
                                        src={DevMode}
                                        alt="Dev Mode"
                                        width={400}
                                        height={400}
                                        className="rounded-lg block md:hidden"
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px] w-full">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg md:text-xl text-white">
                                        {
                                            "Infrastructure Management (Coming Soon)"
                                        }
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-2">
                                    <p className="text-subtext-in-dark-bg">
                                        {
                                            "You can setup and manage basic infrastructure include database, authentication, and instance for your project. So you can deliver your project faster, cheaper, and more stable with Genesoft."
                                        }
                                    </p>
                                    <Image
                                        src={InfrastructureManagement}
                                        alt="Infrastructure Management"
                                        width={800}
                                        height={800}
                                        className="rounded-lg hidden md:block"
                                    />
                                    <Image
                                        src={InfrastructureManagement}
                                        alt="Infrastructure Management"
                                        width={400}
                                        height={400}
                                        className="rounded-lg block md:hidden"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* <Showcases /> */}
                {/* Why Genesoft Section */}
                <section className="py-16 mx-4  md:py-24 rounded-xl">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Why Genesoft
                        </h2>
                        <p className="text-lg text-center text-subtext-in-dark-bg/80 mb-16 max-w-3xl mx-auto">
                            Different experience that set us apart from other
                            Coding AI Agents
                        </p>

                        <div className="grid mb-24  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Full Software Development Team of AI Agents",
                                    description:
                                        "The only one place where you can manage full software development team of AI Agents to develop both web application and backend service.",
                                    icon: UserCheck,
                                },
                                {
                                    title: "Realistic Software Development Workflow",
                                    description:
                                        "Genesoft AI Agents consume times more than others Coding AI Agents for each task to do precisely software development workflow like a real software developer who read, write, run command, read server logs, fix errors, research information from the internet, and etc.",
                                    icon: Workflow,
                                },
                                {
                                    title: "Infrastructure Management in the workspace (coming soon)",
                                    description:
                                        "You can setup and manage basic infrastructure include database, authentication, and backend service instance for your project. So you can deliver your project faster, cheaper, and more stable with Genesoft in the workspace.",
                                    icon: Rocket,
                                },
                                {
                                    title: "Separate projects but integrated",
                                    description:
                                        "Genesoft AI Agents separate web application and backend service but you can integrated them together so AI Agents can work together between frontend team and backend team to integrate backend service to web application.",
                                    icon: Waypoints,
                                },
                            ].map((advantage, index) => (
                                <Card
                                    key={index}
                                    className="bg-genesoft-secondary-dark  border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300 group hover:translate-y-[-4px]"
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
                    {/* </section> */}

                    {/* Subscription Section */}

                    {/* CTA Section */}
                    {/* <section className="py-16 md:py-24 text-center bg-gradient-to-b from-tertiary-dark to-primary-dark relative overflow-hidden"> */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-genesoft/15 rounded-full blur-[120px] transform -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-genesoft/15 rounded-full blur-[120px] transform translate-y-1/2"></div>
                    </div>

                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl text-center md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text">
                                Ready to get your software project done 10x
                                easier?
                            </h2>
                            <p className="text-lg text-subtext-in-dark-bg/90 mb-8 max-w-2xl mx-auto">
                                Get started to manage full software development
                                team of AI Agents to get your web application
                                integrated with backend service in days, not
                                weeks.
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
                                    className="w-48 md:w-auto px-2 md:px-8 py-4 md:py-6 text-sm md:text-xl bg-genesoft hover:bg-genesoft/90 text-white font-medium rounded-full shadow-lg shadow-genesoft/20 transition-all duration-300 hover:scale-105"
                                >
                                    <Sparkles className="mr-2 h-5 w-5" /> Get
                                    started !
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-48 md:w-auto px-2 md:px-8 py-4 md:py-6 text-sm md:text-xl border-line-in-dark-bg text-black hover:bg-tertiary-dark hover:text-white rounded-full transition-all duration-300"
                                    onClick={() => router.push("/contact")}
                                >
                                    Contact us
                                </Button>
                            </div>

                            {/* <div className="flex flex-col items-center gap-4 mt-8">
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
                            </div> */}
                        </div>
                    </div>
                </section>

                {/* Keyboard-inspired visual decoration at the bottom */}
            </main>
        </div>
    );
}
