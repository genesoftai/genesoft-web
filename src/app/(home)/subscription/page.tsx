import React from "react";
import Footer from "@/components/info/InfoPagesFooter";
import Subscription from "@/components/info/Subscription";
import posthog from "posthog-js";

export default function SubscriptionPage() {
    posthog.capture("pageview_subscription");
    return (
        <div className="flex flex-col min-h-screen bg-primary-dark text-subtext-in-dark-bg">
            <main className="flex-1 container mx-auto px-4">
                <Subscription />
            </main>
            <footer className="w-full bg-primary-dark py-6">
                <div className="container mx-auto px-4 flex justify-center items-center flex-wrap gap-6">
                    <Footer />
                </div>
            </footer>
        </div>
    );
}
