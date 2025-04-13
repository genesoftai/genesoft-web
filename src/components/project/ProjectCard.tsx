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
import NextjsLogo from "@public/tech/nextjs.jpeg";
import NestjsLogo from "@public/tech/nestjs.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getFirstCharacterUppercase } from "@/utils/common/text";
import { AppWindow, Server } from "lucide-react";
import { useCollectionStore } from "@/stores/collection-store";
import { getCollectionByWebProjectId } from "@/actions/collection";

interface ProjectCardProps {
    id: string;
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
    project_template_type: string;
    backend_requirements: string;
}

export function ProjectCard({
    id,
    name,
    description,
    purpose,
    target_audience,
    project_template_type,
    backend_requirements,
}: ProjectCardProps) {
    const router = useRouter();
    const { updateProjectStore } = useProjectStore();
    const [projectType, setProjectType] = useState("");
    const { updateCollectionStore } = useCollectionStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (project_template_type.startsWith("backend")) {
            setProjectType("backend");
        } else {
            setProjectType("frontend");
        }
    }, [project_template_type]);

    const handleManageProject = async () => {
        setIsLoading(true);
        try {
            updateProjectStore({
                id,
                name,
                description,
                purpose,
                target_audience,
            });
            await handleSetupCollectionForWorkspace();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            router.push(`/dashboard/project/${id}/ai-agent`);
        }
    };

    const handleSetupCollectionForWorkspace = async () => {
        try {
            const collection = await getCollectionByWebProjectId(id);
            updateCollectionStore({
                id: collection.id,
                name: collection.name,
                description: collection.description,
                is_active: collection.is_active,
                web_project_id: collection.web_project_id,
                backend_service_project_ids:
                    collection.backend_service_project_ids,
                organization_id: collection.organization_id,
                created_at: collection.created_at,
                updated_at: collection.updated_at,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card className="w-full md:w-8/12 h-8/12 md:h-auto bg-primary-dark text-white flex flex-col border-none mb-4 md:mb-0">
            <CardHeader>
                <CardTitle className="text-base md:text-xl flex flex-row items-center gap-2 justify-between">
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-row items-center gap-2">
                            {projectType === "backend" ? (
                                <Server className="w-6 h-6 text-amber-500" />
                            ) : (
                                <AppWindow className="w-6 h-6 text-genesoft" />
                            )}
                            <span className="text-lg md:text-xl font-bold">
                                {name}
                            </span>
                        </div>

                        <p className="flex flex-row items-center gap-2">
                            <span className="text-xs md:text-base text-subtext-in-dark-bg">
                                {getFirstCharacterUppercase(projectType)}
                            </span>
                            <span className="text-xs md:text-base text-subtext-in-dark-bg">
                                {project_template_type
                                    .split("_")[1]
                                    .toUpperCase()}
                            </span>
                        </p>
                    </div>
                    <span className="text-xs md:text-base">
                        {projectType === "backend" ? (
                            <Image
                                src={NestjsLogo}
                                alt="Nestjs Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <Image
                                src={NextjsLogo}
                                alt="Nextjs Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        )}
                    </span>
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                    <p className="">
                        {projectType === "backend"
                            ? "Backend Requirements"
                            : "Web Application Description"}
                    </p>
                    <p className="text-subtext-in-dark-bg text-xs md:text-sm">
                        {projectType === "backend"
                            ? backend_requirements
                            : description}
                    </p>
                </CardDescription>
            </CardHeader>
            <Separator className="w-full bg-secondary-dark" />

            {projectType === "frontend" && (
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
            )}

            <CardFooter className="flex justify-end md:justify-start self-center md:self-end mt-4">
                <Button
                    className="bg-genesoft text-white rounded-lg text-xs md:text-base"
                    onClick={handleManageProject}
                >
                    <span className="text-xs md:text-base">
                        {isLoading
                            ? "Loading workspace..."
                            : "AI Agents workspace"}
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
}
