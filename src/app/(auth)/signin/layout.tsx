import type { Metadata } from "next";
import "@/app/globals.css";
import { PostHogProvider } from "@/app/posthog-provider";
export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to Genesoft",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <PostHogProvider>
                <body>{children}</body>
            </PostHogProvider>
        </html>
    );
}
