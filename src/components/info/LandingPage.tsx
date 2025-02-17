"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    UserCheck,
    CircleDollarSign,
    Rocket,
    FileCheck,
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
import GenesoftEcommerce from "@public/image/showcase/project/genesoft-e-commerce.png";

import Curlent from "@public/image/showcase/project/curlent.png";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";

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
        "Submit web app requirements, live your life, and get your web app live",
        "Help you get on-demand web application anytime without need to stay in control AI Agent for hours, just let AI Agent develop your project on their own until it can go live",
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

                        <div className="flex flex-col items-center gap-x-1 gap-y-4 md:gap-x-4 w-full md:w-5/6">
                            <Button
                                className="px-6 py-4 md:px-8 md:py-6 bg-genesoft hover:bg-genesoft/90 text-xs md:text-xl font-medium"
                                onClick={handleStartNow}
                            >
                                Get started your startup web application now
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
                {/* Video Section */}
                <div className="px-8 py-12 md:py-16 text-center flex flex-col gap-y-10 bg-gradient-to-b from-background to-secondary-dark/10">
                    <div className="space-y-4">
                        <p className="text-genesoft text-base sm:text-lg md:text-2xl font-bold bg-clip-text">
                            Transform Your Vision into Reality
                        </p>
                        <p className="text-base sm:text-lg md:text-2xl font-bold bg-clip-text  text-genesoft/90">
                            Let Our AI Agents Craft Your Perfect Web Application
                        </p>
                        <p className="text-base sm:text-lg md:text-2xl font-bold bg-clip-text  text-genesoft/80">
                            While You Focus on What Matters Most
                        </p>
                    </div>

                    <div className="relative flex justify-center">
                        <div className="absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-25"></div>
                        <iframe
                            className="self-center hidden md:flex relative rounded-lg shadow-xl"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/j5xhscX7Uj8?si=Hy2e1CkMyIEaZdza"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>

                        <iframe
                            className="self-center flex md:hidden relative rounded-lg shadow-xl"
                            width="320"
                            height="180"
                            src="https://www.youtube.com/embed/j5xhscX7Uj8?si=Hy2e1CkMyIEaZdza"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                <Separator />

                {/* Showcase Section */}
                <section className="py-8 md:py-16 rounded flex flex-col items-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-12 text-genesoft text-center">
                            Showcases
                        </h2>
                    </div>

                    <div className="flex items-center justify-center">
                        <Carousel className="w-full max-w-4xl">
                            <CarouselContent>
                                <CarouselItem>
                                    <div className="p-1">
                                        <div
                                            className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 hover:text-genesoft"
                                            onClick={() => {
                                                window.open(
                                                    "https://nextjs-webfeb76d90-2fbb-40e4-8073-657b737a643b-genesoft.vercel.app",
                                                    "_blank",
                                                );
                                            }}
                                        >
                                            <p className="text-base sm:text-lg md:text-2xl font-medium bg-clip-text">
                                                Genesoft e-commerce
                                            </p>
                                            <Image
                                                src={GenesoftEcommerce}
                                                alt="Showcase Image"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>

                                <CarouselItem>
                                    <div className="p-1">
                                        <div
                                            className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 hover:text-genesoft"
                                            onClick={() => {
                                                window.open(
                                                    "https://nextjs-web91e1305e-d5ff-40e9-8a47-10eeb7ebb97b.vercel.app/",
                                                    "_blank",
                                                );
                                            }}
                                        >
                                            <p className="text-base sm:text-lg md:text-2xl font-medium bg-clip-text">
                                                Curlent
                                            </p>
                                            <Image
                                                src={Curlent}
                                                alt="Showcase Image"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
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
                                        "Get your web application after software development team of AI Agent finish working on your project, Genesoft will inform you through email and you can see the web application live on the web",
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
