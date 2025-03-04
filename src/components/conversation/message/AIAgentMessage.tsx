import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import GenesoftLogo from "@public/assets/genesoft-logo-blue.png";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import DOMPurify from "dompurify";

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFormat)
    .use(rehypeStringify);

const AIAgentMessage = ({ message }: { message: Message }) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        setupContent();
    }, [message?.content]);

    const setupContent = async () => {
        const value = `${message?.content?.trim()}`;
        const file = await processor.process(value);
        const processedContent = String(file)
            .replace(/\n/g, "<br />")
            .replace(/<br \/>/g, "<br style='margin: 8px 0' />");
        setHtmlContent(processedContent);
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
                    className={`text-white text-sm rounded-lg self-start break-words overflow-hidden max-w-full`}
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />
            </div>
        </div>
    );
};

export default AIAgentMessage;
