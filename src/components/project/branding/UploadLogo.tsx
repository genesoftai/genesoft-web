"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { uploadFileForOrganization } from "@/actions/file";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { Input } from "@/components/ui/input";
import SimpleLoading from "@/components/common/SimpleLoading";
import { useCreateProjectStore } from "@/stores/create-project-store";

const componentName = "UploadLogo";

export default function UploadLogo() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { organization, email } = useGenesoftUserStore();
    const { branding, updateCreateProjectStore } = useCreateProjectStore();
    const [logoUrl, setLogoUrl] = useState("");

    useEffect(() => {
        setLogoUrl(branding?.logo_url || "");
    }, [branding?.logo_url]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file");
            setIsLoading(false);
            return;
        }

        // Validate file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size should be less than 5MB");
            setIsLoading(false);
            return;
        }

        try {
            const timestamp = new Date().getTime();
            const logoName = `${organization?.id}'s logo - ${timestamp}`;
            const description = `${logoName} uploaded by ${email}`;
            const response = await uploadFileForOrganization(
                organization?.id || "",
                logoName,
                description,
                "logo",
                file,
            );

            console.log({
                message: `${componentName}: Upload logo response`,
                response,
            });

            setLogoUrl(response.url);
            updateCreateProjectStore({
                branding: {
                    ...branding,
                    logo_url: response.url,
                },
            });
        } catch (err) {
            setError("Failed to upload logo");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-between">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="logo" className="text-xl font-semibold">
                        Logo
                    </Label>
                    <p className="text-sm text-subtext-in-dark-bg">
                        Upload your logo image
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="file" className="text-sm font-medium">
                        File
                    </Label>
                    <Input
                        id="logo"
                        type="file"
                        placeholder="File"
                        accept="image/*"
                        disabled={isLoading}
                        className="text-white"
                        onChange={handleFileChange}
                    />

                    <Label
                        htmlFor="logo"
                        className="cursor-pointer flex flex-col gap-y-4"
                    >
                        <Button
                            variant="secondary"
                            className="gap-2 w-fit"
                            disabled={isLoading}
                            aria-busy={isLoading}
                            onClick={() =>
                                document.getElementById("logo")?.click()
                            }
                        >
                            <Upload className="h-4 w-4" />
                            <span>Upload logo</span>
                            {isLoading && <SimpleLoading />}
                        </Button>
                    </Label>

                    {error && (
                        <p
                            id="logo-error"
                            className="mt-2 text-sm text-destructive"
                        >
                            {error}
                        </p>
                    )}
                </div>
            </div>

            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt="Logo"
                    className="object-contain"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
            ) : (
                <img
                    src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                    alt="Logo"
                    className="object-contain"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
            )}
        </div>
    );
}
