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
    return (
        <Card className="w-8/12 h-96 bg-primary-dark text-white flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl">{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Separator className="w-full bg-secondary-dark" />
            <CardContent className="mt-10">
                <div className="flex flex-col gap-y-4 w-full">
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-white text-sm font-bold">Purpose</p>
                        <p className="text-subtext-in-dark-bg">{purpose}</p>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <p className="text-white text-sm font-bold">
                            Target Audience
                        </p>
                        <p className="text-subtext-in-dark-bg">
                            {target_audience}
                        </p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end self-end">
                <Button
                    className="bg-genesoft text-white rounded-lg"
                    onClick={() =>
                        router.push(`/dashboard/project/manage/${id}`)
                    }
                >
                    Manage
                </Button>
            </CardFooter>
        </Card>
    );
}
