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
import UxUiDesignerImage from "@public/ai-agent/ux-ui-deisgner.png";
import SoftwareArchitectImage from "@public/ai-agent/software-architect-ai.png";

const getAiAgentImage = (agent_id: string) => {
    // Using specific agent IDs
    if (agent_id === "50ca1ff7-c23e-49b9-9d60-d40030cc0ad9")
        return ProjectManagerImage;
    if (agent_id === "205d57c2-6297-4b9d-83c7-2fb230804023")
        return BackendDeveloperImage;
    if (agent_id === "9e83c7fe-e5d0-4bb9-b499-a53022641d64")
        return FrontendDeveloperImage;
    if (agent_id === "e3b37839-9c7c-48f3-8655-24b6c346bbde")
        return UxUiDesignerImage;
    if (agent_id === "3a9dcc39-f641-43be-9a54-0bd3797f15f2")
        return SoftwareArchitectImage;

    return "";
};

const getAiAgentName = (agent_id: string) => {
    // Using specific agent IDs
    if (agent_id === "50ca1ff7-c23e-49b9-9d60-d40030cc0ad9")
        return "Project Manager";
    if (agent_id === "205d57c2-6297-4b9d-83c7-2fb230804023")
        return "Backend Developer";
    if (agent_id === "9e83c7fe-e5d0-4bb9-b499-a53022641d64")
        return "Frontend Developer";
    if (agent_id === "e3b37839-9c7c-48f3-8655-24b6c346bbde")
        return "UX/UI Designer";
    if (agent_id === "3a9dcc39-f641-43be-9a54-0bd3797f15f2")
        return "Software Architect";
    return "Project Manager";
};

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

const AIAgentMessage = ({ message, sender_id }: AIAgentMessageProps) => {
    const [htmlContent, setHtmlContent] = useState("");
    const [senderName, setSenderName] = useState("");
    const messageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setupContent();
    }, [message?.content]);

    useEffect(() => {
        setSenderName(getAiAgentName(sender_id));
    }, [sender_id]);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [message]);

    const setupContent = async () => {
        if (!message?.content) return;

        // Format the content to ensure proper line breaks and spacing
        // 1. Normalize line endings
        let formattedContent = message.content.replace(/\r\n/g, "\n");

        // 2. Ensure proper spacing between paragraphs (two newlines)
        formattedContent = formattedContent.replace(/\n\s*\n/g, "\n\n");

        // 3. Ensure code blocks are properly formatted
        formattedContent = formattedContent.replace(
            /```(.*)\n([\s\S]*?)```/g,
            (match, language, code) => {
                // Ensure code blocks have proper spacing
                const cleanedCode = code.trim();
                return `\`\`\`${language}\n${cleanedCode}\n\`\`\``;
            },
        );

        // 4. Ensure list items are properly spaced
        formattedContent = formattedContent.replace(
            /(\n[*-] .+)(\n[^*\n-])/g,
            "$1\n$2",
        );

        // 5. Ensure proper spacing after headers
        formattedContent = formattedContent.replace(
            /(\n#{1,6} .+)\n([^#\n])/g,
            "$1\n\n$2",
        );

        // 6. Ensure proper spacing for blockquotes
        formattedContent = formattedContent.replace(
            /(\n> .+)(\n[^>\n])/g,
            "$1\n\n$2",
        );

        // 7. Trim the content and add appropriate spacing
        formattedContent = formattedContent.trim();

        // Process the formatted content
        const file = await processor.process(formattedContent);
        const processedContent = String(file);
        setHtmlContent(processedContent);
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-start gap-2 group p-1 md:p-2 rounded-md w-full max-w-[800px] overflow-x-scroll"
        >
            <div className="flex items-center gap-2">
                <div>
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-md flex-shrink-0">
                        <Image
                            src={getAiAgentImage(sender_id)}
                            alt={senderName}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover hidden md:block"
                        />
                        <Image
                            src={getAiAgentImage(sender_id)}
                            alt={senderName}
                            width={24}
                            height={24}
                            className="w-full h-full object-cover block md:hidden"
                        />
                    </Avatar>
                </div>

                <div className="flex flex-col flex-wrap items-baseline">
                    <span
                        className={`font-semibold text-xs md:text-sm text-subtext-in-dark-bg`}
                    >
                        {senderName}
                    </span>
                    <span className="ml-2 text-xs md:text-sm text-gray-500">
                        {formatDateToHumanReadable(
                            message?.created_at as unknown as string,
                        )}
                    </span>
                </div>
            </div>

            <div className="flex-1 min-w-0 max-w-full">
                <div
                    ref={messageRef}
                    className="text-white rounded-lg w-full hidden md:block markdown-body markdown-body-assistant"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />

                <div
                    ref={messageRef}
                    className="text-white rounded-lg w-full block md:hidden text-xs markdown-body markdown-body-assistant"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />
            </div>
        </div>
    );
};

export default AIAgentMessage;
