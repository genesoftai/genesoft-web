import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/sidebar/app-sidebar";

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
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* <Navbar /> */}
                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full">
                        <SidebarInset>{children}</SidebarInset>
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}
