"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    createFeedback,
    getHistoricalFeedbacks,
    getLatestOngoingFeedback,
    submitFeedback,
    talkToFeedback,
} from "@/actions/feedback";
import { Feedback } from "@/types/feedback";
import {
    Breadcrumb,
    BreadcrumbPage,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Info, Loader2, Send } from "lucide-react";
import PageLoading from "@/components/common/PageLoading";
import Conversation from "@/components/project/feedback/Converation";
import { SelectConversation } from "@/components/project/feedback/SelectConversation";

const FeedbackPage = () => {
    const pathParams = useParams();
    const [projectId, setProjectId] = useState<string>("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [historicalFeedbacks, setHistoricalFeedbacks] = useState<Feedback[]>(
        [],
    );
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
        null,
    );

    const setupFeedback = async () => {
        setIsLoading(true);
        try {
            const ongoingFeedback = await getLatestOngoingFeedback(projectId);
            console.log({
                message: "Ongoing Feedback",
                ongoingFeedback,
            });
            if (ongoingFeedback?.is_ongoing && ongoingFeedback?.feedback) {
                setFeedback(ongoingFeedback.feedback);
            } else {
                const newFeedback = await createFeedback({
                    project_id: projectId,
                });
                setFeedback(newFeedback);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const { projectId } = pathParams;
        setProjectId(projectId as string);
    }, [pathParams]);

    useEffect(() => {
        setupFeedback();
    }, [projectId]);

    useEffect(() => {
        if (feedback) {
            setupHistoricalFeedbacks();
            setSelectedFeedback(feedback);
        }
    }, [feedback]);

    const handleSelectConversation = (feedback: Feedback) => {
        setFeedback(feedback);
        setSelectedFeedback(feedback);
    };

    console.log({
        message: "Feedback",
        feedback,
    });

    const handleSendMessage = async () => {
        setIsSending(true);
        try {
            const updatedFeedback = await talkToFeedback({
                project_id: projectId,
                feedback_id: feedback?.id as string,
                messages: [
                    {
                        sender: "user",
                        content: feedbackMessage,
                        timestamp: new Date().getTime(),
                    },
                ],
            });
            console.log({
                message: "Updated Feedback",
                updatedFeedback,
            });
            setFeedback(updatedFeedback?.feedback);
        } catch (error) {
            console.error(error);
        } finally {
            setFeedbackMessage("");
            setIsSending(false);
        }
    };

    const handleSubmitFeedback = async () => {
        setIsSubmitting(true);
        console.log({
            message: "Submitting Feedback",
            feedback,
        });
        try {
            const submittedFeedback = await submitFeedback(
                feedback?.id as string,
            );
            console.log({
                message: "Submitted Feedback",
                submittedFeedback,
            });
            const newFeedback = await createFeedback({
                project_id: projectId,
            });
            setFeedback(newFeedback);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const setupHistoricalFeedbacks = async () => {
        try {
            const historicalFeedbacks = await getHistoricalFeedbacks(projectId);
            console.log({
                message: "Historical Feedbacks",
                historicalFeedbacks,
            });
            setHistoricalFeedbacks(historicalFeedbacks);
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <PageLoading size={50} text="Loading Feedback of your project..." />
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary-dark text-white w-full">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1 text-white" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white">
                                    Project
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Manage
                                </BreadcrumbPage>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage className="text-white">
                                    Feedback
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                <div className="flex flex-col gap-4 p-8 w-full rounded-xl">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Project Feedback
                            </h1>
                            <p className="text-muted-foreground">
                                Give feedback to Project Manager AI Agent to
                                improve your web application
                            </p>
                        </div>

                        <Card className="bg-secondary-dark border-none text-white">
                            <CardHeader className="flex flex-col space-y-2">
                                <CardTitle className="text-base">
                                    Feedback Conversation
                                </CardTitle>
                                <SelectConversation
                                    historicalFeedbacks={historicalFeedbacks}
                                    handleSelectConversation={
                                        handleSelectConversation
                                    }
                                    selectedFeedback={selectedFeedback}
                                />
                            </CardHeader>

                            <CardContent className="bg-primary-dark mx-8 rounded-xl">
                                <div className="flex flex-col gap-y-4 w-full">
                                    <div className="my-4 space-y-2">
                                        <Conversation feedback={feedback} />
                                    </div>
                                    {!selectedFeedback?.is_submit && (
                                        <div className="flex items-center gap-x-2">
                                            <Textarea
                                                className="bg-secondary-dark text-white"
                                                value={feedbackMessage}
                                                onChange={(e) => {
                                                    setFeedbackMessage(
                                                        e.target.value,
                                                    );
                                                }}
                                                placeholder="Type your message here..."
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                className={`flex items-center gap-2 ${
                                                    feedbackMessage.length > 0
                                                        ? "bg-genesoft hover:bg-genesoft/90"
                                                        : "bg-secondary-dark hover:bg-secondary-dark/90"
                                                } text-white`}
                                            >
                                                {isSending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            {!selectedFeedback?.is_submit && (
                                <CardFooter className="mt-8">
                                    <div className="flex flex-col gap-y-2 w-full items-center">
                                        <div className="flex items-center gap-x-2">
                                            <Info className="h-4 w-4 text-red-500" />
                                            <p className="text-sm text-subtext-in-dark-bg">
                                                {
                                                    "Please click button to submit feedback so Software Development team of AI Agent informed and start develop new version of your web application based on your feedback"
                                                }
                                            </p>
                                        </div>

                                        <Button
                                            onClick={handleSubmitFeedback}
                                            className="self-center flex items-center gap-2 bg-genesoft text-white hover:text-black hover:bg-white"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            )}
                                            <span>Submit Feedback</span>
                                        </Button>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
