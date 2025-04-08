import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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

    useEffect(() => {
        setupContent();
    }, [message?.content]);

    useEffect(() => {
        if (sender_id === "205d57c2-6297-4b9d-83c7-2fb230804023") {
            setSenderName("Backend Developer");
        } else {
            setSenderName("Project Manager");
        }
    }, [sender_id]);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (isLatestMessage) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messagesEndRef, isLatestMessage]);

    const setupContent = async () => {
        if (!message?.content) return;

        const value = `${message?.content?.trim()}`;
        const file = await processor.process(value);
        const processedContent = String(file);
        console.log({
            message: "HTML CONTENT",
            htmlContent: processedContent,
        });
        setHtmlContent(processedContent);
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
                    ref={isLatestMessage ? messagesEndRef : null}
                    className="text-white rounded-lg w-full markdown-body markdown-body-assistant hidden md:block"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />

                <div
                    ref={isLatestMessage ? messagesEndRef : null}
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
