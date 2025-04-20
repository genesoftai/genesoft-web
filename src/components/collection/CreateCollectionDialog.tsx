"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collection } from "@/types/collection";
import posthog from "posthog-js";
import { Boxes, Loader2 } from "lucide-react";
import { createCollection } from "@/actions/collection";

interface CreateCollectionDialogProps {
    organizationId: string;
    onCreateCollection: (collection: Collection) => void;
}

const CreateCollectionDialog = ({
    organizationId,
    onCreateCollection,
}: CreateCollectionDialogProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCreateCollection = async () => {
        posthog.capture("click_create_collection");
        setError(null);
        setLoading(true);

        try {
            if (!name.trim()) {
                setError("Collection name is required");
                setLoading(false);
                return;
            }

            const newCollection = await createCollection({
                organization_id: organizationId,
                name,
                description,
            });

            onCreateCollection(newCollection);
            setName("");
            setDescription("");
            setOpen(false);
        } catch (err) {
            console.error("Error creating collection:", err);
            setError("Failed to create collection");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-genesoft text-white rounded-lg text-xs md:text-base w-fit self-center">
                    <span className="text-xs md:text-base">
                        Create Collection
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-primary-dark text-white border-none">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Boxes className="w-8 h-8" />
                        <span className="text-xl">Create New Collection</span>
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Create a new collection to integrate web with backend
                        service so AI Agents can collaborate between web and
                        backend service
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Collection Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter collection name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                Collection Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the purpose and contents of this collection"
                                className="min-h-[100px] break-words"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-fit self-center bg-genesoft text-white px-2 py-4"
                            size="lg"
                            onClick={handleCreateCollection}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Collection"
                            )}
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm self-center break-words">
                        {error}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateCollectionDialog;
