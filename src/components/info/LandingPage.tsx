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
    Sparkles,
    Command,
    Code,
    Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import HeroSectionBanner from "@public/image/showcase/manage-project-example.png";
import Image from "next/image";
import posthog from "posthog-js";
import KhonkaenUnknown from "@public/image/showcase/project/khonkaen-unknown.png";
import Curlent from "@public/image/showcase/project/curlent.png";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import BangkokExplorerUsage from "@public/image/genesoft-usage/bangkok-explorer-mange-page.png";

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
        "Software development team for your startup in the AI Agent era",
        "Collaborate with our AI agent team to build your startup web application - our agents work 24/7 to turn your requirements into reality",
        "Perfect for entrepreneurs and founders without technical expertise who want to turn ideas into reality on a low budget",
    ];

    const nextStage = () => {
        setHeroStage((prev) => prev + 1);
    };
    const handleStartNow = () => {
        posthog.capture("click_start_now_from_landing_page");
        router.push(`signup`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary-dark text-subtext-in-dark-bg">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative text-center px-5 md:px-10 lg:px-20 pt-16 md:pt-24 pb-24 md:pb-32 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-0 left-1/4 w-1/3 h-1/3 bg-genesoft/10 rounded-full blur-[120px] transform -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-genesoft/10 rounded-full blur-[120px] transform translate-y-1/2"></div>
                    </div>

                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="inline-flex items-center bg-tertiary-dark rounded-full px-4 py-2 mb-8 border border-line-in-dark-bg">
                            <Sparkles className="h-4 w-4 mr-2 text-genesoft" />
                            <span className="text-sm">
                                AI-Powered Web Development for Startups
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

                        <p className="text-base text-subtext-in-dark-bg/80 max-w-2xl mx-auto mb-12">
                            {heroContent[2]}
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
                            <Button
                                className="w-64 md:w-auto px-8 py-6 text-base md:text-lg bg-genesoft hover:bg-genesoft/90 text-white font-medium rounded-full shadow-lg shadow-genesoft/20 transition-all duration-300 hover:scale-105"
                                onClick={handleStartNow}
                            >
                                Get your web application now
                            </Button>
                        </div>
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
                                src={BangkokExplorerUsage}
                                alt="Genesoft AI-powered web development"
                                className="w-full rounded-lg mt-8 transform hover:scale-[1.02] transition-all duration-500"
                                priority
                            />
                        </div>
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
                                    AI agents work around the clock to build
                                    your web application
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
                                    Just tell us what you need - no technical
                                    knowledge required
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

                    <div className="relative max-w-5xl mx-auto px-4">
                        <div className="bg-tertiary-dark border border-line-in-dark-bg rounded-xl p-4 md:p-6">
                            <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-genesoft to-genesoft/80 bg-clip-text text-transparent mb-6">
                                Collaborate with your team to work with our AI
                                Agent team for your business web application
                            </p>
                            <p className="text-base md:text-lg text-white/90 mb-10">
                                Our AI Agents develop your web application while
                                you focus on your business
                            </p>

                            <iframe
                                className="w-full aspect-video rounded-lg shadow-xl z-10 transition-transform duration-300"
                                src="https://www.youtube.com/embed/io0Hz_IS4Dg?si=Ubs9J88hK3HvWyHn"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </section>

                {/* Showcase Section */}
                <section className="py-16 md:py-24 bg-tertiary-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Showcases
                        </h2>
                        <p className="text-lg text-center text-subtext-in-dark-bg/80 mb-16 max-w-3xl mx-auto">
                            Take a look at some of the websites built by our AI
                            agents
                        </p>

                        <div className="flex items-center justify-center">
                            <Carousel className="w-full max-w-4xl">
                                <CarouselContent>
                                    <CarouselItem>
                                        <div className="p-1">
                                            <div
                                                className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                                                onClick={() => {
                                                    window.open(
                                                        "https://nextjs-webdb1f1b9b-6d50-4772-9a52-10aedced300e.vercel.app/about",
                                                        "_blank",
                                                    );
                                                }}
                                            >
                                                <div className="relative w-full mb-6 overflow-hidden rounded-xl border border-line-in-dark-bg">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-genesoft/20 to-genesoft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                                    <Image
                                                        src={KhonkaenUnknown}
                                                        alt="Khonkaen Unknown"
                                                        width={500}
                                                        height={500}
                                                        className="w-full rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-genesoft transition-colors">
                                                    Khonkaen Unknown
                                                </h3>
                                                <p className="text-sm text-subtext-in-dark-bg mt-2">
                                                    City depvelopment platform
                                                </p>
                                            </div>
                                        </div>
                                    </CarouselItem>

                                    <CarouselItem>
                                        <div className="p-1">
                                            <div
                                                className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                                                onClick={() => {
                                                    window.open(
                                                        "https://nextjs-webeddd871e-17d9-46d9-95b1-7054ed002ae5.vercel.app",
                                                        "_blank",
                                                    );
                                                }}
                                            >
                                                <div className="relative w-full mb-6 overflow-hidden rounded-xl border border-line-in-dark-bg">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-genesoft/20 to-genesoft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                                    <Image
                                                        src={Curlent}
                                                        alt="Curlent"
                                                        width={500}
                                                        height={500}
                                                        className="w-full rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                                <h3 className="text-xl md:text-2xl font-medium text-white group-hover:text-genesoft transition-colors">
                                                    Curlent
                                                </h3>
                                                <p className="text-sm text-subtext-in-dark-bg mt-2">
                                                    AI-Powered US Stock Research
                                                </p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious className="bg-secondary-dark border-line-in-dark-bg text-white hover:bg-genesoft/20 transition-colors duration-300" />
                                <CarouselNext className="bg-secondary-dark border-line-in-dark-bg text-white hover:bg-genesoft/20 transition-colors duration-300" />
                            </Carousel>
                        </div>
                    </div>
                </section>

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

                {/* Testimonials - added as inspired by Raycast */}
                {/* <section className="py-16 md:py-24 bg-gradient-to-b from-secondary-dark to-primary-dark overflow-hidden">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            Built for businesses like yours
                        </h2>
                        <p className="text-lg text-center text-subtext-in-dark-bg/80 mb-16 max-w-3xl mx-auto">
                            Trusted by startups and small businesses to bring
                            their ideas to life
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div className="bg-tertiary-dark p-6 rounded-xl border border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300">
                                <p className="text-subtext-in-dark-bg mb-4">
                                    "Genesoft helped us launch our e-commerce
                                    platform in just two weeks. Their AI agents
                                    understood exactly what we needed and
                                    delivered beyond our expectations."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-genesoft/20 flex items-center justify-center mr-3">
                                        <span className="text-genesoft font-bold">
                                            JM
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">
                                            John Miller
                                        </h4>
                                        <p className="text-xs text-subtext-in-dark-bg/70">
                                            Founder, ShopEasy
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-tertiary-dark p-6 rounded-xl border border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300">
                                <p className="text-subtext-in-dark-bg mb-4">
                                    "As someone with zero technical knowledge, I
                                    was amazed at how easy it was to get my
                                    business website up and running with
                                    Genesoft."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-genesoft/20 flex items-center justify-center mr-3">
                                        <span className="text-genesoft font-bold">
                                            SP
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">
                                            Sarah Parker
                                        </h4>
                                        <p className="text-xs text-subtext-in-dark-bg/70">
                                            Owner, Wellness Studio
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-tertiary-dark p-6 rounded-xl border border-line-in-dark-bg hover:border-genesoft/50 transition-all duration-300">
                                <p className="text-subtext-in-dark-bg mb-4">
                                    "The cost savings compared to traditional
                                    development are incredible. We got a
                                    professional web app at a fraction of what
                                    we were quoted elsewhere."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-genesoft/20 flex items-center justify-center mr-3">
                                        <span className="text-genesoft font-bold">
                                            RJ
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">
                                            Robert Johnson
                                        </h4>
                                        <p className="text-xs text-subtext-in-dark-bg/70">
                                            CEO, TechStart
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* CTA Section */}
                <section className="py-16 md:py-24 text-center bg-gradient-to-b from-tertiary-dark to-primary-dark relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                        <div className="absolute top-0 right-1/4 w-1/3 h-1/3 bg-genesoft/15 rounded-full blur-[120px] transform -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-1/4 w-1/3 h-1/3 bg-genesoft/15 rounded-full blur-[120px] transform translate-y-1/2"></div>
                    </div>

                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text">
                                Ready to transform your business?
                            </h2>
                            <p className="text-lg text-subtext-in-dark-bg/90 mb-8 max-w-2xl mx-auto">
                                Get started with your web application today and
                                see results in days, not months
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
                                    your web now!
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
