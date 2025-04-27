import React from "react";
import Footer from "@/components/info/InfoPagesFooter";
import LandingPage from "@/components/info/LandingPage";
import posthog from "posthog-js";

export const maxDuration = 300;

export default function Home() {
    posthog.capture("pageview_home");

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 bg-genesoft-dark text-subtext-in-dark-bg w-full">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <LandingPage />
            </main>
            <footer className="row-start-4 flex gap-6 flex-wrap items-center justify-center bg-genesoft-dark w-full">
                <Footer />
            </footer>
        </div>
    );
}
