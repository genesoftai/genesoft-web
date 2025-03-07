import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";

// Import the CodeSandbox SDK for browser
// Note: In a real implementation, you would need to set up a server endpoint
// to generate the start data for connecting to a sandbox
// import { connectToSandbox } from "@codesandbox/sdk/browser";

interface CodeSandboxPreviewProps {
    project: Project | null;
    onPage?: string;
}

const CodeSandboxPreview = ({ project, onPage }: CodeSandboxPreviewProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("preview");
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [portInfo, setPortInfo] = useState<{
        port: number;
        url: string;
    } | null>(null);

    // Generate the repository name based on project ID
    const getRepositoryName = () => {
        if (!project?.id) return null;
        return `genesoftai/nextjs_web-${project.id}`;
    };

    // Generate the CodeSandbox URL
    const getCodeSandboxUrl = () => {
        const repoName = getRepositoryName();
        if (!repoName) return null;

        // Format: https://codesandbox.io/s/github/{username}/{repo}
        return `https://codesandbox.io/s/github/${repoName}`;
    };

    useEffect(() => {
        if (project?.id) {
            setIsLoading(true);

            // Generate the preview URL
            const sandboxUrl = getCodeSandboxUrl();
            if (sandboxUrl) {
                setPreviewUrl(sandboxUrl);

                // In a real implementation, you would connect to the sandbox using the SDK
                // This would require a server endpoint to generate the start data
                // Example:
                // const connectSandbox = async () => {
                //   try {
                //     // Fetch start data from your server
                //     const response = await fetch(`/api/start-sandbox/${project.id}`);
                //     const startData = await response.json();
                //
                //     // Connect to the sandbox
                //     const sandbox = await connectToSandbox(startData);
                //
                //     // Wait for port to open (e.g., 3000 for Next.js)
                //     const portInfo = await sandbox.ports.waitForPort(3000);
                //     setPortInfo({
                //       port: portInfo.port,
                //       url: portInfo.getPreviewUrl()
                //     });
                //   } catch (error) {
                //     console.error("Error connecting to sandbox:", error);
                //   }
                // };
                //
                // connectSandbox();

                // For now, we'll simulate a port being available
                setTimeout(() => {
                    setPortInfo({
                        port: 3000,
                        url: `https://codesandbox.io/p/sandbox/github/${getRepositoryName()}/draft/elegant-resonance?file=%2FREADME.md&selection=%5B%7B%22endColumn%22%3A1%2C%22endLineNumber%22%3A1%2C%22startColumn%22%3A1%2C%22startLineNumber%22%3A1%7D%5D`,
                    });
                    setIsLoading(false);
                }, 2000);
            } else {
                setIsLoading(false);
            }
        }
    }, [project?.id]);

    const refreshIframe = () => {
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        refreshIframe();
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <Card
            className={`bg-primary-dark text-white border-none ${onPage === "manage-project" ? "w-full" : "max-w-[380px] md:max-w-[1024px]"}  self-center`}
        >
            <CardContent className="flex flex-col items-center gap-6">
                <iframe
                    src={previewUrl || ""}
                    style={{
                        width: "100%",
                        height: "500px",
                        border: "0",
                        borderRadius: "4px",
                        overflow: "hidden",
                    }}
                    title="genesoftai/nextjs-web_461237da-5b5d-4e98-9ea5-05a7c5328d8f/dev"
                    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                ></iframe>
            </CardContent>
        </Card>
    );
};

export default CodeSandboxPreview;
