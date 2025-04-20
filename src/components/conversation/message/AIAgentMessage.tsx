import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import GenesoftLogo from "@public/assets/genesoft-logo-black.png";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import DOMPurify from "dompurify";
import { Loader2 } from "lucide-react";

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFormat)
    .use(rehypeStringify);

type AIAgentMessageProps = {
    message: Message;
    messagesLength: number;
    index: number;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    status: string;
};

const AIAgentMessage = ({
    message,
    messagesLength,
    index,
    messagesEndRef,
    status,
}: AIAgentMessageProps) => {
    const [htmlContent, setHtmlContent] = useState("");
    const [displayedContent, setDisplayedContent] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [processingComplete, setProcessingComplete] = useState(false);
    const isLatestMessage = index === messagesLength - 1;
    const shouldStream = status !== "submitted" && isLatestMessage;

    useEffect(() => {
        setupContent();
    }, [message?.content]);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (isLatestMessage) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messagesEndRef, isLatestMessage, displayedContent]);

    useEffect(() => {
        if (
            processingComplete &&
            shouldStream &&
            currentIndex < htmlContent.length
        ) {
            const timeoutId = setTimeout(() => {
                setDisplayedContent((prev) => prev + htmlContent[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 10);

            return () => clearTimeout(timeoutId);
        }
    }, [
        processingComplete,
        currentIndex,
        htmlContent,
        messagesEndRef,
        isLatestMessage,
        shouldStream,
    ]);

    const setupContent = async () => {
        if (!message?.content) return;

        const value = `${message?.content?.trim()}`;
        const file = await processor.process(value);
        const processedContent = String(file)
            .replace(/\n/g, "<br />")
            .replace(/<br \/>/g, "<br style='margin: 8px 0' />");

        setHtmlContent(processedContent);
        setProcessingComplete(true);

        // Only reset for streaming if it's the latest message and not submitted
        if (shouldStream) {
            setDisplayedContent("");
            setCurrentIndex(0);
        } else {
            // For older messages or submitted status, show the full content immediately
            setDisplayedContent(processedContent);
        }
    };

    return (
        <div className="flex items-start gap-3 group p-2 rounded-md w-full overflow-hidden">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-md flex-shrink-0">
                <Image
                    src={GenesoftLogo}
                    alt="Genesoft Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover hidden md:block"
                />
                <Image
                    src={GenesoftLogo}
                    alt="Genesoft Logo"
                    width={24}
                    height={24}
                    className="w-full h-full object-cover block md:hidden"
                />
            </Avatar>

            <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-baseline">
                    <span className={`font-semibold text-sm text-genesoft`}>
                        {message.sender?.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        {formatDateToHumanReadable(
                            message?.created_at as unknown as string,
                        )}
                    </span>
                </div>

                <div
                    ref={isLatestMessage ? messagesEndRef : null}
                    className={`text-white text-sm rounded-lg self-start break-words overflow-hidden max-w-full`}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                            shouldStream ? displayedContent : htmlContent,
                        ),
                    }}
                />

                {shouldStream && !processingComplete && (
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs">Generating response...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAgentMessage;
