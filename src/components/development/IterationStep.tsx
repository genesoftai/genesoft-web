import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatDateToHumanReadable } from "@/utils/common/time";
import {
    Info,
    CheckCircle,
    Clock,
    AlertCircle,
    FileCode,
    FolderTree,
    MessageSquare,
    Image,
    Trash,
    Hammer,
    FileText,
    Play,
    FilePenLine,
    Globe,
} from "lucide-react";
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

type Props = {
    id: string;
    iteration_task_id: string;
    name: string;
    description: string;
    status: string;
    remark: string;
    tool: string;
    created_at: string;
    updated_at: string;
};

const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeFormat)
    .use(rehypeStringify);

const statusIcons = {
    done: <CheckCircle className="w-4 h-4 text-green-500" />,
    in_progress: <Clock className="w-4 h-4 text-blue-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
};

const toolsIcons = {
    get_github_file_content: <FileCode className="w-4 h-4 text-blue-400" />,
    get_github_repository_trees: (
        <FolderTree className="w-4 h-4 text-green-400" />
    ),
    research_content_with_perplexity: (
        <Globe className="w-4 h-4 text-purple-400" />
    ),
    update_github_file_content: (
        <FilePenLine className="w-4 h-4 text-amber-400" />
    ),
    ask_backend_ai_agent_for_backend_integration: (
        <MessageSquare className="w-4 h-4 text-indigo-400" />
    ),
    get_image_summary_from_url: <Image className="w-4 h-4 text-pink-400" />,
    delete_github_file: <Trash className="w-4 h-4 text-red-400" />,
    run_build_task_in_sandbox: <Hammer className="w-4 h-4 text-orange-400" />,
    get_overall_project_documentation: (
        <FileText className="w-4 h-4 text-teal-400" />
    ),
    run_dev_task_in_sandbox: <Play className="w-4 h-4 text-green-400" />,
};
const IterationStep = ({
    name,
    description,
    status,
    remark,
    tool,
    created_at,
}: Props) => {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        const processMarkdown = async () => {
            if (description) {
                const file = await processor.process(description);
                const processedContent = String(file);
                setHtmlContent(processedContent);
            }
        };

        processMarkdown();
    }, [description]);

    return (
        <Card className="bg-primary-dark border-white/10 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    {toolsIcons[tool as keyof typeof toolsIcons] ||
                        statusIcons[status as keyof typeof statusIcons] || (
                            <Info className="w-4 h-4 text-gray-400" />
                        )}
                    <p className="text-xs md:text-sm font-semibold text-white">
                        {name}
                    </p>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                    {formatDateToHumanReadable(created_at)}
                </div>
            </CardHeader>
            <CardContent>
                <div
                    className="text-white markdown-body markdown-body-assistant"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(htmlContent),
                    }}
                />
                {tool === "research_content_with_perplexity" && (
                    <div className="flex gap-1 mt-2">
                        <div className="text-xs text-gray-300">
                            <p className="text-white font-semibold text-sm">
                                Citations
                            </p>
                            <ul className="list-disc list-inside">
                                {JSON.parse(remark)?.map((item: any) => (
                                    <li key={item}>
                                        <a
                                            href={item}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 text-underline cursor-pointer hover:text-blue-600"
                                        >
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IterationStep;
