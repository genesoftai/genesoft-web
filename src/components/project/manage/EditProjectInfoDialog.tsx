"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2 } from "lucide-react";
import { updateProjectInfo } from "@/actions/project";

const componentName = "EditProjectInfoDialog";

interface EditProjectInfoDialogProps {
    projectId: string;
    projectName: string;
    projectDescription: string;
    projectPurpose: string;
    projectTargetAudience: string;
    onSuccess: () => Promise<void>;
}

export default function EditProjectInfoDialog({
    projectId,
    projectName,
    projectDescription,
    projectPurpose,
    projectTargetAudience,
    onSuccess,
}: EditProjectInfoDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(projectName);
    const [description, setDescription] = useState(projectDescription);
    const [purpose, setPurpose] = useState(projectPurpose);
    const [targetAudience, setTargetAudience] = useState(projectTargetAudience);
    const [error, setError] = useState<string | null>(null);
    const [isUpdatingProject, setIsUpdatingProject] = useState(false);

    const handleUpdateProject = async () => {
        setError(null);
        setIsUpdatingProject(true);
        console.log({
            message: `${componentName}.handleUpdateProject: update project`,
            metadata: {
                name,
                description,
                purpose,
                target_audience: targetAudience,
            },
        });
        try {
            const res = await updateProjectInfo({
                projectId,
                payload: {
                    name,
                    description,
                    purpose,
                    target_audience: targetAudience,
                },
            });
            console.log({
                message: `${componentName}.handleUpdateProject: update project response`,
                metadata: { res },
            });
            await onSuccess();
            setOpen(false);
        } catch (error) {
            console.error(error);
            setError("Failed to update project info");
        } finally {
            setIsUpdatingProject(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    className="flex items-center gap-2 bg-genesoft text-white hover:text-black hover:bg-white"
                >
                    <Edit className="h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Project</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Project name</Label>
                        <Input
                            id="name"
                            placeholder="Enter project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Project Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your project"
                            className="min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="purpose">Project Purpose</Label>
                        <Textarea
                            id="purpose"
                            placeholder="Enter purpose of your project"
                            className="min-h-[100px]"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="target-audience">Target Audience</Label>
                        <Textarea
                            id="target-audience"
                            placeholder="Enter target audience of your project"
                            className="min-h-[100px]"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm self-center">
                        {error}
                    </div>
                )}

                <Button
                    className="w-fit self-center bg-genesoft text-white px-2 py-4 flex items-center gap-2"
                    size="lg"
                    onClick={handleUpdateProject}
                >
                    <span>Update Project Info</span>
                    {isUpdatingProject && <Loader2 className="animate-spin" />}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
