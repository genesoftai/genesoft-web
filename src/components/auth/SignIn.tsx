"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, resetPassword } from "@/app/(auth)/signin/actions";
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import { validateEmail } from "@/utils/auth/email";
import { useRouter } from "next/navigation";
import SimpleLoading from "@/components/common/SimpleLoading";
import { createClient } from "@/utils/supabase/client";
import GenesoftLogo from "@/components/common/GenesoftLogo";
import posthog from "posthog-js";
const StreamingText = ({
    text,
    speed = 20,
    onComplete,
}: {
    text: string;
    speed?: number;
    onComplete?: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeoutId);
        } else if (onComplete) {
            onComplete();
        }
    }, [text, speed, currentIndex, onComplete]);

    return <span>{displayedText}</span>;
};

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [heroStage, setHeroStage] = useState(0);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const supabase = createClient();

    const heroContent = [
        "AI Agent workspace for small business and startup team",
        "Help you get on-demand web application anytime with 10x cheaper cost by collaborate with your team and AI Agent",
        "Built for non-technical product owner and startup founder who need to make idea come true but don't have a lot of funding and technical background and limited budget",
    ];

    const nextStage = () => {
        setHeroStage((prev) => prev + 1);
    };

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        try {
            const data = await signInWithEmail({
                email,
                password,
            });

            if (data) {
                router.push("/dashboard");
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setErrorMessage("Invalid email or password, Please try again");
            setLoading(false);
        }
        setLoading(false);
    };

    const handleForgotPassword = async () => {
        posthog.capture("click_forgot_password_from_signin_page");
        if (!email) {
            alert("Please enter your email");
            return;
        } else {
            const isValid = validateEmail(email);
            if (!isValid) {
                alert("Please enter a valid email");
                return;
            } else {
                await resetPassword(email);
                alert(
                    `A password reset email has been sent to your email: ${email}`,
                );
            }
        }
    };

    const handleContinueWithGoogle = async () => {
        posthog.capture("click_continue_with_google_from_signin_page");
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
                throw new Error("Failed to Sign in with Google");
            }

            window.localStorage.setItem("google_data", JSON.stringify(data));
        } catch (error) {
            throw error;
        }
    };

    const handleContinueWithGithub = async () => {
        posthog.capture("click_continue_with_github_from_signin_page");
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
                throw new Error("Failed to Sign in with GitHub");
            }

            window.localStorage.setItem("github_data", JSON.stringify(data));
        } catch (error) {
            throw error;
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

    return (
        <div className="min-h-screen flex bg-primary-dark">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 items-center justify-evenly">
                {/* <p className="text-6xl font-medium text-genesoft hidden lg:block">
          Genesoft
        </p> */}
                <GenesoftLogo size="big" />

                <section className="flex flex-col space-y-4 py-12 text-center px-4">
                    <h1 className="text-2xl font-bold tracking-tight text-genesoft">
                        {heroStage === 0 && (
                            <StreamingText
                                text={heroContent[0]}
                                speed={30}
                                onComplete={nextStage}
                            />
                        )}
                        {heroStage > 0 && heroContent[0]}
                    </h1>
                    <h2 className="text-xl text-subtext-in-dark-bg">
                        {heroContent[1]}
                    </h2>
                    <p className="text-base text-subtext-in-dark-bg max-w-2xl mx-auto">
                        {heroContent[2]}
                    </p>
                </section>
            </div>

            {/* Right side - SignIn form */}
            <div className="w-full lg:w-1/2 p-8 flex flex-col bg-white">
                <div className="flex justify-between items-center mb-12">
                    <ArrowLeft
                        className="h-4 fixed left-2 top-10 flex md:hidden"
                        onClick={() => router.push("/")}
                    />
                    <div className="text-2xl md:text-6xl font-medium text-genesoft lg:hidden">
                        <GenesoftLogo />
                    </div>
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
                    <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
                        Sign in to Genesoft
                    </h1>

                    {errorMessage && (
                        <p className="text-center text-red-500">
                            {errorMessage}
                        </p>
                    )}

                    <form className="space-y-4" onSubmit={handleSignIn}>
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
                                required
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
                                    className="border-gray-300"
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

                            <div
                                onClick={handleForgotPassword}
                                className="py-4 text-sm text-muted-foreground cursor-pointer hover:text-genesoft"
                            >
                                <p>Forgot Password?</p>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-white bg-genesoft hover:bg-genesoft/90 cursor-pointer"
                        >
                            {loading ? <SimpleLoading /> : "Sign in"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-600">
                            Don&apos;t have an account?{" "}
                        </span>
                        <a
                            href="/signup"
                            className="text-genesoft hover:underline cursor-pointer"
                        >
                            Sign up
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
