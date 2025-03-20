"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles, Loader2, Palette } from "lucide-react";
import { SketchPicker } from "react-color";
import { RGBColor } from "react-color";
import { rgbaToHex } from "@/utils/common/color";
import { uploadFileFree } from "@/actions/file";
import posthog from "posthog-js";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { useUserStore } from "@/stores/user-store";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";

interface ProjectCreationBoxProps {
    onComplete: (projectData: {
        description: string;
        logo?: string;
        color?: string;
    }) => void;
    initialValues?: {
        description?: string;
        logo?: string;
        color?: string;
    };
}

const ProjectCreationBox = ({
    onComplete,
    initialValues = {},
}: ProjectCreationBoxProps) => {
    const [projectDescription, setProjectDescription] = useState(
        initialValues.description || "",
    );
    const [brandingImage, setBrandingImage] = useState<string>(
        initialValues.logo || "",
    );
    const [brandColor, setBrandColor] = useState<RGBColor>({
        r: 75,
        g: 107,
        b: 251,
        a: 1,
    }); // Default genesoft-like color

    // Loading states
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<number>(0);
    const { updateCreateProjectStore } = useCreateProjectStore();
    const { id: user_id } = useGenesoftUserStore();
    // Animation effect for section transitions
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeSection < 3) {
                setActiveSection((prev) => prev + 1);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [activeSection]);

    // File upload handler
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const timestamp = new Date().getTime();
            const fileName = `New Project branding - ${timestamp}`;
            const description = `Brand image for project New Project`;

            const res = await uploadFileFree(
                "project_creation",
                fileName,
                description,
                "branding_logo",
                file,
            );

            if (res.error) {
                posthog.capture("project_creation_logo_upload_failed", {
                    error: res.error,
                });
                setError(res.error);
                return;
            }

            setBrandingImage(res.url);
        } catch (err) {
            posthog.capture("project_creation_logo_upload_error", {
                error: String(err),
            });
            setError("Failed to upload image. Please try again.");
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    // Form submission
    const handleSubmit = async () => {
        if (!projectDescription.trim()) {
            setError("Project description is required");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        updateCreateProjectStore({
            description: projectDescription,
            branding: {
                logo_url: brandingImage,
                color: rgbaToHex(brandColor),
                theme: "",
                perception: "",
            },
            is_onboarding: user_id ? false : true,
        });

        try {
            posthog.capture("project_creation_submission", {
                has_logo: !!brandingImage,
                has_color: true,
            });
            onComplete({
                description: projectDescription,
                logo: brandingImage,
                color: rgbaToHex(brandColor),
            });
        } catch (err) {
            posthog.capture("project_creation_submission_failed", {
                error: String(err),
            });
            setError("Failed to create project. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                boxShadow: [
                    "0 0 0 rgba(75, 107, 251, 0)",
                    "0 0 20px rgba(75, 107, 251, 0.5)",
                    "0 0 5px rgba(75, 107, 251, 0.2)",
                ],
            }}
            transition={{
                duration: 0.5,
                boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                },
            }}
            className="w-full max-w-3xl mx-auto bg-tertiary-dark rounded-xl border border-line-in-dark-bg shadow-lg overflow-hidden backdrop-blur-sm"
        >
            <div className="p-6 space-y-5">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-400 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Project Description - Hero Style */}
                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                        opacity: activeSection >= 1 ? 1 : 0,
                        x: activeSection >= 1 ? 0 : -20,
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Label
                        htmlFor="project-description"
                        className="text-white flex items-center text-lg font-bold"
                    >
                        What idea do you want to build
                    </Label>
                    <Textarea
                        id="project-description"
                        placeholder="ex. E-commerce website for a small business, SaaS for remote teams, Platform for creating and selling NFTs, and etc."
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="bg-primary-dark border-line-in-dark-bg text-white min-h-[150px] focus:ring-2 focus:ring-genesoft/50 transition-all duration-300"
                    />
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: activeSection >= 2 ? 1 : 0,
                        y: activeSection >= 2 ? 0 : 20,
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Project Logo (Optional) */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="branding-image"
                            className="text-white flex items-center"
                        >
                            <Upload className="h-4 w-4 mr-2 text-genesoft" />
                            Project Logo{" "}
                            <span className="text-gray-400 text-xs ml-2">
                                (Optional)
                            </span>
                        </Label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="file"
                                    id="branding-image"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                />
                                <Label htmlFor="branding-image">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer flex items-center gap-2 border-line-in-dark-bg hover:bg-genesoft/20 hover:text-white transition-all duration-300 text-black"
                                        onClick={() => {
                                            document
                                                .getElementById(
                                                    "branding-image",
                                                )
                                                ?.click();
                                        }}
                                        disabled={isUploading}
                                    >
                                        <Upload className="h-4 w-4" />
                                        {isUploading
                                            ? "Uploading..."
                                            : "Upload Logo"}
                                    </Button>
                                </Label>
                            </div>

                            <AnimatePresence>
                                {brandingImage && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative w-full h-24 border border-line-in-dark-bg rounded-lg overflow-hidden bg-primary-dark group"
                                    >
                                        <motion.img
                                            src={brandingImage}
                                            alt="Brand logo"
                                            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                                            initial={{ filter: "blur(10px)" }}
                                            animate={{ filter: "blur(0px)" }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Branding Color (Optional) */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="brand-color"
                            className="text-white flex items-center"
                        >
                            <Palette className="h-4 w-4 mr-2 text-genesoft" />
                            Brand Color{" "}
                            <span className="text-gray-400 text-xs ml-2">
                                (Optional)
                            </span>
                        </Label>
                        <div className="flex items-start gap-3">
                            <div className="flex-grow">
                                <SketchPicker
                                    color={brandColor}
                                    onChange={(color) => {
                                        setBrandColor(color.rgb);
                                    }}
                                    className="!bg-primary-dark text-black"
                                    width="100%"
                                    disableAlpha={false}
                                />
                            </div>
                            <motion.div
                                className="flex flex-col items-center gap-1"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    className="w-10 h-10 rounded-lg border border-white/20"
                                    style={{
                                        backgroundColor: rgbaToHex(brandColor),
                                    }}
                                    animate={{
                                        boxShadow: `0 0 15px ${rgbaToHex(brandColor)}`,
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                />
                                <span className="text-xs text-subtext-in-dark-bg">
                                    {rgbaToHex(brandColor)}
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Create Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: activeSection >= 3 ? 1 : 0,
                        y: activeSection >= 3 ? 0 : 20,
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center mt-2"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                isSubmitting || !projectDescription.trim()
                            }
                            className="px-8 bg-genesoft hover:bg-genesoft/90 text-white font-medium py-5 rounded-lg shadow-lg shadow-genesoft/20 transition-all duration-300"
                        >
                            {isSubmitting ? "Creating ..." : "Create Project"}
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            ) : (
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 ml-2" />
                                </motion.div>
                            )}
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProjectCreationBox;
