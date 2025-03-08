import React from "react";
import { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Contact | Genesoft - AI Agent workspace for your high potential small team",
    description:
        "Contact Genesoft for any questions or support. We're here to help you with your project needs.",
};

export default function ContactLayout({
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
