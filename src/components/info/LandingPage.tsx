"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, CircleDollarSign, Rocket, FileCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import HeroSectionBanner from "@public/image/showcase/project-page-example.png";
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
        "Software Development team of AI Agents for small company and startup",
        "Helping you get on-demand web application anytime with cheapest cost and fastest delivery",
        "Built for non-tech product owner to get their own web application without pay a lot for hiring in-house developer or outsource",
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
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mb-12">
                            {heroContent[2]}
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
                            className="hidden md:flex"
                        />

                        <Image
                            src={HeroSectionBanner}
                            width={420}
                            height={420}
                            alt="genesoft-service"
                            className="hidden sm:flex md:hidden"
                        />

                        <Image
                            src={HeroSectionBanner}
                            width={360}
                            height={360}
                            alt="genesoft-service"
                            className="flex sm:hidden"
                        />
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
                                        "Built for Non-Tech Product Owner to get their own web application without headache for technical stuff",
                                    icon: UserCheck,
                                },
                                {
                                    title: "Cost Effective",
                                    description:
                                        "Cheaper than hiring in-house developer or outsource half of the cost, and pay only AI Agent run time not pay for time that AI Agent not work",
                                    icon: CircleDollarSign,
                                },
                                {
                                    title: "Improve Anytime",
                                    description:
                                        "Get your latest version of web application anytime follow your feedback and requirements, no need to waiting for working hour, no sick leave, no holiday, and no motivation issue.",
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
                                "click_get_your_web_now_from_landing_page",
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
