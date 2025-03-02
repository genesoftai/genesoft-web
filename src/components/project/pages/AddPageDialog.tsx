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
import { Plus } from "lucide-react";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { PageReference, PageFile, Page } from "@/types/project";
import { createReferenceLink } from "@/actions/reference_link";
import { uploadFileForOrganization } from "@/actions/file";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import posthog from "posthog-js";

const componentName = "AddPageDialog";

interface TempFile extends PageFile {
    file: File | undefined;
}

interface AddPageDialogProps {
    type?: "create" | "update";
    onAddPage: (page: Page) => void;
}

export function AddPageDialog({
    type = "create",
    onAddPage,
}: AddPageDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [references, setReferences] = useState<PageReference[]>([]);
    const [files, setFiles] = useState<PageFile[]>([]);
    const [newReference, setNewReference] = useState<PageReference>({
        id: "",
        url: "",
        context: "",
        name: "",
    });
    const [newFile, setNewFile] = useState<TempFile>({
        id: "",
        name: "",
        context: "",
        url: "",
        file: undefined,
    });

    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isUploadingReference, setIsUploadingReference] = useState(false);

    const { addPage } = useCreateProjectStore();
    const { organization } = useGenesoftUserStore();

    const handleAddReference = async () => {
        setError(null);
        if (newReference.url && newReference.context && newReference.name) {
            setIsUploadingReference(true);
            try {
                const reference = await createReferenceLink({
                    name: newReference.name,
                    description: newReference.context,
                    url: newReference.url,
                });
                setReferences([
                    ...references,
                    {
                        id: reference.id,
                        name: newReference.name,
                        context: newReference.context,
                        url: newReference.url,
                    },
                ]);
                setNewReference({ id: "", url: "", context: "", name: "" });
            } catch (err) {
                setError("Failed to create reference");
                console.error(err);
            } finally {
                setIsUploadingReference(false);
            }
        }
    };

    const handleRemoveReference = (index: number) => {
        posthog.capture("click_remove_reference_from_add_page_dialog");
        setError(null);
        setReferences(references.filter((_, i) => i !== index));
    };

    const handleRemoveFile = (index: number) => {
        posthog.capture("click_remove_file_from_add_page_dialog");
        setError(null);
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        posthog.capture("click_upload_file_from_add_page_dialog");
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            return;
        }

        // Validate file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size should be less than 5MB");
            return;
        }

        setNewFile({
            ...newFile,
            file: file,
        });
    };

    const handleAddFile = async () => {
        posthog.capture("click_add_file_from_add_page_dialog");
        setError(null);
        if (newFile.name && newFile.context && newFile.name && newFile.file) {
            setIsUploadingFile(true);
            try {
                const fileName = newFile.name;
                const description = newFile.context;
                const response = await uploadFileForOrganization(
                    organization?.id || "",
                    fileName,
                    description,
                    "page",
                    newFile.file,
                );

                console.log({
                    message: `${componentName}: Upload file response`,
                    response,
                });

                setFiles([
                    ...files,
                    {
                        ...newFile,
                        url: response.url,
                        id: response.id,
                    },
                ]);

                setNewFile({
                    id: "",
                    name: "",
                    context: "",
                    url: "",
                    file: undefined,
                });
            } catch (err) {
                setError("Failed to upload file");
                console.error(err);
            } finally {
                setIsUploadingFile(false);
            }
        }
    };

    const handleAddPage = () => {
        posthog.capture("click_add_page_from_add_page_dialog");
        setError(null);
        console.log({
            message: `${componentName}.handleAddPage: add page`,
            metadata: {
                name,
                description,
                references,
                files,
            },
        });
        if (type === "create") {
            addPage({
                name,
                description,
                references,
                files,
            });
        } else {
            onAddPage({
                name,
                description,
                references,
                files,
            });
        }
        // Reset all states
        setName("");
        setDescription("");
        setReferences([]);
        setFiles([]);
        setNewReference({ id: "", url: "", context: "", name: "" });
        setNewFile({ id: "", name: "", context: "", url: "", file: undefined });
        setError(null);
        setOpen(false);
    };

    console.log({
        message: `${componentName}: Page information`,
        name,
        description,
        references,
        files,
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-fit bg-primary-dark text-white"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Add Page</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-11/12 sm:max-w-[600px] max-h-[90vh] overflow-y-scroll flex flex-col rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-base md:text-xl">
                        Add Page
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Page name</Label>
                        <Input
                            id="name"
                            placeholder="Enter page name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-sm md:text-base"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Page Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe important information of this page such as structure, content, features, and etc."
                            className="min-h-[100px] text-sm md:text-base"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm self-center">
                        {error}
                    </div>
                )}

                <Button
                    className={`w-fit self-center px-2 py-4 ${!name || !description ? "bg-gray-300 text-gray-500" : "bg-genesoft text-white hover:bg-genesoft/80 hover:text-white"}`}
                    size="lg"
                    disabled={!name || !description}
                    onClick={handleAddPage}
                >
                    <Plus className="mr-1 h-4 w-4" />
                    <span className="text-xs md:text-base">Add Page</span>
                </Button>
            </DialogContent>
        </Dialog>
    );
}
