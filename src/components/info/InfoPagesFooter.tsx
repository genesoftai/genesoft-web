"use client";

import { ChangeEvent, useState } from "react";
import GenesoftLogo from "@/components/common/GenesoftLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeGenesoftEmail } from "@/actions/email";
import SimpleLoading from "@/components/common/SimpleLoading";
import posthog from "posthog-js";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

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
        <footer className="bg-background border-t">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="mb-8 md:mb-0 flex flex-col items-start gap-y-4">
                        <GenesoftLogo />
                        <p className="text-muted-foreground mb-4">
                            Empowering business with Software Engieering team of
                            AI Agent
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <p className="text-muted-foreground mb-2">Need help?</p>
                        <a
                            href="mailto:support@genesoftai.com"
                            className="text-primary hover:underline"
                        >
                            support@genesoftai.com
                        </a>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Newsletter
                        </h3>
                        <p className="text-muted-foreground mb-2">
                            Stay updated with our latest news
                        </p>
                        <form className="flex flex-col sm:flex-row gap-2 md:items-center">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-grow"
                                onChange={handleEmailChange}
                                value={email}
                            />
                            <Button
                                className="cursor-pointer bg-genesoft hover:bg-genesoft/90"
                                onClick={subscribeEmail}
                            >
                                Subscribe
                            </Button>
                            {loading && (
                                <SimpleLoading color="#2563EB" size={30} />
                            )}
                        </form>
                    </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
                    <p>
                        &copy; 2024 Genesoft AI Technology. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
