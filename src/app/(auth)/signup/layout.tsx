import type { Metadata } from "next";
import "@/app/globals.css";
import { PostHogProvider } from "@/app/posthog-provider";
export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign Up to Genesoft",
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
