import type { Metadata } from "next";
import "@/app/globals.css";
import React, { Suspense } from "react";

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
            <body>
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </body>
        </html>
    );
}
