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
import { Edit, Info, Loader2, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/project";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { updateProjectInfo } from "@/actions/project";
import Image from "next/image";
import NextjsLogo from "@public/tech/nextjs.jpeg";

interface ProjectInfoSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
    onSave: (project: Project) => void;
}

export const WebProjectInfoSheet = ({
    isOpen,
    onOpenChange,
    project,
    onSave,
}: ProjectInfoSheetProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (project) {
            setupProjectInfo();
        }
    }, [project]);

    const setupProjectInfo = async () => {
        setName(project.name || "");
        setDescription(project.description || "");
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast({
                title: "Project name required",
                description: "Please provide a name for your project.",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);
        try {
            // Save logic would go here

            const updatedProject = await updateProjectInfo({
                projectId: project.id,
                payload: {
                    name,
                    description,
                },
            });

            console.log("updatedProject", updatedProject);

            onSave(updatedProject);
        } catch (error) {
            console.error("Error updating project info:", error);
        } finally {
            setIsSaving(false);
            onOpenChange(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex  bg-primary-dark border-secondary-dark hover:bg-white hover:text-primary-dark transition-colors"
                >
                    <Edit className="h-4 w-4" />
                    <span className="text-xs font-medium">Project Infos</span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="bg-primary-dark border-line-in-dark-bg p-6 w-[90vw] sm:w-[70vw] md:w-[700px] text-white"
            >
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-white text-xl flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>Project Info</span>
                    </SheetTitle>
                    <SheetDescription className="text-subtext-in-dark-bg flex flex-col gap-2">
                        <p>
                            Edit your project information to help AI Agents
                            better understand your project.
                        </p>
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                src={NextjsLogo}
                                alt="Nextjs Logo"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <p className="text-xs md:text-sm text-subtext-in-dark-bg">
                                Web Project (Next.js)
                            </p>
                        </div>
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
                    <div className="py-6 space-y-8">
                        <div className="space-y-3">
                            <Label className="text-white font-bold">
                                Project Name
                            </Label>
                            <Input
                                placeholder="Enter project name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-secondary-dark border-line-in-dark-bg focus:border-white/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label className="text-white font-bold">
                                    Project Description
                                </Label>
                                <p className="text-subtext-in-dark-bg text-xs">
                                    This description serves as a knowledge base
                                    for AI Agents. Include details about
                                    libraries, services, and other information
                                    that will help AI understand your project
                                    implementation.
                                </p>
                            </div>
                            <Textarea
                                placeholder="Describe your project..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[150px] bg-secondary-dark border-line-in-dark-bg focus:border-white/50 transition-colors"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-fit px-4 py-2 text-sm text-white bg-genesoft hover:bg-genesoft/80 transition-colors flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default WebProjectInfoSheet;
