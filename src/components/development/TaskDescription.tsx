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

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeFormat)
    .use(rehypeStringify);

type TaskDescriptionProps = {
    description: string;
};

const TaskDescription = ({ description }: TaskDescriptionProps) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        setupContent();
    }, [description]);

    const setupContent = async () => {
        if (!description) return;

        // Process the content
        const file = await processor.process(description);
        const processedContent = String(file);
        setHtmlContent(processedContent);
    };

    return (
        <div className="flex flex-col items-start gap-2 group p-1 md:p-2 rounded-md w-full max-h-[300px] md:max-h-[500px] overflow-y-scroll overflow-x-scroll">
            <div className="flex-1 min-w-0 max-w-full">
                <div
                    className="text-white rounded-lg w-full markdown-body markdown-body-assistant"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />
            </div>
        </div>
    );
};

export default TaskDescription;
