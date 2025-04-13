"use client";

import React, { useState } from "react";
import { requestGithubAccess } from "@/actions/integration";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { createSupabaseClient } from "@/utils/supabase/client";

type GitHubSectionProps = {
    projectId: string;
};

export const GitHubSection = ({ projectId }: GitHubSectionProps) => {
    const [loading, setLoading] = useState(false);
    const supabase = createSupabaseClient();

    const handleRequestGithubAccess = async () => {
        try {
            setLoading(true);
            const user = await supabase.auth.getUser();
            if (user.data.user) {
                await requestGithubAccess(projectId, user.data.user.id);
            } else {
                throw new Error("No session found");
            }
        } catch (error) {
            console.error("Error requesting GitHub access:", error);
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
            <div className="pt-2">
                <Button
                    onClick={handleRequestGithubAccess}
                    variant="outline"
                    className="w-full bg-primary-dark border-line-in-dark-bg hover:bg-primary-dark/80 text-white"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Requesting Access...
                        </>
                    ) : (
                        "Request GitHub Access"
                    )}
                </Button>
            </div>
        </div>
    );
};

export default GitHubSection;
