import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React, { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";
import { PostHogProvider } from "@/app/posthog-provider";
import PageLoading from "@/components/common/PageLoading";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Genesoft",
    description:
        "Genesoft is Software Development team of AI  Agent for small company and startups to get custom web applications without apy a lot for hiring a team of developers.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <PostHogProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {/* <Navbar /> */}
                    <SidebarProvider defaultOpen={false}>
                        <AppSidebar />
                        <main className="w-full">
                            <Suspense
                                fallback={
                                    <PageLoading
                                        size={30}
                                        text={"Loading information..."}
                                        color="#2563EB"
                                    />
                                }
                            >
                                <SidebarInset>{children}</SidebarInset>
                            </Suspense>
                        </main>
                    </SidebarProvider>
                </body>
            </PostHogProvider>
        </html>
    );
}
