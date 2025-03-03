import React from "react";
import { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Subscription Plans | Genesoft - AI-powered Web Development for Startups",
    description:
        "Choose the right plan for your project needs. From free to enterprise, we have a plan that fits your business.",
};

export default function SubscriptionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
