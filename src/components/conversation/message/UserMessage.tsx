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

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeFormat)
    .use(rehypeStringify);

const UserMessage = ({ message }: { message: Message }) => {
    const [htmlContent, setHtmlContent] = useState("");
    const messageRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setupContent();
    }, [message?.content]);

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
            className="flex items-start gap-3 group p-2 rounded-md w-full max-w-[800px] overflow-x-scroll"
        >
            <div className="flex items-center gap-2">
                <Avatar className={`h-9 w-9 rounded-md flex-shrink-0`}>
                    {message.sender?.image ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={message.sender.image || ""}
                                alt={message.sender.name}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover block md:hidden"
                            />
                            <Image
                                src={message.sender.image || ""}
                                alt={message.sender.name}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover hidden md:block"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-white font-semibold">
                            {message.sender?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </Avatar>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex items-baseline">
                    <span className="font-semibold text-sm text-white">
                        {message.sender?.name || "User"}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        {formatDateToHumanReadable(
                            message?.created_at as unknown as string,
                        )}
                    </span>
                </div>

                <div className="flex-1 min-w-0 max-w-full">
                    {message.message_type === "image" &&
                    message.files?.[0]?.url ? (
                        <div className="mt-2">
                            <img
                                src={message.files?.[0]?.url}
                                alt="Image Message"
                                className="max-h-64 rounded-md cursor-pointer"
                                onClick={() => {
                                    window.open(
                                        message.files?.[0]?.url || "",
                                        "_blank",
                                    );
                                }}
                            />
                            {message.content && (
                                <div
                                    ref={messageRef}
                                    className="mt-2 text-white rounded-lg w-full hidden md:block markdown-body markdown-body-user"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(htmlContent),
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <div
                                ref={messageRef}
                                className="mt-1 text-white rounded-lg w-full hidden md:block markdown-body markdown-body-user"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(htmlContent),
                                }}
                            />
                            <div
                                ref={messageRef}
                                className="mt-1 text-white rounded-lg w-full block md:hidden text-xs markdown-body markdown-body-user"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(htmlContent),
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMessage;
