"use client";

import { ChangeEvent, useState } from "react";
import GenesoftLogo from "@/components/common/GenesoftLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeGenesoftEmail } from "@/actions/email";
import SimpleLoading from "@/components/common/SimpleLoading";
import posthog from "posthog-js";
import {
    Github,
    Twitter,
    Linkedin,
    Mail,
    ArrowRight,
    Check,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const subscribeEmail = async () => {
        posthog.capture("click_subscribe_to_newsletter_from_info_pages_footer");
        setLoading(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            try {
                await subscribeGenesoftEmail({ email });
                setLoading(false);
                setEmail("");
                setSubscribed(true);
                setTimeout(() => setSubscribed(false), 3000);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        } else {
            alert("Please enter a valid email address");
            setLoading(false);
        }
    };

    return (
        <footer className="bg-primary-dark border-t border-line-in-dark-bg">
            {/* Top decorative keyboard-like element */}
            <div className="py-4 px-4 overflow-hidden border-b border-line-in-dark-bg">
                <div className="max-w-5xl mx-auto grid grid-cols-10 md:grid-cols-20 gap-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-sm ${i % 3 === 0 ? "bg-tertiary-dark" : i % 4 === 0 ? "bg-genesoft/30" : "bg-secondary-dark"}`}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Newsletter section at top - Raycast style */}
                <div className="max-w-3xl mx-auto mb-20 text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Stay up to date with Genesoft
                    </h3>
                    <p className="text-subtext-in-dark-bg mb-6 max-w-xl mx-auto">
                        Subscribe to our newsletter to get updates on new
                        features, projects, and AI development trends
                    </p>
                    <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
                        <div className="relative flex-grow">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-tertiary-dark border-line-in-dark-bg hover:border-genesoft/50 focus:border-genesoft text-white h-12 px-4 rounded-lg focus:ring-genesoft/30"
                                onChange={handleEmailChange}
                                value={email}
                            />
                        </div>
                        <Button
                            className={`h-12 px-5 transition-all duration-300 rounded-lg ${
                                subscribed
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-genesoft hover:bg-genesoft/90"
                            }`}
                            onClick={subscribeEmail}
                            disabled={loading}
                        >
                            {loading ? (
                                <SimpleLoading color="#FFFFFF" size={24} />
                            ) : subscribed ? (
                                <>
                                    <Check className="mr-2 h-5 w-5" />{" "}
                                    Subscribed
                                </>
                            ) : (
                                <>
                                    Subscribe{" "}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-16">
                    <div className="mb-8 md:mb-0 flex flex-col">
                        <GenesoftLogo />
                        <p className="text-subtext-in-dark-bg mt-4">
                            Empowering small businesses and startups with
                            AI-powered web development
                        </p>
                        <div className="flex items-center space-x-4 mt-6">
                            <a
                                href="https://github.com"
                                className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a
                                href="https://twitter.com"
                                className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a
                                href="https://linkedin.com"
                                className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Product</h4>
                        <ul className="space-y-2">
                            {/* <li>
                                <Link
                                    href="/"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    Features
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link
                                    href="/"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li> */}
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">
                            Resources
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/subscription"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    Pricing
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    href="/"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    Guides
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    API
                                </Link>
                            </li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="mailto:support@genesoftai.com"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors flex items-center"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    support@genesoftai.com
                                </a>
                            </li>
                            {/* <li>
                                <Link
                                    href="/"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-subtext-in-dark-bg hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-line-in-dark-bg mt-16 pt-8 text-center text-subtext-in-dark-bg/70">
                    <p>
                        &copy; {new Date().getFullYear()} Genesoft AI
                        Technology. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
