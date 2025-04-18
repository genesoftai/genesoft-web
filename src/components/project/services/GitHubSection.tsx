"use client";

import React, { useEffect, useState } from "react";
import { getGithubUsername, requestGithubAccess } from "@/actions/integration";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import GenesoftLoading from "@/components/common/GenesoftLoading";

type GitHubSectionProps = {
    projectId: string;
};

export const GitHubSection = ({ projectId }: GitHubSectionProps) => {
    const [loading, setLoading] = useState(false);
    const supabase = createSupabaseClient();

    const [isReady, setIsReady] = useState(false);
    const [isGithubConnected, setIsGithubConnected] = useState(false);
    const [githubUsername, setGithubUsername] = useState("");
    useEffect(() => {
        const checkGithubConnection = async () => {
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                const githubData = await getGithubUsername(user.data.user.id);
                setIsGithubConnected(githubData);
                setGithubUsername(githubData);
            }
            setIsReady(true);
        };
        setTimeout(() => {
            checkGithubConnection();
        }, 1000);
    }, []);



    const handleRequestGithubAccess = async () => {
        try {
            setLoading(true);
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                // Check if the user has a GitHub username
                const githubData = await getGithubUsername(user.data.user.id);
                
                if (!githubData || !githubData.username) {
                    toast.error("You need to sign in with GitHub to use this feature");
                    return;
                }
                
                await requestGithubAccess(projectId, user.data.user.id);
                toast.success("GitHub access requested successfully");
            } else {
                throw new Error("No session found");
            }
        } catch (error) {
            console.error("Error requesting GitHub access:", error);
            toast.error("Failed to request GitHub access");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Github className="h-5 w-5" />
                <h3 className="text-lg font-medium text-white">
                    GitHub Integration
                </h3>
            </div>
            <p className="text-sm text-subtext-in-dark-bg">
                Connect your project with GitHub to enable source control and
                collaboration features.
            </p>
            {
                isReady ? (
                    <div className="pt-2">
                {
                    isGithubConnected ? (
                <Button
                    onClick={handleRequestGithubAccess}
                    variant="outline"
                    className="w-full bg-primary-dark border-line-in-dark-bg hover:bg-genesoft/80 text-white hover:text-white"
                    disabled={loading || !isGithubConnected}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Requesting Access...
                        </>
                    ) : (
                        `Request ${githubUsername} GitHub Access`
                    )}
                </Button>
                    ) : (
                       <i>Please connect your GitHub account to use this feature</i>
                    )}
                </div>
            ) : (
                <GenesoftLoading size={50} />
            )}
        </div>
    );
};

export default GitHubSection;
