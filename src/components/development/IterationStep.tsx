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
    Search,
    MessageSquare,
    Image,
    Trash,
    Hammer,
    FileText,
    Play,
    FilePenLine,
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
const fileImageUrl = {
    // JavaScript files
    ".js": "https://cdn-icons-png.flaticon.com/128/5968/5968292.png",
    ".jsx": "https://cdn-icons-png.flaticon.com/128/5968/5968292.png", // :contentReference[oaicite:4]{index=4}
    ".mjs": "https://cdn-icons-png.flaticon.com/128/5968/5968292.png", // same as .js :contentReference[oaicite:5]{index=5}

    // TypeScript files
    ".ts": "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/ts.svg", // :contentReference[oaicite:6]{index=6}
    ".tsx": "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/tsx.svg", // :contentReference[oaicite:7]{index=7}
    ".d.ts":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/ts.svg", // same as .ts :contentReference[oaicite:8]{index=8}

    // Config files
    ".json":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/json.svg", // :contentReference[oaicite:9]{index=9}
    ".env": "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/env.svg", // :contentReference[oaicite:10]{index=10}
    ".env.local":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/env.svg", // :contentReference[oaicite:11]{index=11}
    ".env.development":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/env.svg", // :contentReference[oaicite:12]{index=12}
    ".env.production":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/env.svg", // :contentReference[oaicite:13]{index=13}

    // Markup and styling
    ".html":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/html.svg", // :contentReference[oaicite:14]{index=14}
    ".css": "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/css.svg", // :contentReference[oaicite:15]{index=15}
    ".scss":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/scss.svg", // :contentReference[oaicite:16]{index=16}
    ".module.css":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/css.svg", // :contentReference[oaicite:17]{index=17}
    ".module.scss":
        "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/scss.svg", // :contentReference[oaicite:18]{index=18}

    // Documentation
    ".md": "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/markdown.svg", // :contentReference[oaicite:19]{index=19}
    ".mdx": "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/markdown.svg", // :contentReference[oaicite:20]{index=20}
    ".txt": "https://cdn.jsdelivr.net/gh/dmhendricks/file-icon-vectors@master/dist/icons/classic/txt.svg", // :contentReference[oaicite:21]{index=21}

    // Next.js specific (brand icon from Devicon)
    ".next.config.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", // :contentReference[oaicite:22]{index=22}
    ".next.config.mjs":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", // :contentReference[oaicite:23]{index=23}

    // NestJS specific (brand icon from Devicon)
    ".controller.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:24]{index=24}
    ".service.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:25]{index=25}
    ".module.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:26]{index=26}
    ".entity.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:27]{index=27}
    ".dto.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:28]{index=28}
    ".pipe.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:29]{index=29}
    ".guard.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:30]{index=30}
    ".middleware.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:31]{index=31}
    ".resolver.ts":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg", // :contentReference[oaicite:32]{index=32}
};

const toolsIcons = {
    get_github_file_content: <FileCode className="w-4 h-4 text-blue-400" />,
    get_github_repository_trees: (
        <FolderTree className="w-8 h-8 text-green-400" />
    ),
    research_content_with_perplexity: (
        <Search className="w-8 h-8 text-purple-400" />
    ),
    update_github_file_content: (
        <FilePenLine className="w-4 h-4 text-amber-400" />
    ),
    ask_backend_ai_agent_for_backend_integration: (
        <MessageSquare className="w-8 h-8 text-indigo-400" />
    ),
    get_image_summary_from_url: <Image className="w-8 h-8 text-pink-400" />,
    delete_github_file: <Trash className="w-4 h-4 text-red-400" />,
    run_build_task_in_sandbox: <Hammer className="w-8 h-8 text-orange-400" />,
    get_overall_project_documentation: (
        <FileText className="w-8 h-8 text-teal-400" />
    ),
    run_dev_task_in_sandbox: <Play className="w-4 h-4 text-green-400" />,
};
const fileTools = [
    "update_github_file_content",
    "get_github_file_content",
    "delete_github_file",
];
const IterationStep = ({
    id,
    iteration_task_id,
    name,
    description,
    status,
    remark,
    tool,
    created_at,
    updated_at,
}: Props) => {
    const [htmlContent, setHtmlContent] = useState("");

    const getFileExtension = (tool: string) => {
        if (!tool || typeof tool !== "string") return "";

        const parts = tool.split("_");
        if (parts.length < 2) return "";

        const filename = parts[1];
        const extensionParts = filename.split(".");

        // Handle special cases like .d.ts, .module.css, .next.config.js
        if (extensionParts.length > 2) {
            // Check for known patterns in fileIcons
            const fullExtension = "." + extensionParts.slice(1).join(".");
            if (fileImageUrl[fullExtension as keyof typeof fileImageUrl]) {
                return fullExtension;
            }
        }

        return extensionParts.length > 1
            ? "." + extensionParts[extensionParts.length - 1]
            : "";
    };

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
                {/* {remark && remark.length > 0 && (
                    <div className="flex gap-1 mt-2">
                        {fileTools.includes(tool) && (
                            <div className="text-xs text-gray-300">
                                <Image
                                    src={
                                        fileImageUrl[
                                            getFileExtension(
                                                remark,
                                            ) as keyof typeof fileImageUrl
                                        ] || ""
                                    }
                                    alt={tool}
                                    width={16}
                                    height={16}
                                />
                            </div>
                        )}
                        <div className="text-xs text-gray-300">• {remark}</div>
                    </div>
                )} */}
            </CardContent>
        </Card>
    );
};

export default IterationStep;
