import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/project-store";

interface ProjectCardProps {
    id: string;
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
}

export function ProjectCard({
    id,
    name,
    description,
    purpose,
    target_audience,
}: ProjectCardProps) {
    const router = useRouter();
    const { updateProjectStore } = useProjectStore();

    const handleManageProject = () => {
        updateProjectStore({
            id,
            name,
            description,
            purpose,
            target_audience,
        });
        router.push(`/dashboard/project/${id}/ai-agent`);
    };

    return (
        <Card className="w-full md:w-8/12 h-8/12 md:h-auto bg-primary-dark text-white flex flex-col border-none mb-4 md:mb-0">
            <CardHeader>
                <CardTitle className="text-base md:text-xl">{name}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                    {description}
                </CardDescription>
            </CardHeader>
            <Separator className="w-full bg-secondary-dark" />
            <CardContent className="mt-4 md:mt-10">
                <div className="flex flex-col gap-y-4 w-full">
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-white text-sm md:text-base font-bold">
                            Purpose
                        </p>
                        <p className="text-subtext-in-dark-bg text-sm md:text-base">
                            {purpose}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-white text-sm md:text-base font-bold">
                            Target Audience
                        </p>
                        <p className="text-subtext-in-dark-bg text-sm md:text-base">
                            {target_audience}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end md:justify-start self-center md:self-end">
                <Button
                    className="bg-genesoft text-white rounded-lg text-xs md:text-base"
                    onClick={handleManageProject}
                >
                    <span className="text-xs md:text-base">Manage</span>
                </Button>
            </CardFooter>
        </Card>
    );
}
