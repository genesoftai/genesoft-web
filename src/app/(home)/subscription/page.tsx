import React from "react";
import Footer from "@/components/info/InfoPagesFooter";
import Subscription from "@/components/info/Subscription";
import posthog from "posthog-js";

export default function SubscriptionPage() {
    posthog.capture("pageview_subscription");
    return (
        <div className="w-full grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 bg-primary-dark text-subtext-in-dark-bg">
            <main className="flex flex-col items-center gap-8 row-start-2 w-full justify-center">
                <Subscription />
            </main>
            <footer className="row-start-4 flex gap-6 flex-wrap items-center justify-center bg-primary-dark w-full">
                <Footer />
            </footer>
        </div>
    );
}
