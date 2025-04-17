"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { createSupabaseClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import GenesoftLoading from "@/components/common/GenesoftLoading";
import { getDatabaseSubscriptionStatus, subscribeDatabaseService } from "@/actions/integration";

type DbSectionProps = {
    projectId: string;
};

export const DbSection = ({ projectId }: DbSectionProps) => {
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribe, setSubscribe] = useState({
        status: "none",
        expiredAt: null,
    });
    const supabase = createSupabaseClient();

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            try {
                setIsLoading(true);
                const response = await getDatabaseSubscriptionStatus(projectId);
                setIsSubscribed(response.isSubscribed);
                setSubscribe({
                    status: response.status,
                    expiredAt: response.expiredAt,
                });
            } catch (error) {
                console.error("Error fetching database subscription:", error);
                toast.error("Failed to load database subscription status");
            } finally {
                setIsLoading(false);
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
            setLoading(true);
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
            setLoading(false);
        }
    };

    const expiredAt = useMemo(
        () => subscribe.expiredAt ? new Date(subscribe.expiredAt) : null,
        [subscribe.expiredAt],
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <h3 className="text-lg font-medium text-white">
                    Database Integration
                </h3>
            </div>
            <p className="text-sm text-subtext-in-dark-bg">
                Manage your project database by enabling enhanced database
                features and analytics.
            </p>
            <h4 className="text-sm font-medium text-white">
                {isSubscribed ? "Database Features Unlocked 🎉" : "Subscribe to Database Services"}
            </h4>
            {isLoading ? (
                <GenesoftLoading size={50} />
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
                    
                    {isSubscribed ? (
                        <div className="bg-primary-dark/30 p-4 rounded-lg border border-white/10 space-y-2">
                            <h4 className="text-sm font-medium text-white">
                                Database Connection Details
                            </h4>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-white font-medium">
                                        Connection URL:
                                    </span>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        postgresql://user:password@your-database-host:5432/defaultdb
                                    </p>
                                </div>
                                <div>
                                    <span className="text-white font-medium">
                                        Host:
                                    </span>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        your-database-host.genesoft.app
                                    </p>
                                </div>
                                <div>
                                    <span className="text-white font-medium">
                                        Port:
                                    </span>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        5432
                                    </p>
                                </div>
                                <div>
                                    <span className="text-white font-medium">
                                        Password:
                                    </span>
                                    <p className="text-subtext-in-dark-bg text-sm">
                                        ********
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-primary-dark/30 p-4 rounded-lg border border-white/10 space-y-2">
                                <h4 className="text-sm font-medium text-white">
                                    Database Information
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Type:</span>
                                        <span className="text-sm">PostgreSQL</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Storage:</span>
                                        <span className="text-sm">1GB</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Connections:</span>
                                        <span className="text-sm">Up to 10 concurrent</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                        <span className="text-sm font-medium">Price:</span>
                                        <span className="text-sm">$10 per month</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-yellow-400">
                                You need to subscribe to unlock database features.
                            </p>
                            <Button
                                onClick={handleSubscribe}
                                variant="outline"
                                className="w-full bg-genesoft hover:bg-genesoft/80 text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="mr-2 loader animate-spin" />{" "}
                                        Redirecting...
                                    </>
                                ) : (
                                    `Subscribe to Database Service`
                                )}
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DbSection;
