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
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    status: string;
    sender_id: string;
};

const AIAgentMessage = ({
    message,
    messagesLength,
    index,
    messagesEndRef,
    sender_id,
}: AIAgentMessageProps) => {
    const [htmlContent, setHtmlContent] = useState("");
    const isLatestMessage = index === messagesLength - 1;
    const [senderName, setSenderName] = useState("");
    const [streamedContent, setStreamedContent] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamComplete, setStreamComplete] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);

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
        if (isLatestMessage) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

            // Start streaming if this is the latest message
            if (message?.content && !streamComplete) {
                streamContent(message.content);
            }
        }
    }, [messagesEndRef, isLatestMessage, message?.content, streamComplete]);

    // Scroll to this message when streaming updates
    useEffect(() => {
        if (isStreaming && isLatestMessage) {
            messageRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [streamedContent, isStreaming, isLatestMessage]);

    const streamContent = async (content: string) => {
        setIsStreaming(true);
        setStreamedContent("");

        const chars = content.split("");
        let currentContent = "";

        for (let i = 0; i < chars.length; i++) {
            currentContent += chars[i];
            setStreamedContent(currentContent);

            // Process with markdown every few characters for better performance
            if (i % 20 === 0 || i === chars.length - 1) {
                const file = await processor.process(currentContent);
                const processedContent = String(file);
                setHtmlContent(processedContent);
            }

            // Control streaming speed
            await new Promise((resolve) => setTimeout(resolve, 5));
        }

        // Final processing to ensure complete content is rendered
        const file = await processor.process(content);
        const processedContent = String(file);
        setHtmlContent(processedContent);
        setIsStreaming(false);
        setStreamComplete(true);
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
        <div className="flex flex-col items-start gap-2 group p-2 rounded-md w-full">
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
                <div
                    ref={(el) => {
                        if (isLatestMessage) {
                            messagesEndRef.current = el;
                            messageRef.current = el;
                        }
                    }}
                    className="text-white rounded-lg w-full markdown-body markdown-body-assistant hidden md:block max-w-[200px] overflow-scroll"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />

                <div
                    ref={isLatestMessage ? messageRef : null}
                    className="text-white rounded-lg w-full block md:hidden text-xs"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />
            </div>
        </div>
    );
};

export default AIAgentMessage;
