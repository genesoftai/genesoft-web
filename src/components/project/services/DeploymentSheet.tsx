import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileIcon, RocketIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectStore } from "@/stores/project-store";
import { ReadyStatus } from "@/types/web-application";
import { Badge } from "@/components/ui/badge";
import { getProjectServices, getSubscribeProject, subscribeProject, viewLogs, reDeployProject } from "@/actions/integration";
import { createSupabaseClient } from "@/utils/supabase/client";
import { toast } from "sonner";
interface DeploymentSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const DeploymentSheet = ({
    isOpen,
    onOpenChange,
}: DeploymentSheetProps) => {
    const { id: projectId } = useProjectStore();
    const [isSubscribed, setIsSubscribed] = useState(false);
    
    // Mock deployment status - replace with actual data fetching
    const [serviceInfo, setServiceInfo] = useState<any>(null);
    const [deploymentStatus, setDeploymentStatus] = useState('NONE');
    const isDeployed = deploymentStatus.toString() === ReadyStatus.READY.toString();
    const deploymentUrl = "https://example.genesoft.app";
    const supabase = createSupabaseClient();


    useEffect(() => {
        if (projectId) {
            // Fetch subscription status
            const fetchSubscriptionStatus = async () => {
                const response = await getSubscribeProject(projectId);
                console.log(response);
                for( const o of response) {
                    if(o.tier.indexOf('instance-') !== -1) {
                        setIsSubscribed(true);
                    }
                }
            }
            fetchSubscriptionStatus();

            // Fetch service status
            const fetchServiceStatus = async () => {
                try {
                    const response = await getProjectServices(projectId);
                    console.log("Service status:", response);
                    setDeploymentStatus(response.status);
                    setServiceInfo(response);
                    // Process service status here
                } catch (error) {
                    console.error("Error fetching service status:", error);
                }
            };
            fetchServiceStatus();
        }
    }, []);

    const handleSubscribe = async () => {
        if (isSubscribed) return;
        if (!projectId) return;
        const user = await supabase.auth.getUser(); 
        if (!user.data.user) return;
        try {
            // Get current URL for return URL
            const returnUrl = window.location.href;
            
            // Call the subscription endpoint
            const response = await subscribeProject(projectId, {
                uid: user.data.user?.id,
                returnUrl: returnUrl,
            });

            // If successful, redirect to the payment URL
            if (response?.url) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error("Error subscribing to deployment:", error);
        } 
    }

    const handleReDeploy = async () => {
        if (!projectId) return;
        const response = await reDeployProject(projectId);
        console.log("Re-deployed project:", response);
        try {
            // Show toast notification
            toast.success("Redeploying your project...", {
                description: "Your project is being redeployed. This may take a few minutes.",
                duration: 5000,
            });
            
            // log custom change service info
            console.log("Custom change service info: deploy_status -> deploying");
            // Update local state to show deploying status immediately
            setServiceInfo((prevInfo: any) => ({
                ...prevInfo,
                deploy_status: 'deploying'
            }));
            
            return response;
        } catch (error) {
            toast.error("Failed to redeploy project", {
                description: "There was an error redeploying your project. Please try again.",
                duration: 5000,
            });
            console.error("Error redeploying project:", error);
        }
    }

    const handleViewLogs = async () => {
        if (!projectId) return;
        const response = await viewLogs(projectId);
        console.log("Logs:", response);
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex bg-primary-dark border-secondary-dark hover:bg-primary-dark/80 hover:text-white"
                >
                    <RocketIcon className="h-4 w-4" />
                    <span className="text-xs font-medium">
                        {"Deployment"}
                    </span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="bg-primary-dark border-line-in-dark-bg p-6 text-white"
            >
                <SheetHeader>
                    <SheetTitle className="text-white">
                        Deployment Management
                    </SheetTitle>
                    <SheetDescription className="text-subtext-in-dark-bg">
                        Deploy and manage your service deployment.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                    <div className="py-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white">Current Status</h3>
                            <div className="flex flex-col gap-2 p-4 bg-primary-dark/30 rounded-lg border border-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Status:</span>
                                    {
                                        serviceInfo?.deploy_status === 'deploying' ?
                                        <Badge 
                                        className={`${
                                          'bg-yellow-400/50' 
                                        }`}
                                    >
                                        Deploying
                                    </Badge>:
                                    <Badge 
                                        className={`${
                                            deploymentStatus === 'HEALTHY' ? 'bg-emerald-400/50' : 
                                            deploymentStatus === 'STARTING' || deploymentStatus === 'RESUMING' ? 'bg-yellow-400/50' :
                                            deploymentStatus === 'DEGRADED' || deploymentStatus === 'UNHEALTHY' ? 'bg-red-500/50' :
                                            'bg-gray-400/50'
                                        }`}
                                    >
                                        {deploymentStatus}
                                    </Badge>
                                    }
                                    
                                </div>
                                
                                {isDeployed && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">URL:</span>
                                        <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                                            {deploymentUrl}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white">Instance Information</h3>
                            <div className="flex flex-col gap-2 p-4 bg-primary-dark/30 rounded-lg border border-white/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">CPU:</span>
                                    <span className="text-sm">0.25 vCPU</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">RAM:</span>
                                    <span className="text-sm">512MB</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Disk:</span>
                                    <span className="text-sm">512MB</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                    <span className="text-sm font-medium">Price:</span>
                                    <span className="text-sm">$5 per month</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white">Deployment Actions</h3>
                            <div className="flex flex-col gap-3">
                                {
                                    isSubscribed && (
                                        <Button 
                                            onClick={handleReDeploy}
                                            className="w-full bg-genesoft hover:bg-genesoft/80"
                                        >
                                            <RocketIcon className="h-4 w-4 mr-2" /> Re-deploy
                                        </Button>
                                )}


                                {
                                    !isSubscribed && (
                                        <Button 
                                            onClick={handleSubscribe}
                                            className="w-full bg-genesoft hover:bg-genesoft/80"
                                        >
                                            <RocketIcon className="h-4 w-4 mr-2" /> Subscribe to deploy
                                        </Button>
                                )}

                                {
                                        isSubscribed && (
                                    <Button 
                                        onClick={handleViewLogs}
                                        className="w-full bg-genesoft hover:bg-genesoft/80"
                                    >
                                        <FileIcon className="h-4 w-4 mr-2" />View Deployment Logs 
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default DeploymentSheet; 