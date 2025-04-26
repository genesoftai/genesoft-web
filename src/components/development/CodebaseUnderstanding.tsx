"use client";

import React, { useState, useEffect } from "react";
import {
    getCodebaseUnderstanding,
    updateCodebaseUnderstanding,
} from "@/actions/codebase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Save, Edit, Code2 } from "lucide-react";
import { toast } from "sonner";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

type Props = {
    projectId?: string;
};

const CodebaseUnderstanding = ({ projectId }: Props) => {
    const [open, setOpen] = useState(false);
    const [codebaseUnderstanding, setCodebaseUnderstanding] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (projectId) {
            fetchCodebaseUnderstanding();
        }
    }, [projectId]);

    const fetchCodebaseUnderstanding = async () => {
        if (!projectId) return;

        setIsLoading(true);
        try {
            const data = await getCodebaseUnderstanding(projectId);
            setCodebaseUnderstanding(data.understanding || "");
        } catch (error) {
            console.error("Failed to fetch codebase understanding:", error);
            toast("Failed to load codebase understanding", {
                description:
                    "An error occurred while fetching the codebase understanding",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!projectId) return;

        setIsSaving(true);
        try {
            await updateCodebaseUnderstanding(projectId, codebaseUnderstanding);

            toast("Codebase understanding updated successfully", {
                description: "Your changes have been saved",
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save codebase understanding:", error);
            toast("Failed to save codebase understanding", {
                description: "An error occurred while saving your changes",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="self-center flex justify-between items-center w-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-sm text-white bg-secondary-dark border-line-in-dark-bg hover:bg-tertiary-dark transition-colors hover:text-white/80"
                    >
                        <Code2 className="h-8 w-8" />
                        <span className="hidden md:block">
                            Codebase Understanding
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full md:w-[80%] max-w-[1200px] h-[80%] bg-primary-dark border-line-in-dark-bg text-white rounded-lg flex flex-col transition-colors">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <Code2 className="h-6 w-6" />
                            <span>Codebase Understanding</span>
                        </DialogTitle>
                        <DialogDescription className="text-subtext-in-dark-bg">
                            This is the codebase understanding for AI Agents to
                            understand codebase and develop the project. AI
                            Agent can make mistakes, so you can update codebase
                            understanding to improve AI Agent capabilities.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 h-full overflow-auto">
                        {isEditing ? (
                            <Textarea
                                id="codebase-understanding"
                                value={codebaseUnderstanding}
                                onChange={(e) =>
                                    setCodebaseUnderstanding(e.target.value)
                                }
                                className="min-h-[200px] mt-2 bg-secondary-dark border-line-in-dark-bg text-white focus:border-white/50 transition-colors h-full"
                                placeholder="Describe your codebase understanding..."
                            />
                        ) : (
                            <div className="text-white rounded-lg w-full p-4 bg-secondary-dark min-h-[200px] mt-2 border border-line-in-dark-bg overflow-auto whitespace-pre-wrap">
                                <SyntaxHighlighter
                                    language="yaml"
                                    style={atomOneDark}
                                >
                                    {codebaseUnderstanding}
                                </SyntaxHighlighter>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={toggleEditMode}
                                    variant="outline"
                                    className="text-white bg-tertiary-dark border-line-in-dark-bg hover:bg-secondary-dark"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-genesoft hover:bg-genesoft/80 text-white"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={toggleEditMode}
                                className="bg-genesoft hover:bg-genesoft/80 text-white"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CodebaseUnderstanding;
