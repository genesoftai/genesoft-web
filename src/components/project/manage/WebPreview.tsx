import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    MessageSquare,
    Monitor,
    Smartphone,
    AppWindow,
    Loader2,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Image from "next/image";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import { buildWebApplication } from "@/actions/development";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface WebPreviewProps {
    project: Project | null;
}

export function WebPreview({ project }: WebPreviewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isBuilding, setIsBuilding] = useState(false);

    const handleAddFeedback = () => {
        router.push(`/dashboard/project/manage/${project?.id}/feedback`);
    };

    const handleBuildWebApplication = async () => {
        if (!project?.id) {
            toast({
                title: "Project ID is required",
                description: "Please select a project",
            });
            return;
        }

        try {
            setIsBuilding(true);
            await buildWebApplication(project?.id);
            toast({
                title: "Software Development team of AI Agent working on new version of your web application",
                description:
                    "Please waiting for email notification when new version of your web application is ready",
                duration: 10000,
            });
        } catch (error) {
            console.error("Error building web application:", error);
            toast({
                title: "Failed to build web application",
                description:
                    "Please try again, Make sure that you build new version of your web application when you updated requirements in pages, features, and branding only.",
                variant: "destructive",
                duration: 10000,
            });
        } finally {
            setIsBuilding(false);
        }
    };

    return (
        <Card className="bg-primary-dark text-white border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-2xl">
                        Web preview
                    </CardTitle>
                    <div className="flex items-center gap-1 rounded-full border p-1">
                        <Toggle aria-label="Desktop view" defaultPressed>
                            <Monitor className="h-4 w-4" />
                        </Toggle>
                        <Toggle aria-label="Mobile view">
                            <Smartphone className="h-4 w-4" />
                        </Toggle>
                    </div>
                </div>
                <CardDescription className="text-subtext-in-dark-bg">
                    Preview User interface of your web
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 ">
                <div className="relative aspect-[320/690] w-[320px] overflow-hidden rounded-[2.5rem] border-8 border-gray-900 bg-gray-900">
                    <div className="absolute inset-x-0 top-0 h-[2rem] w-full bg-gray-900">
                        <div className="absolute left-1/2 top-2 h-2 w-16 -translate-x-1/2 rounded-full bg-gray-800" />
                    </div>
                    <div className="h-full w-full overflow-hidden bg-white">
                        <Image
                            src="/placeholder.svg"
                            alt="Mobile preview"
                            width={304}
                            height={674}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            className="flex items-center gap-2 bg-genesoft w-fit self-center hover:bg-white hover:text-black"
                            onClick={handleAddFeedback}
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>Add Feedback</span>
                        </Button>
                        <span className="text-xs text-subtext-in-dark-bg">
                            Talk with AI Agent for feedback to improve your web
                            application
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <Button
                            onClick={handleBuildWebApplication}
                            className="flex items-center gap-2 bg-genesoft w-fit self-center hover:bg-white hover:text-black"
                        >
                            <AppWindow className="h-4 w-4" />
                            <span>Build web application</span>
                            {isBuilding && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                        </Button>
                        <span className="text-xs text-subtext-in-dark-bg">
                            inform AI Agent to build your web application
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
