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
            .split("\n")
            .join("</br style='margin: 0; line-height: 0.5;'");
        setHtmlContent(processedContent);
    };

    return (
        <div
            className={`w-fit rounded-lg max-w-[80%] ${
                sender === "user"
                    ? "markdown-body-user self-end"
                    : "markdown-body-assistant self-start"
            }`}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(htmlContent),
            }}
        />
    );
};

export default Message;
