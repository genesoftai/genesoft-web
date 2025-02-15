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
import { Loader2, SquarePen, Upload, X } from "lucide-react";
import {
    PageReference,
    PageFile,
    Page,
    EditPageRequest,
} from "@/types/project";
import { createReferenceLink } from "@/actions/reference_link";
import { uploadFileForOrganization } from "@/actions/file";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import posthog from "posthog-js";

const componentName = "EditPageDialog";

interface TempFile extends PageFile {
    file: File | undefined;
}

interface EditPageDialogProps {
    page: Page;
    onEditPage: (payload: EditPageRequest) => void;
}

export function EditPageDialog({ page, onEditPage }: EditPageDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(page.name);
    const [description, setDescription] = useState(page.description);
    const [references, setReferences] = useState<PageReference[]>(
        page.references,
    );
    const [files, setFiles] = useState<PageFile[]>(page.files);
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
        posthog.capture("click_remove_reference_from_edit_page_dialog");
        setError(null);
        const updatedReferences = references?.filter((_, i) => i !== index);
        setReferences(updatedReferences);
    };

    const handleRemoveFile = (index: number) => {
        posthog.capture("click_remove_file_from_edit_page_dialog");
        setError(null);
        const updatedFiles = files?.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        posthog.capture("click_upload_file_from_edit_page_dialog");
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
        posthog.capture("click_add_file_from_edit_page_dialog");
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

    const handleEditPage = () => {
        posthog.capture("click_save_changes_from_edit_page_dialog");
        setError(null);
        console.log({
            message: `${componentName}.handleEditPage: edit page`,
            metadata: {
                name,
                description,
                references,
                files,
            },
        });

        onEditPage({
            name,
            description,
            reference_link_ids: references.map((ref) => ref.id || ""),
            file_ids: files.map((file) => file.id || ""),
        });

        setError(null);
        setOpen(false);
    };

    console.log({
        message: `${componentName}: Page information`,
        page,
        name,
        description,
        references,
        files,
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="text-genesoft hover:text-genesoft/90"
                    variant="ghost"
                    size="icon"
                >
                    <SquarePen className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl">Edit Page</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Page name</Label>
                        <Input
                            id="name"
                            placeholder="Enter page name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Page Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe important information of this page such as structure, content, features, and etc."
                            className="min-h-[100px] break-words"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                References
                            </h3>
                            <p className="text-sm text-subtext-in-white-bg mb-4 break-words">
                                Provide reference information for this feature
                                by url
                            </p>
                            {references?.length > 0 && (
                                <div className="mb-4 space-y-3">
                                    {references?.map((ref, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg relative shadow-md border-1 border-gray-200"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-2 h-6 w-6"
                                                onClick={() =>
                                                    handleRemoveReference(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <p className="font-medium text-sm break-words pr-8">
                                                {ref.name}
                                            </p>
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 mt-1 hover:underline break-all"
                                            >
                                                {ref.url}
                                            </a>
                                            <p className="text-sm text-subtext-in-white-bg mt-1 break-words">
                                                {ref.context}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Input
                                    placeholder="Reference name"
                                    value={newReference.name}
                                    onChange={(e) =>
                                        setNewReference({
                                            ...newReference,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    placeholder="URL"
                                    value={newReference.url}
                                    onChange={(e) =>
                                        setNewReference({
                                            ...newReference,
                                            url: e.target.value,
                                        })
                                    }
                                />
                                <Textarea
                                    placeholder="give context for how to use this reference for this page"
                                    className="min-h-[60px] break-words"
                                    value={newReference.context}
                                    onChange={(e) =>
                                        setNewReference({
                                            ...newReference,
                                            context: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    className="w-fit"
                                    variant="secondary"
                                    onClick={handleAddReference}
                                    disabled={isUploadingReference}
                                >
                                    <span>Add Reference</span>
                                    {isUploadingReference && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Files
                            </h3>
                            <p className="text-sm text-subtext-in-white-bg mb-4 break-words">
                                Upload files those aim to use in this page
                            </p>
                            {files?.length > 0 && (
                                <div className="mb-4 space-y-3">
                                    {files?.map((file, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg relative shadow-md border-1 border-gray-200"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-2 h-6 w-6"
                                                onClick={() =>
                                                    handleRemoveFile(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <p className="font-medium text-sm break-words pr-8">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-subtext-in-white-bg mt-1 break-words">
                                                {file.context}
                                            </p>
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 mt-1 hover:underline break-all"
                                            >
                                                {file.url}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <div className="flex gap-2">
                                    <Input
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileUpload}
                                    />
                                    <Label
                                        htmlFor="file-upload"
                                        className="cursor-pointer"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-fit"
                                            type="button"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "file-upload",
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload file
                                        </Button>
                                    </Label>
                                    {newFile.url && (
                                        <p className="text-sm text-subtext-in-white-bg mt-1 break-all">
                                            {newFile.url}
                                        </p>
                                    )}
                                </div>
                                <Input
                                    placeholder="File name"
                                    value={newFile.name}
                                    onChange={(e) =>
                                        setNewFile({
                                            ...newFile,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <Textarea
                                    placeholder="give context for how to use this file for this page"
                                    className="min-h-[60px] break-words"
                                    value={newFile.context}
                                    onChange={(e) =>
                                        setNewFile({
                                            ...newFile,
                                            context: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    className="w-fit flex items-center gap-2"
                                    variant="secondary"
                                    onClick={handleAddFile}
                                    disabled={isUploadingFile}
                                >
                                    <span>Add File</span>
                                    {isUploadingFile && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm self-center break-words">
                        {error}
                    </div>
                )}

                <Button
                    className="w-fit self-center bg-genesoft text-white px-2 py-4"
                    size="lg"
                    onClick={handleEditPage}
                >
                    Save Changes
                </Button>
            </DialogContent>
        </Dialog>
    );
}
