import type { Metadata } from "next";
import "../globals.css";
import { PostHogProvider } from "../posthog-provider";

export const metadata: Metadata = {
    title: "Sign up",
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
