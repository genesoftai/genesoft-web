import type { Metadata } from "next";
import "@/app/globals.css";
import React, { Suspense } from "react";
import { PostHogProvider } from "@/app/posthog-provider";

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Reset Password of Curlent account",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <PostHogProvider>
                <body>
                    <Suspense fallback={<div>Loading...</div>}>
                        {children}
                    </Suspense>
                </body>
            </PostHogProvider>
        </html>
    );
}
