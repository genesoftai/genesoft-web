"use client";

import React, { useState } from "react";
import { Check, InfoIcon, Send } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/actions/email";

export default function Contact() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        message: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.companyName || !formData.email || !formData.message) {
            toast({
                title: "Missing information",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await sendContactEmail({
                companyName: formData.companyName,
                email: formData.email,
                reason: formData.message,
            });

            if (response) {
                toast({
                    title: "Message sent",
                    description: "We'll get back to you soon!",
                });
                setFormData({
                    companyName: "",
                    email: "",
                    message: "",
                });
                router.push("/");
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                title: "Error",
                description: "Failed to send your message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="inline-flex items-center rounded-lg bg-tertiary-dark px-3 py-1 text-sm font-medium">
                        <span className="bg-gradient-to-r from-genesoft to-genesoft/80 bg-clip-text text-transparent">
                            Enterprise Contact
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Get in Touch for Enterprise Solutions
                    </h2>
                    <p className="max-w-[700px] text-subtext-in-dark-bg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Let us know about your enterprise needs and our team
                        will create a customized solution for your organization.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-[800px]">
                    <Card className="border-line-in-dark-bg bg-tertiary-dark">
                        <CardHeader>
                            <CardTitle className="text-xl text-white">
                                Enterprise Contact Form
                            </CardTitle>
                            <CardDescription className="text-subtext-in-dark-bg">
                                Fill out the form below and our team will get
                                back to you shortly.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="companyName"
                                        className="text-white"
                                    >
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        placeholder="Your company name"
                                        className="bg-secondary-dark border-line-in-dark-bg text-white"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-white"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your-email@company.com"
                                        className="bg-secondary-dark border-line-in-dark-bg text-white"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="message"
                                        className="text-white"
                                    >
                                        Why do you need Genesoft Enterprise?
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us about your project requirements and goals..."
                                        className="min-h-[150px] bg-secondary-dark border-line-in-dark-bg text-white"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-genesoft hover:bg-genesoft/90 text-white"
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
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>

                <div className="mt-16 bg-tertiary-dark border border-line-in-dark-bg rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <InfoIcon className="w-5 h-5 mr-2 text-genesoft" />{" "}
                        Enterprise Benefits
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex items-start">
                            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                <Check className="h-3 w-3 text-genesoft" />
                            </div>
                            <span className="text-sm text-subtext-in-dark-bg">
                                Unlimited projects and sprints
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                <Check className="h-3 w-3 text-genesoft" />
                            </div>
                            <span className="text-sm text-subtext-in-dark-bg">
                                {
                                    "Advanced AI models for complex development (Claude Sonnet 3.7, backup by o3-mini high)"
                                }
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                <Check className="h-3 w-3 text-genesoft" />
                            </div>
                            <span className="text-sm text-subtext-in-dark-bg">
                                {
                                    "Email Support, Infrastructure setup support, Dedicated Support, and Code Edition Support"
                                }
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                <Check className="h-3 w-3 text-genesoft" />
                            </div>
                            <span className="text-sm text-subtext-in-dark-bg">
                                {"Custom infrastructure setup (AWS, GCP)"}
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                <Check className="h-3 w-3 text-genesoft" />
                            </div>
                            <span className="text-sm text-subtext-in-dark-bg">
                                {"Multiple environments per project"}
                            </span>
                        </li>
                        <li className="flex items-start">
                            <div className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-genesoft/20">
                                <Check className="h-3 w-3 text-genesoft" />
                            </div>
                            <span className="text-sm text-subtext-in-dark-bg">
                                {"Tailored solutions for your specific needs"}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
