"use client";

import React from "react";
import { Check, InfoIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

type PricingTier = {
    name: string;
    description: string;
    price: string;
    priceDescription: string;
    features: string[];
    buttonText: string;
    buttonVariant?: "default" | "outline";
    highlighted?: boolean;
};

const pricingTiers: PricingTier[] = [
    {
        name: "Free Tier",
        description: "For individuals just getting started",
        price: "$0",
        priceDescription: "Free forever",
        features: [
            "1 project",
            "10 sprints per month",
            "Basic LLM (Claude Haiku, backup by o1-mini)",
            "Email Support",
            "Project in organization deleted in 7 days",
            "Maximum 2 team members",
        ],
        buttonText: "Get Started",
        buttonVariant: "outline",
    },
    {
        name: "Startup Tier",
        description: "For small teams and growing projects",
        price: "$30",
        priceDescription: "per month",
        features: [
            "1 project",
            "30 sprints per month",
            "Moderate LLM (Claude Haiku, backup by o1-mini)",
            "Infrastructure setup support",
            "Unlimited team members",
            "Project not deleted while in subscription",
            "Extra sprints: $0.5 per sprint",
        ],
        buttonText: "Sign Up",
        highlighted: true,
    },
    {
        name: "Launch Tier",
        description: "For businesses ready to scale",
        price: "$99",
        priceDescription: "per month",
        features: [
            "2 projects",
            "60 sprints per month",
            "Advanced LLM (Claude Sonnet 3.7, backup by o3-mini high)",
            "Dedicated Support",
            "Project not deleted while in subscription",
            "Extra sprints: $1 per sprint",
        ],
        buttonText: "Sign Up",
    },
    {
        name: "Scale Tier",
        description: "For larger companies with complex needs",
        price: "$199",
        priceDescription: "per month",
        features: [
            "3 Projects",
            "100 sprints per month",
            "Advanced LLM (Claude Sonnet 3.7, backup by o3-mini high)",
            "Expert Software developer support",
            "2 Environments per project: Development and Production",
            "Extra sprints: $1 per sprint",
        ],
        buttonText: "Sign Up",
    },
];

const enterpriseTier = {
    name: "Enterprise",
    description: "Customized solutions for your organization",
    features: [
        "Unlimited projects",
        "Unlimited sprints",
        "2 Environments per project",
        "Advanced LLM (Claude Sonnet 3.7, backup by o3-mini high)",
        "Email Support, Infrastructure setup support, Dedicated Support, and Code Edition Support",
        "Project not deleted while in subscription",
    ],
    buttonText: "Contact Us",
};

export default function Subscription() {
    const router = useRouter();

    const handleButtonClick = (tier: string) => {
        if (tier === "Enterprise") {
            router.push("/contact");
        } else {
            router.push("/signup");
        }
    };

    return (
        <div className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-flex items-center rounded-lg bg-tertiary-dark px-3 py-1 text-sm font-medium">
                        <span className="bg-gradient-to-r from-genesoft to-genesoft/80 bg-clip-text text-transparent">
                            Subscription Plans
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Choose the Right Plan for Your Needs
                    </h2>
                    <p className="max-w-[700px] text-subtext-in-dark-bg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Get access to our AI-powered software development team
                        with plans designed for every stage of your business.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {pricingTiers.map((tier, i) => (
                        <Card
                            key={i}
                            className={cn(
                                "relative flex flex-col justify-between",
                                tier.highlighted
                                    ? "border-genesoft bg-tertiary-dark/50 shadow-lg shadow-genesoft/20"
                                    : "bg-tertiary-dark border-line-in-dark-bg",
                            )}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-genesoft px-3 py-1 text-xs font-semibold text-white">
                                    Popular
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl text-white">
                                    {tier.name}
                                </CardTitle>
                                <CardDescription className="text-subtext-in-dark-bg">
                                    {tier.description}
                                </CardDescription>
                                <div className="mt-4 flex items-baseline text-white">
                                    <span className="text-4xl font-bold tracking-tight">
                                        {tier.price}
                                    </span>
                                    <span className="ml-1 text-sm font-medium text-subtext-in-dark-bg">
                                        /{tier.priceDescription}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {tier.features.map((feature, j) => (
                                        <li
                                            key={j}
                                            className="flex items-start"
                                        >
                                            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                                <Check className="h-3 w-3 text-genesoft" />
                                            </div>
                                            <span className="text-sm text-subtext-in-dark-bg">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={cn(
                                        "w-full",
                                        tier.highlighted
                                            ? "bg-genesoft hover:bg-genesoft/90 text-white"
                                            : tier.buttonVariant === "outline"
                                              ? "border-line-in-dark-bg text-black hover:bg-tertiary-dark hover:text-white"
                                              : "bg-secondary-dark hover:bg-tertiary-dark text-white",
                                    )}
                                    variant={tier.buttonVariant || "default"}
                                    onClick={() => handleButtonClick(tier.name)}
                                >
                                    {tier.buttonText}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Enterprise Card */}
                <div className="mt-12">
                    <Card className="overflow-hidden border-line-in-dark-bg bg-gradient-to-r from-secondary-dark to-tertiary-dark">
                        <div className="sm:flex sm:items-start sm:justify-between">
                            <div className="p-6">
                                <CardTitle className="text-2xl text-white">
                                    {enterpriseTier.name}
                                </CardTitle>
                                <CardDescription className="mt-2 text-subtext-in-dark-bg">
                                    {enterpriseTier.description}
                                </CardDescription>

                                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {enterpriseTier.features.map(
                                        (feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start"
                                            >
                                                <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                                    <Check className="h-3 w-3 text-genesoft" />
                                                </div>
                                                <span className="text-sm text-subtext-in-dark-bg">
                                                    {feature}
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                            <div className="flex items-center justify-center bg-genesoft/10 p-6">
                                <Button
                                    size="lg"
                                    className="h-12 text-base bg-genesoft hover:bg-genesoft/90 text-white w-full md:w-auto"
                                    onClick={() =>
                                        handleButtonClick(enterpriseTier.name)
                                    }
                                >
                                    {enterpriseTier.buttonText}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Glossary Section */}
                <div className="mt-16 bg-tertiary-dark border border-line-in-dark-bg rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <InfoIcon className="w-5 h-5 mr-2 text-genesoft" />{" "}
                        Glossary
                    </h3>
                    <p className="text-subtext-in-dark-bg mb-4">
                        <strong className="text-white">
                            Sprint (iteration)
                        </strong>{" "}
                        is 1 round that triggers our Software development AI
                        Agent team to develop software based on conversation
                        between your team and Genesoft Project Manager. It has 3
                        types including page development, feature development,
                        and project creation.
                    </p>
                    <p className="text-subtext-in-dark-bg">
                        Each tier includes a set number of sprints per month.
                        Additional sprints will be charged according to your
                        plan's overage rate.
                    </p>
                </div>
            </div>
        </div>
    );
}
