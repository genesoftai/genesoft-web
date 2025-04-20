"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, ClipboardCopy } from "lucide-react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { getDatabaseCredentials, getSubscribeProject, subscribeDatabaseService } from "@/actions/integration";
import SimpleLoading from "@/components/common/SimpleLoading";

type DbSectionProps = {
    projectId: string;
};

type DatabaseConnectionDetails = {
    db_name: string;
    db_user: string;
    db_password: string;
    host: string;
    port: number;
};

export const DbSection = ({ projectId }: DbSectionProps) => {

    const [subscribeLoading, setSubscribeLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [dbConnectionDetails, setDbConnectionDetails] = useState<DatabaseConnectionDetails | null>(null);
    const [subscribe, setSubscribe] = useState({
        status: "none",
        expiredAt: null,
    });
    const supabase = createSupabaseClient();

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            try {
                const response = await getSubscribeProject(projectId);
                let isSubscribed = false;
                for (const sub of response) { 
                    if (sub.tier.indexOf('db-') !== -1) {
                        isSubscribed = true;
                        setIsSubscribed(true);
                        setSubscribe({
                            status: sub.status,
                            expiredAt: sub.expiredAt,
                        });
                    }
                }
                if (!isSubscribed) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error fetching database subscription:", error);
                toast.error("Failed to load database subscription status");
            }
        };

        if (projectId) {
            fetchSubscriptionStatus();
        }
    }, [projectId]);

    const handleSubscribe = async () => {
        if (!projectId) return;
        
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
            toast.error("You must be logged in to subscribe");
            return;
        }
        
        try {
            setSubscribeLoading(true);
            // Get current URL for return URL
            const returnUrl = window.location.href;
            
            // Call the subscription endpoint
            const response = await subscribeDatabaseService(projectId, {
                uid: user.data.user.id,
                returnUrl: returnUrl,
            });

            // If successful, redirect to the payment URL
            if (response?.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error("Error subscribing to database service:", error);
            toast.error("Failed to subscribe to database service");
        } finally {
            setSubscribeLoading(false);
        }
    };

    const expiredAt = useMemo(
        () => subscribe.expiredAt ? new Date(subscribe.expiredAt) : null,
        [subscribe.expiredAt],
    );

    useEffect(() => {
        const fetchDatabaseCredentials = async () => {
            try {
                const credentials = await getDatabaseCredentials(projectId);
                setDbConnectionDetails(credentials);
            } catch (error) {
                console.error("Error fetching database credentials:", error);
                toast.error("Failed to load database connection details");
            } finally {
                setIsLoading(false);
            }
        };

        if (isSubscribed) {
            fetchDatabaseCredentials();
        }
    }, [isSubscribed, projectId]);

    return (
        <div className="space-y-4" style={{ wordWrap: 'break-word', width: '90%' }}>
            <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <h3 className="text-lg font-medium text-white">
                    Infrastructure Integration
                </h3>
            </div>
            <p className="text-sm text-subtext-in-dark-bg break-words">
                Enhanced your project by enabling  database, authentication and deployment instance.
            </p>
            <h4 className="text-sm font-medium text-white">
                {isSubscribed ? "Database Features Unlocked 🎉" : "Subscribe to Database Services"}
            </h4>
            {isLoading ? (
                <div className="flex justify-center items-center"><SimpleLoading size={36} color="#1E62D0" /></div>
            ) : (
                <div className="pt-2 space-y-4">
                    {isSubscribed && expiredAt && (
                        <>
                            <p>Valid till</p>
                            <h3 className="text-sm text-subtext-in-dark-bg">
                                {expiredAt.toLocaleString()}
                            </h3>
                        </>
                    )}
                    
                    {!isLoading && dbConnectionDetails ? (
                        <div className="p-4 rounded-lg border border-white/10 space-y-2" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                            <h4 className="text-sm font-medium text-white">
                                Database Connection Details
                            </h4>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-white font-medium">
                                        Connection URL:
                                    </div>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        postgresql://{dbConnectionDetails?.db_user}:{dbConnectionDetails?.db_password}@{dbConnectionDetails?.host}:{dbConnectionDetails?.port}/{dbConnectionDetails?.db_name}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-white font-medium">
                                        Host:
                                    </div>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        {dbConnectionDetails?.host}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-white font-medium">
                                        Port:
                                    </div>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        {dbConnectionDetails?.port}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-white font-medium">
                                        Username:
                                    </div>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        {dbConnectionDetails?.db_user}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-white font-medium">
                                        Database:
                                    </div>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        {dbConnectionDetails?.db_name}
                                    </p>
                                </div>
                                <div>
                                    <div className="text-white font-medium">
                                        Password:
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-subtext-in-dark-bg text-sm">
                                            {"********"} <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 px-2 text-xs text-white/70 hover:text-white"
                                            onClick={() => {
                                                navigator.clipboard.writeText(dbConnectionDetails?.db_password || "");
                                                toast.success("Password copied to clipboard");
                                            }}
                                        >
                                            <div className="sr-only">Copy password</div>
                                            <ClipboardCopy className="h-3.5 w-3.5" />
                                        </Button>
                                        </p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}


                    {
                        !isLoading && !isSubscribed && (
                                <>
                                <div className="bg-primary-dark/30 p-4 rounded-lg border border-white/10 space-y-2">
                                    <div className="mb-4">
                                    <h4 className="text-sm font-medium text-white mb-2">
                                        <b>Database Information</b>
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Type:</span>
                                            <span className="text-sm">PostgreSQL</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Storage:</span>
                                            <span className="text-sm">200MB</span>
                                        </div>
                                    </div>
                                    </div>
                                    <div className="mb-4 pt-4 border-t border-white/10">
                                        <h4 className="text-sm font-medium text-white">
                                           <b> Authentication</b>
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">
                                                Allow to use our provided Authentication method to integrate with your project.
                                                Google, Github, Email/Password, etc.
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4 pt-4 border-t border-white/10">
                                        <h4 className="text-sm font-medium text-white">
                                            <b>Deployment Instance</b>
                                        </h4>
                                        <div className="space-y-2 mb-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">
                                                Allow deploy your project to a cloud instance.
                                            </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">CPU:</span>
                                                <span className="text-sm">0.25 vCPU</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">RAM:</span>
                                                <span className="text-sm">512GB</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Disk:</span>
                                                <span className="text-sm">512GB</span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm font-medium">Price:</span>
                                            <span className="text-sm">$10 per month</span>
                                        </div>

                                  
                                </div>
                                <p className="text-sm text-yellow-400">
                                    You need to subscribe to unlock features.
                                </p>
                                <Button
                                    onClick={handleSubscribe}
                                    variant="outline"
                                    className="w-full bg-genesoft hover:bg-genesoft/80 text-white"
                                    disabled={subscribeLoading}
                                >
                                    {subscribeLoading ? (
                                        <>
                                            <span className="mr-2 loader animate-spin" />{" "}
                                            Redirecting...
                                        </>
                                    ) : (
                                        `Subscribe to Integration Service`
                                    )}
                                </Button>
                            </>
                        ) 
                    }
                </div>
            )}
        </div>
    );
};

export default DbSection;
