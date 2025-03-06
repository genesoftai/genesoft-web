"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { SketchPicker } from "react-color";
import { RGBColor } from "react-color";
import { rgbaToHex } from "@/utils/common/color";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { uploadFileFree } from "@/actions/file";
import { useCreateProjectStore } from "@/stores/create-project-store";
import posthog from "posthog-js";

interface OnboardingFormProps {
    onComplete: () => void;
}

const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
    // Form state
    const [step, setStep] = useState(1);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [brandingImage, setBrandingImage] = useState<string>("");
    const [brandColor, setBrandColor] = useState<RGBColor>({
        r: 75,
        g: 107,
        b: 251,
        a: 1,
    }); // Default genesoft-like color
    const [colorScheme, setColorScheme] = useState("light");

    // Loading states
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { updateCreateProjectStore } = useCreateProjectStore();

    // File upload handler
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const timestamp = new Date().getTime();
            const fileName = `${projectName || "New Project"} branding - ${timestamp}`;
            const description = `Brand image for project ${projectName || "New Project"}`;

            posthog.capture("onboarding_logo_upload_started", {
                project_name: projectName,
            });

            const res = await uploadFileFree(
                "onboarding",
                fileName,
                description,
                "branding_logo",
                file,
            );

            console.log({
                message: "OnboardingForm: Logo upload response",
                res,
            });

            if (res.error) {
                posthog.capture("onboarding_logo_upload_failed", {
                    error: res.error,
                });
                setError(res.error);
                return;
            }

            posthog.capture("onboarding_logo_upload_completed", {
                project_name: projectName,
            });
            setBrandingImage(res.url);
        } catch (err) {
            posthog.capture("onboarding_logo_upload_error", {
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
        setIsSubmitting(true);
        setError(null);

        try {
            posthog.capture("onboarding_project_submission_started", {
                project_name: projectName,
            });

            updateCreateProjectStore({
                name: projectName,
                description: projectDescription,
                branding: {
                    logo_url: brandingImage,
                    color: rgbaToHex(brandColor),
                    theme: "",
                    perception: "",
                },
                is_onboarding: true,
            });

            posthog.capture("onboarding_complete_from_landing_page", {
                project_name: projectName,
                project_description: projectDescription,
                has_branding_image: !!brandingImage,
                color_scheme: colorScheme,
            });
            onComplete();
        } catch (err) {
            posthog.capture("onboarding_project_submission_failed", {
                error: String(err),
            });
            setError("Failed to create project. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Go to next step
    const goToNextStep = () => {
        posthog.capture("onboarding_next_step", {
            from_step: step,
            to_step: step + 1,
            project_name: projectName,
        });
        setStep((prev) => prev + 1);
        console.log({
            message: "OnboardingForm: Next step",
            step: step + 1,
            logo_url: brandingImage,
        });
    };

    // Go to previous step
    const goToPrevStep = () => {
        posthog.capture("onboarding_prev_step", {
            from_step: step,
            to_step: step - 1,
            project_name: projectName,
        });
        setStep((prev) => prev - 1);
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-tertiary-dark rounded-xl border border-line-in-dark-bg shadow-lg overflow-hidden">
            {/* Header with steps indicator */}
            <div className="bg-secondary-dark p-4 border-b border-line-in-dark-bg">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">
                        Create Your Project
                    </h2>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`w-2 h-2 rounded-full ${
                                    s === step
                                        ? "bg-genesoft"
                                        : s < step
                                          ? "bg-genesoft/50"
                                          : "bg-line-in-dark-bg"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Form content */}
            <div className="p-6">
                {/* Step 1: Project Name */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="inline-flex items-center bg-primary-dark rounded-full px-4 py-2 mb-2 border border-line-in-dark-bg">
                            <Sparkles className="h-4 w-4 mr-2 text-genesoft" />
                            <span className="text-sm">Step 1: Basic Info</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white">
                            What&apos;s your project called?
                        </h3>
                        <p className="text-subtext-in-dark-bg">
                            Choose a name that reflects your business or
                            product.
                        </p>

                        <div className="space-y-2">
                            <Label
                                htmlFor="project-name"
                                className="text-white"
                            >
                                Project Name
                            </Label>
                            <Input
                                id="project-name"
                                placeholder="My Awesome Project"
                                value={projectName}
                                onChange={(e) => {
                                    setProjectName(e.target.value);
                                    posthog.capture(
                                        "onboarding_project_name_changed",
                                        {
                                            project_name: e.target.value,
                                        },
                                    );
                                }}
                                className="bg-primary-dark border-line-in-dark-bg text-white"
                            />
                        </div>

                        <Button
                            onClick={goToNextStep}
                            disabled={!projectName.trim()}
                            className="w-full mt-4 bg-genesoft hover:bg-genesoft/90 text-white font-medium py-6 rounded-lg shadow-lg shadow-genesoft/20 transition-all duration-300 hover:scale-105"
                        >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Step 2: Project Description */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="inline-flex items-center bg-primary-dark rounded-full px-4 py-2 mb-2 border border-line-in-dark-bg">
                            <Sparkles className="h-4 w-4 mr-2 text-genesoft" />
                            <span className="text-sm">
                                Step 2: Project Details
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white">
                            Tell us about your business idea
                        </h3>
                        <p className="text-subtext-in-dark-bg">
                            Describe what your project is about and what problem
                            it solves.
                        </p>

                        <div className="space-y-2">
                            <Label
                                htmlFor="project-description"
                                className="text-white"
                            >
                                Project Description
                            </Label>
                            <Textarea
                                id="project-description"
                                placeholder="My project will help users to..."
                                value={projectDescription}
                                onChange={(e) => {
                                    setProjectDescription(e.target.value);
                                    posthog.capture(
                                        "onboarding_project_description_changed",
                                    );
                                }}
                                className="bg-primary-dark border-line-in-dark-bg text-white min-h-[150px]"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={goToPrevStep}
                                variant="outline"
                                className="flex-1 border-line-in-dark-bg text-black"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={goToNextStep}
                                disabled={!projectDescription.trim()}
                                className="flex-1 bg-genesoft hover:bg-genesoft/90 text-white"
                            >
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Branding Image */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="inline-flex items-center bg-primary-dark rounded-full px-4 py-2 mb-2 border border-line-in-dark-bg">
                            <Sparkles className="h-4 w-4 mr-2 text-genesoft" />
                            <span className="text-sm">
                                Step 3: Brand Identity
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white">
                            Add your branding image
                        </h3>
                        <p className="text-subtext-in-dark-bg">
                            Upload a logo or banner that represents your brand.
                            This step is optional and can be skipped.
                        </p>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-4">
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
                                            className="cursor-pointer flex items-center gap-2 border-line-in-dark-bg text-black"
                                            onClick={() => {
                                                posthog.capture(
                                                    "onboarding_upload_button_clicked",
                                                );
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
                                                : "Upload Image"}
                                        </Button>
                                    </Label>
                                </div>

                                {brandingImage && (
                                    <div className="relative w-full h-40 border border-line-in-dark-bg rounded-lg overflow-hidden bg-primary-dark">
                                        <img
                                            src={brandingImage}
                                            alt="Brand image"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <p className="text-red-500 text-sm">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={goToPrevStep}
                                variant="outline"
                                className="flex-1 border-line-in-dark-bg text-black"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={goToNextStep}
                                className="flex-1 bg-genesoft hover:bg-genesoft/90 text-white"
                            >
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Color Scheme */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="inline-flex items-center bg-primary-dark rounded-full px-4 py-2 mb-2 border border-line-in-dark-bg">
                            <Sparkles className="h-4 w-4 mr-2 text-genesoft" />
                            <span className="text-sm">
                                Step 4: Visual Style
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white">
                            Choose your color scheme
                        </h3>
                        <p className="text-subtext-in-dark-bg">
                            Select colors that match your brand identity. This
                            step is optional and can be skipped.
                        </p>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label
                                    htmlFor="brand-color"
                                    className="text-white"
                                >
                                    Brand Color
                                </Label>
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
                                    <SketchPicker
                                        color={brandColor}
                                        onChange={(color) => {
                                            setBrandColor(color.rgb);
                                            posthog.capture(
                                                "onboarding_brand_color_changed",
                                                {
                                                    color: rgbaToHex(color.rgb),
                                                },
                                            );
                                        }}
                                        className="!bg-primary-dark text-black w-full"
                                    />
                                    <div className="flex flex-col gap-3">
                                        <div
                                            className="w-20 h-20 rounded-lg border-2 border-white"
                                            style={{
                                                backgroundColor:
                                                    rgbaToHex(brandColor),
                                            }}
                                        />
                                        <span className="text-sm text-subtext-in-dark-bg">
                                            {rgbaToHex(brandColor)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="color-scheme"
                                    className="text-white"
                                >
                                    Theme
                                </Label>
                                <Select
                                    value={colorScheme}
                                    onValueChange={(value) => {
                                        setColorScheme(value);
                                        posthog.capture(
                                            "onboarding_theme_selected",
                                            {
                                                theme: value,
                                            },
                                        );
                                    }}
                                >
                                    <SelectTrigger
                                        id="color-scheme"
                                        className="bg-primary-dark border-line-in-dark-bg text-white"
                                    >
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent
                                        position="popper"
                                        className="bg-primary-dark border-line-in-dark-bg"
                                    >
                                        <SelectItem
                                            value="light"
                                            className="text-white"
                                        >
                                            Light
                                        </SelectItem>
                                        <SelectItem
                                            value="dark"
                                            className="text-white"
                                        >
                                            Dark
                                        </SelectItem>
                                        <SelectItem
                                            value="light-and-dark"
                                            className="text-white"
                                        >
                                            Light and Dark with toggle
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={goToPrevStep}
                                variant="outline"
                                className="flex-1 border-line-in-dark-bg text-black"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-genesoft hover:bg-genesoft/90 text-white"
                            >
                                {isSubmitting
                                    ? "Creating Project..."
                                    : "Create Project"}
                                {!isSubmitting && (
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingForm;
