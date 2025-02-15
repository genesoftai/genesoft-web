"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    UserCheck,
    CircleDollarSign,
    Rocket,
    FileCheck,
    Pencil,
    SquarePen,
    Laptop,
    AppWindow,
    FilePenLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
// import HeroSectionBanner from "@public/image/showcase/project-page-example.png";
import HeroSectionBanner from "@public/image/showcase/manage-project-example.png";
import Image from "next/image";
import posthog from "posthog-js";

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

    const heroContent = [
        "10X cheaper Software Development team of AI Agents for small company and startup",
        "Help you get on-demand web application anytime with 10x cheaper cost and less effort without need to deal with fuzzy technical tasks",
        "Develop web app with Structured Form of requirements not conversation based that can lead to confusion and misunderstanding of AI Agent for long running project that need constant improvement",
        "Built for non-technical product owner and startup founder who need to make idea come true but don't have a lot of funding and technical background",
    ];

    const nextStage = () => {
        setHeroStage((prev) => prev + 1);
    };
    const handleStartNow = () => {
        posthog.capture("click_start_now_from_landing_page");
        router.push(`signup`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="text-center px-5 md:px-10 lg:px-20 flex flex-col lg:flex-row space-y-2 lg:space-y-2 mb-20 lg:mb-40">
                    <div className="text-center md:text-start px-4 flex flex-col space-y-6 md:space-y-10 mb-10 md:mb-0">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-2xl md:text-4xl h-20 text-genesoft">
                            {heroStage === 0 && (
                                <StreamingText
                                    text={heroContent[0]}
                                    speed={30}
                                    onComplete={nextStage}
                                />
                            )}
                            {heroStage > 0 && heroContent[0]}
                        </h1>
                        <h2 className="text-lg sm:text-xl md:text-2xl">
                            {heroContent[1]}
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground max-w-2xl mb-12">
                            {heroContent[2]}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mb-12">
                            {heroContent[3]}
                        </p>

                        <div className="flex flex-col items-center gap-x-1 gap-y-4 md:gap-x-4 w-full md:w-5/6">
                            <Button
                                className="px-6 py-4 md:px-8 md:py-6 bg-genesoft hover:bg-genesoft/90 text-xs md:text-xl font-medium"
                                onClick={handleStartNow}
                            >
                                Get started free
                            </Button>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <Image
                            src={HeroSectionBanner}
                            width={800}
                            height={800}
                            alt="genesoft-service"
                            className="hidden md:flex rounded-lg"
                        />

                        <Image
                            src={HeroSectionBanner}
                            width={420}
                            height={420}
                            alt="genesoft-service"
                            className="hidden sm:flex md:hidden rounded-lg"
                        />

                        <Image
                            src={HeroSectionBanner}
                            width={360}
                            height={360}
                            alt="genesoft-service"
                            className="flex sm:hidden rounded-lg"
                        />
                    </div>
                </section>

                <Separator />

                {/* Why genesoft Section */}
                <section className="py-8 md:py-16 rounded">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-12 text-genesoft">
                            How it work
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Create Project",
                                    description:
                                        "Create project with your idea and requirements by filling structured form: branding, pages, features",
                                    icon: SquarePen,
                                },
                                {
                                    title: "Software Development team of AI Agent working",
                                    description:
                                        "Software Development team of AI Agent working on your project with your requirements for a while without need you to stay to control them every details",
                                    icon: Laptop,
                                },
                                {
                                    title: "Get your web application",
                                    description:
                                        "Get your web application after software development team of AI Agent finish working on your project, Geensoft will inform you through email and you can see the web application live on the web",
                                    icon: AppWindow,
                                },
                                {
                                    title: "Add feedback or Update Requirements",
                                    description:
                                        "You can add feedback or update requirements anytime you want to, and Genesoft software development team of AI Agent will update the web application accordingly and inform you through email",
                                    icon: FilePenLine,
                                },
                            ].map((advantages, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <advantages.icon className="w-8 md:w-10 h-8 md:h-10 mb-0 md:mb-2 text-genesoft" />
                                        <CardTitle className="text-sm md:text-base">
                                            {advantages.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                                            {advantages.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Why genesoft Section */}
                <section className="py-8 md:py-16 rounded">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-12 text-genesoft">
                            Why Genesoft
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Non-Tech User Experience",
                                    description:
                                        "Built for Non-Tech Product Owner to get their own web application without headache for technical stuff that is not your expertise",
                                    icon: UserCheck,
                                },
                                {
                                    title: "Cost Effective",
                                    description:
                                        "10x cheaper than hiring in-house developer or software development outsourcing",
                                    icon: CircleDollarSign,
                                },
                                {
                                    title: "Improve Anytime",
                                    description:
                                        "Improve latest version of web application anytime follow your feedback and requirements, no need to waiting for working hour, no sick leave, no holiday, and no motivation issue.",
                                    icon: Rocket,
                                },
                                {
                                    title: "No Ownership Problem",
                                    description:
                                        "No need to worry about ownership problem, all code and data is yours, you can get them anytime you want to leave Genesoft.",
                                    icon: FileCheck,
                                },
                            ].map((advantages, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <advantages.icon className="w-8 md:w-10 h-8 md:h-10 mb-0 md:mb-2 text-genesoft" />
                                        <CardTitle className="text-sm md:text-base">
                                            {advantages.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                                            {advantages.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-8 md:py-20 text-center">
                    <Button
                        onClick={() => {
                            posthog.capture(
                                "click_landing_page_bottom_cta_button",
                            );
                            router.push("/signup");
                        }}
                        size="lg"
                        className="text-lg px-8 py-6 cursor-pointer bg-genesoft hover:bg-genesoft/90"
                    >
                        {"Get your web now !"}
                    </Button>
                </section>
            </main>
        </div>
    );
}
