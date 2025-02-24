import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import "github-markdown-css";

type Props = {
    content: string;
    sender: string;
};

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFormat)
    .use(rehypeStringify);

const Message = ({ content, sender }: Props) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        setupContent();
    }, [content]);

    const setupContent = async () => {
        const value = `${content?.trim()}`;
        const file = await processor.process(value);
        const processedContent = String(file)
            .replace(/\n/g, "<br />")
            .replace(/<br \/>/g, "<br style='margin: 8px 0' />");
        setHtmlContent(processedContent);
    };

    return (
        <div
            className={`w-fit h-fit rounded-lg max-w-[80%] ${
                sender === "user"
                    ? "markdown-body-user self-end p-4"
                    : "markdown-body-assistant self-start py-2 px-4"
            }`}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(htmlContent),
            }}
        />
    );
};

export default Message;
