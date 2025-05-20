"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle,
    ImageIcon,
    Loader2,
    X,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { uploadFileFree } from "@/actions/file";
import { toast } from "sonner";

interface GithubRepositoryInputProps {
    placeholder?: string;
    onSubmit?: (message: string) => void;
}

const GithubRepositoryInput: React.FC<GithubRepositoryInputProps> = ({
    placeholder = "ex. Add a new feature to the website, Fix a bug, and etc.",
    onSubmit: onSend,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [imageUploadUrl, setImageUploadUrl] = useState<string>("");
    const [fileId, setFileId] = useState<string>("");
    const [isImageMessageDialogOpen, setIsImageMessageDialogOpen] =
        useState<boolean>(false);
    const [imageMessage, setImageMessage] = useState<string>("");
    const [isSendingImageWithMessage, setIsSendingImageWithMessage] =
        useState<boolean>(false);

    const handleSendText = () => {
        if (!inputValue) {
            toast("Failed to start Github task", {
                className: "bg-red-500 text-white",
                icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                description: "Please enter a message to start Github task",
            });
            return;
        }
        if (onSend && inputValue.trim()) {
            onSend(inputValue);
            toast("Github task submitted", {
                className: "bg-green-500 text-white",
                icon: <CheckCircle className="h-4 w-4 text-green-500" />,
                description:
                    "Github task submitted to Genesoft AI Agents successfully",
            });
            return;
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const timestamp = new Date().getTime();
            const fileName = `github-task-image-${timestamp}`;
            const description = `Image for Github task`;

            const res = await uploadFileFree(
                "github-task-images",
                fileName,
                description,
                "image",
                file,
            );

            if (res.error) {
                toast.error("Failed to upload image. Please try again.", {
                    description: res.error,
                    duration: 5000,
                    position: "top-center",
                });
                return;
            }

            setImageUploadUrl(res.url);
            setFileId(res.id);
            setIsImageMessageDialogOpen(true);
        } catch (err) {
            toast.error("Failed to upload image. Please try again.");
            console.error(err);
        } finally {
            e.target.value = "";
        }
    };

    const handleSendImageWithMessage = async () => {
        if (!imageUploadUrl || !fileId) return;
        if (!onSend) return;

        setIsSendingImageWithMessage(true);
        try {
            // onSend({
            //     text: imageMessage || "Image attached",
            //     imageUrl: imageUploadUrl,
            //     fileId: fileId,
            // });
            setImageMessage("");
            setImageUploadUrl("");
            setFileId("");
            setIsImageMessageDialogOpen(false);
        } catch (error) {
            toast.error("Failed to send image message.");
            console.error("Error sending image message:", error);
        } finally {
            setIsSendingImageWithMessage(false);
        }
    };

    const handleCancelImageMessage = () => {
        setImageMessage("");
        setImageUploadUrl("");
        setFileId("");
        setIsImageMessageDialogOpen(false);
    };

    return (
        <>
            <div className="relative bg-secondary-dark/80 p-3 sm:p-4 rounded-lg shadow-xl w-full max-w-2xl md:max-w-4xl mx-auto border-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />

                <div className="relative z-10">
                    <Textarea
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="text-xs sm:text-sm md:text-base min-h-[80px] sm:min-h-[150px] md:min-h-[200px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-white conversation-textarea w-full"
                    />

                    <div className="flex items-center justify-between mt-3 sm:mt-4 md:mt-3">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                id="github-image-upload"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white p-1 sm:p-1.5 md:p-1"
                                onClick={() =>
                                    document
                                        .getElementById("github-image-upload")
                                        ?.click()
                                }
                                aria-label="Attach image"
                            >
                                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-4 md:w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-2">
                            <div>
                                <Button
                                    size="icon"
                                    className="bg-genesoft hover:bg-genesoft/80 text-white rounded-md p-2 sm:p-2.5 md:p-2"
                                    onClick={handleSendText}
                                    disabled={!inputValue.trim()}
                                    aria-label="Send message"
                                >
                                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-4 md:w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog
                open={isImageMessageDialogOpen}
                onOpenChange={setIsImageMessageDialogOpen}
            >
                <AlertDialogContent className="bg-primary-dark border-line-in-dark-bg text-white max-w-[90%] md:max-w-[620px] rounded-lg flex flex-col">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Add a message to your image (Optional)
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-subtext-in-dark-bg">
                            Your image has been uploaded. Would you like to add
                            an optional message to go with it?
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {imageUploadUrl && (
                        <div className="w-full my-2 px-2 flex items-center justify-center gap-2 z-10 relative self-center">
                            <img
                                src={imageUploadUrl}
                                alt="Upload preview"
                                className="max-h-60 max-w-full object-contain rounded-md hover:opacity-90 transition-opacity block"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                                onClick={() => {
                                    setImageUploadUrl("");
                                    setFileId("");
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <div className="my-4">
                        <Textarea
                            value={imageMessage}
                            onChange={(e) => setImageMessage(e.target.value)}
                            placeholder="Type your optional message here..."
                            className="min-h-[100px] border-tertiary-dark bg-neutral-700 text-white placeholder:text-neutral-400 focus:outline-none focus:border-none focus:ring-0 focus:ring-offset-0"
                            disabled={
                                isSendingImageWithMessage || !imageUploadUrl
                            }
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="bg-secondary-dark text-white border-line-in-dark-bg hover:bg-secondary-dark/80 hover:text-white"
                            onClick={handleCancelImageMessage}
                            disabled={isSendingImageWithMessage}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            onClick={handleSendImageWithMessage}
                            className="bg-genesoft text-white hover:bg-genesoft/80 flex items-center gap-2"
                            disabled={
                                isSendingImageWithMessage || !imageUploadUrl
                            }
                        >
                            {isSendingImageWithMessage
                                ? "Sending..."
                                : "Send Image"}
                            {isSendingImageWithMessage && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default GithubRepositoryInput;
