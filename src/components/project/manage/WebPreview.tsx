import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MessageSquare, PencilRuler, Monitor, Smartphone } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Image from "next/image";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";

interface WebPreviewProps {
    project: Project | null;
}

export function WebPreview({ project }: WebPreviewProps) {
    const router = useRouter();

    const handleUpdateRequirements = () => {
        router.push(
            `/dashboard/project/manage/${project?.id}/requirements/info`,
        );
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
                <div className="grid w-full gap-4 md:grid-cols-2 place-items-center">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-genesoft border-none w-fit"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Add Feedback
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-genesoft border-none w-fit"
                        onClick={handleUpdateRequirements}
                    >
                        <PencilRuler className="h-4 w-4" />
                        Update requirements
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
