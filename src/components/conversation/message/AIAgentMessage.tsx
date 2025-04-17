import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import DOMPurify from "dompurify";
import "github-markdown-css";
import "highlight.js/styles/atom-one-dark.css";
import ProjectManagerImage from "@public/ai-agent/project-manager-ai.png";
import BackendDeveloperImage from "@public/ai-agent/backend-developer-ai.png";
import FrontendDeveloperImage from "@public/ai-agent/frontend-developer-ai.png";

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeFormat)
    .use(rehypeStringify);

type AIAgentMessageProps = {
    message: Message;
    messagesLength: number;
    index: number;
    status: string;
    sender_id: string;
};

const StreamingText = ({
    text,
    speed = 5,
    onComplete,
}: {
    text: string;
    speed: number;
    onComplete: () => void;
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [htmlContent, setHtmlContent] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (currentIndex < text.length) {
    //         const timeoutId = setTimeout(async () => {
    //             const newDisplayedText = displayedText + text[currentIndex];
    //             setDisplayedText(newDisplayedText);
    //             setCurrentIndex((prev) => prev + 1);

    //             // Process with markdown every few characters for better performance
    //             if (
    //                 currentIndex % 5 === 0 ||
    //                 currentIndex === text.length - 1
    //             ) {
    //                 const file = await processor.process(newDisplayedText);
    //                 const processedContent = String(file);
    //                 setHtmlContent(processedContent);

    //                 // Smooth scroll during streaming
    //                 if (containerRef.current) {
    //                     containerRef.current.scrollIntoView({
    //                         behavior: "smooth",
    //                         block: "end",
    //                     });
    //                 }
    //             }
    //         }, speed);

    //         return () => clearTimeout(timeoutId);
    //     } else if (onComplete) {
    //         onComplete();
    //     }
    // }, [text, speed, currentIndex, displayedText, onComplete]);

    return (
        <div ref={containerRef}>
            
            <div
                className="text-white rounded-lg w-full markdown-body markdown-body-assistant hidden md:block"
                // dangerouslySetInnerHTML={{
                //     __html: DOMPurify.sanitize(htmlContent),
                // }}
            ><pre>{text}</pre></div>
            <div
                className="text-white rounded-lg w-full block md:hidden text-xs"
                // dangerouslySetInnerHTML={{
                //     __html: DOMPurify.sanitize(htmlContent),
                // }}
            />
        </div>
    );
};

const AIAgentMessage = ({
    message,
    messagesLength,
    index,
    sender_id,
}: AIAgentMessageProps) => {
    const [htmlContent, setHtmlContent] = useState("");
    const isLatestMessage = index === messagesLength - 1;
    const [senderName, setSenderName] = useState("");
    const [streamComplete, setStreamComplete] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setupContent();
    }, [message?.content]);

    useEffect(() => {
        if (sender_id === "205d57c2-6297-4b9d-83c7-2fb230804023") {
            setSenderName("Backend Developer");
        } else if (sender_id === "9e83c7fe-e5d0-4bb9-b499-a53022641d64") {
            setSenderName("Frontend Developer");
        } else {
            setSenderName("Project Manager");
        }
    }, [sender_id]);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (isLatestMessage && !streamComplete && containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [isLatestMessage, streamComplete]);

    const handleStreamComplete = async () => {
        setStreamComplete(true);

        // Final processing to ensure complete content is rendered
        if (message?.content) {
            const file = await processor.process(message.content);
            const processedContent = String(file);
            setHtmlContent(processedContent);
        }

        // Final scroll after streaming completes
        if (containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    };

    const setupContent = async () => {
        if (!message?.content) return;

        // If not the latest message, just process normally without streaming
        if (!isLatestMessage || streamComplete) {
            const value = `${message?.content?.trim()}`;
            const file = await processor.process(value);
            const processedContent = String(file);
            setHtmlContent(processedContent);
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-start gap-2 group p-2 rounded-md w-full"
        >
            <div className="flex items-center gap-2">
                <div>
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-md flex-shrink-0">
                        <Image
                            src={
                                senderName === "Backend Developer"
                                    ? BackendDeveloperImage
                                    : senderName === "Frontend Developer"
                                      ? FrontendDeveloperImage
                                      : ProjectManagerImage
                            }
                            alt="Genesoft Logo"
                            width={36}
                            height={36}
                            className="w-full h-full object-cover hidden md:block"
                        />
                        <Image
                            src={
                                senderName === "Backend Developer"
                                    ? BackendDeveloperImage
                                    : senderName === "Frontend Developer"
                                      ? FrontendDeveloperImage
                                      : ProjectManagerImage
                            }
                            alt="Genesoft Logo"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover block md:hidden"
                        />
                    </Avatar>
                </div>

                <div className="flex flex-col flex-wrap items-baseline">
                    <span className={`font-semibold text-sm text-genesoft`}>
                        {senderName}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        {formatDateToHumanReadable(
                            message?.created_at as unknown as string,
                        )}
                    </span>
                </div>
            </div>

            <div className="flex-1 min-w-0 max-w-full">
                {isLatestMessage && !streamComplete ? (
                    <StreamingText
                        text={message?.content || ""}
                        speed={1}
                        onComplete={handleStreamComplete}
                    />
                ) : (
                    <>
                        <div
                            ref={messageRef}
                            className="text-white rounded-lg w-full markdown-body markdown-body-assistant hidden md:block"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(htmlContent),
                            }}
                        />

                        <div
                            ref={messageRef}
                            className="text-white rounded-lg w-full block md:hidden text-xs"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(htmlContent),
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AIAgentMessage;
