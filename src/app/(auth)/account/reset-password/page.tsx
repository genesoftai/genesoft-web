"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { updateUserPassword } from "../../signin/actions";
import SimpleLoading from "@/components/common/SimpleLoading";
import GenesoftLogo from "@/components/common/GenesoftLogo";
import posthog from "posthog-js";
export default function ResetPassword() {
    posthog.capture("pageview_reset_password");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleResetPassword = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const code = searchParams.get("code");
        if (password === confirmPassword) {
            try {
                await updateUserPassword(password, code as string);
                setLoading(false);
                router.push("/signin");
            } catch (error) {
                console.error(error);
                setLoading(false);
                setError("Failed to reset password, Please try again.");
            }
            return;
        } else {
            setLoading(false);
            setError("Passwords do not match, Please try again.");
            return;
        }
    };

    const togglePasswordVisibility = (
        field: "password" | "confirmPassword",
    ) => {
        if (field === "password") {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className="min-h-screen flex bg-primary-dark">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 items-center justify-evenly">
                <GenesoftLogo size="big" />

                <section className="flex flex-col space-y-4 py-12 text-center px-4">
                    <h1 className="text-2xl font-bold tracking-tight text-genesoft">
                        Reset Your Password
                    </h1>
                    <h2 className="text-xl text-subtext-in-dark-bg">
                        Secure your account with a new password
                    </h2>
                    <p className="text-base text-subtext-in-dark-bg max-w-2xl mx-auto">
                        Choose a strong, unique password to protect your
                        Genesoft account
                    </p>
                </section>
            </div>

            {/* Right side - Reset Password form */}
            <div className="w-full lg:w-1/2 p-8 flex flex-col bg-white">
                <div className="flex justify-between items-center mb-12">
                    <ArrowLeft
                        className="h-4 fixed left-2 top-10 flex md:hidden"
                        onClick={() => router.push("/")}
                    />
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
                    <GenesoftLogo size="medium" />

                    <h1 className="text-3xl font-semibold mt-8 mb-8 text-center text-gray-800">
                        Reset Your Password
                    </h1>

                    {error && (
                        <p className="text-sm font-medium text-red-500 text-center w-full">
                            {error}
                        </p>
                    )}

                    <form className="space-y-4" onSubmit={handleResetPassword}>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    className="border-gray-300 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() =>
                                        togglePasswordVisibility("password")
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-gray-700"
                            >
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your new password"
                                    className="border-gray-300 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() =>
                                        togglePasswordVisibility(
                                            "confirmPassword",
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-white bg-genesoft hover:bg-genesoft/90"
                        >
                            {loading ? <SimpleLoading /> : "Reset Password"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-600">
                            Remember your password?{" "}
                        </span>
                        <a
                            href="/signin"
                            className="text-genesoft hover:underline"
                        >
                            Sign in
                        </a>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <div>Need help?</div>
                    <a
                        href="mailto:support@genesoftai.com"
                        className="text-primary hover:underline"
                    >
                        support@genesoftai.com
                    </a>
                </div>
            </div>
        </div>
    );
}
