"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import { signup } from "@/app/(auth)/signup/actions";
import SimpleLoading from "@/components/common/SimpleLoading";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/utils/supabase/client";
import posthog from "posthog-js";

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const supabase = createSupabaseClient();

    const router = useRouter();

    const checkPasswordMatch = useCallback(() => {
        if (password && confirmPassword && password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
        } else {
            setErrorMessage("");
        }
    }, [password, confirmPassword]);

    const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            // TODO: signup to supabase
            await signup(formData);
            alert("Sign Up successful, check your email for confirmation");
            setLoading(false);
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            setLoading(false);
            alert("Something went wrong");
        }
    };

    useEffect(() => {
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        const { data: userAuth } = await supabase.auth.getUser();
        if (userAuth.user) {
            router.push("/dashboard");
        }
    };

    const handleContinueWithGoogle = async () => {
        posthog.capture("click_continue_with_google_from_signup_page");
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            });

            if (error) {
                throw new Error("Failed to Sign In with Google");
            }

            window.localStorage.setItem("google_data", JSON.stringify(data));
        } catch (error) {
            throw error;
        }
    };

    const handleContinueWithGithub = async () => {
        posthog.capture("click_continue_with_github_from_signup_page");
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            });

            if (error) {
                throw new Error("Failed to Sign In with GitHub");
            }

            window.localStorage.setItem("github_data", JSON.stringify(data));
        } catch (error) {
            throw error;
        }
    };

    return (
        // <div className="min-h-screen flex bg-neutral-50">
        <div className="min-h-screen flex bg-primary-dark">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 items-center justify-evenly">
                <p className="text-6xl font-medium text-genesoft hidden lg:block">
                    Genesoft
                </p>

                <div className="text-subtext-in-dark-bg text-2xl w-8/12 ">
                    {
                        "Get started with AI Agent workspace to collaborate with your team and AI Agent to build web application for your potential business idea"
                    }
                </div>
            </div>

            {/* Right side - Signup form */}

            <div className="w-full lg:w-1/2 p-8 flex flex-col bg-white">
                <ArrowLeft
                    className="h-4 fixed left-2 top-10 flex md:hidden"
                    onClick={() => router.push("/")}
                />

                <div className="flex justify-start space-x-2 items-center mb-12">
                    <div className="text-2xl md:text-6xl font-medium text-genesoft lg:hidden">
                        <p>Genesoft</p>
                    </div>
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
                    <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
                        Sign Up to Genesoft
                    </h1>

                    <div className="text-muted-foreground text-lg w-full flex lg:hidden mb-10">
                        {
                            "Get started to collaborate AI Agent with your team in AI Agent workspace"
                        }
                    </div>

                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="border-gray-300"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="border-gray-300 pr-10"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-gray-700"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="border-gray-300"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                onBlur={checkPasswordMatch}
                                required
                            />
                        </div>

                        {errorMessage && (
                            <p className="text-red-500 text-sm">
                                {errorMessage}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-primary text-white bg-genesoft hover:bg-genesoft/90"
                        >
                            {loading ? <SimpleLoading /> : "Signup"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-600">
                            Already have an account?{" "}
                        </span>
                        <a
                            href="/signin"
                            className="text-genesoft hover:underline"
                        >
                            Sign in
                        </a>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <div className="flex items-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="mx-4">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                    </div>

                    <Button
                        onClick={handleContinueWithGoogle}
                        variant="outline"
                        className="mt-6 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <Button
                        onClick={handleContinueWithGithub}
                        variant="outline"
                        className="mt-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                fill="#24292e"
                            />
                        </svg>
                        Continue with GitHub
                    </Button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <div>Support</div>
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
