import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
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
import { getCollectionById } from "@/actions/collection";
import { formatDateToHumanReadable } from "@/utils/common/time";

interface ProjectCardProps {
    id: string;
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
    project_template_type: string;
    backend_requirements: string;
    collectionId?: string;
    created_at: string;
}

export function ProjectCard({
    id,
    name,
    description,
    purpose,
    target_audience,
    project_template_type,
    backend_requirements,
    collectionId,
    created_at,
}: ProjectCardProps) {
    const router = useRouter();
    const { updateProjectStore } = useProjectStore();
    const [projectType, setProjectType] = useState("");
    const { updateCollectionStore, clearCollectionStore } =
        useCollectionStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (project_template_type.startsWith("backend")) {
            setProjectType("backend");
        } else {
            setProjectType("frontend");
        }
    }, [project_template_type]);

    const handleGoToAiAgentWorkspace = async () => {
        setIsLoading(true);
        try {
            updateProjectStore({
                id,
                name,
                description,
                purpose,
                target_audience,
            });
            if (collectionId) {
                await handleSetupCollectionForWorkspace();
            } else {
                clearCollectionStore();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            router.push(`/dashboard/project/${id}/ai-agent`);
        }
    };

    const handleSetupCollectionForWorkspace = async () => {
        try {
            const collection = await getCollectionById(collectionId as string);
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
                <CardDescription className="flex flex-col items-center text-sm md:text-base">
                    <div className="gap-2 mb-4 w-full md:w-8/12">
                        <p className="text-subtext-in-dark-bg">
                            {projectType === "backend"
                                ? "Backend Requirements"
                                : "Web Application Description"}
                        </p>
                        <p className=" text-subtext-in-dark-bg text-xs md:text-sm max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent p-4 rounded-lg bg-secondary-dark/50">
                            {projectType === "backend"
                                ? backend_requirements
                                : description}
                        </p>
                    </div>
                    {purpose && purpose.length > 0 && (
                        <div className="mb-4">
                            <p className="">Purpose</p>
                            <p className="text-subtext-in-dark-bg text-xs md:text-sm">
                                {purpose}
                            </p>
                        </div>
                    )}
                    {target_audience && target_audience.length > 0 && (
                        <div className="mb-4">
                            <p className="">Target Audience</p>
                            <p className="text-subtext-in-dark-bg text-xs md:text-sm">
                                {target_audience}
                            </p>
                        </div>
                    )}
                </CardDescription>
            </CardHeader>
            <Separator className="w-full bg-secondary-dark" />
            <CardFooter className="flex justify-end md:justify-start mt-4">
                <div className="flex flex-row items-center gap-1 text-subtext-in-dark-bg">
                    <p className="text-xs">Created on</p>
                    <p className="text-xs">
                        {formatDateToHumanReadable(created_at)}
                    </p>
                </div>

                <Button
                    className="ms-auto bg-genesoft text-white rounded-lg text-xs md:text-base"
                    onClick={handleGoToAiAgentWorkspace}
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
