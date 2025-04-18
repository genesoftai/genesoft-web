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
        <footer className="bg-genesoft-dark border-t border-line-in-dark-bg">
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
                    <div className="flex flex-col items-center gap-4 mt-8">
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

                    <p className="hidden text-subtext-in-dark-bg mb-6 max-w-xl mx-auto">
                        Subscribe to our newsletter to get updates on new
                        features, projects, and AI development trends
                    </p>
                    <div className="hidden flex flex-col sm:flex-row max-w-md mx-auto gap-2">
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
                            Empowering software developer to get 10x
                            productivity with Advanced AI Agent technology
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
                                    AI Agent Workspace
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
