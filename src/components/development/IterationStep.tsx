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
    Image as ImageIcon,
    Trash,
    FileText,
    Globe,
    BookOpenText,
    File,
    CurlyBraces,
    Code2,
    PackageX,
    Server,
    SquareTerminal,
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
import PexelsLogo from "@public/brand/pexels.jpg";
import PixabayLogo from "@public/brand/pixabay.png";
import Image from "next/image";
import PackageJsonLogo from "@public/tech/nodejs.png";
import CSS from "@public/tech/css.png";
import JS from "@public/tech/javascript.png";
import TS from "@public/tech/typescript.png";
import ReactLogo from "@public/tech/react.png";
import NodeJS from "@public/tech/nodejs.png";
import Markdown from "@public/tech/markdown.png";
import Tailwindcss from "@public/tech/tailwindcss.svg";
import Git from "@public/tech/git.png";

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
    index: number;
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
    get_github_file_content: <FileCode className="w-6 h-6 text-blue-400" />,
    get_github_repository_trees: (
        <FolderTree className="w-6 h-6 text-green-400" />
    ),
    research_content_with_perplexity: (
        <Globe className="w-6 h-6 text-purple-400" />
    ),
    update_github_file_content: <Code2 className="w-6 h-6 text-amber-400" />,
    ask_backend_ai_agent_for_backend_integration: (
        <MessageSquare className="w-6 h-6 text-indigo-400" />
    ),
    get_image_summary_from_url: <ImageIcon className="w-6 h-6 text-pink-400" />,
    delete_github_file: <Trash className="w-6 h-6 text-red-400" />,
    run_build_task_in_sandbox: (
        <SquareTerminal className="w-6 h-6 text-violet-400" />
    ),
    get_overall_project_documentation: (
        <FileText className="w-6 h-6 text-teal-400" />
    ),
    run_dev_task_in_sandbox: <Server className="w-6 h-6 text-green-400" />,
    get_codebase_understanding: (
        <BookOpenText className="w-6 h-6 text-green-400" />
    ),
    update_codebase_understanding: (
        <BookOpenText className="w-6 h-6 text-green-400" />
    ),
    search_images_from_pexels: (
        <Image
            className="rounded-full"
            src={PexelsLogo}
            alt="Pexels"
            width={40}
            height={40}
        />
    ),
    search_images_from_pixabay: (
        <Image
            className="rounded-full"
            src={PixabayLogo}
            alt="Pixabay"
            width={40}
            height={40}
        />
    ),
    install_dependencies_in_sandbox: (
        <Image
            src={PackageJsonLogo}
            alt="Package.json"
            width={20}
            height={20}
        />
    ),
    uninstall_dependencies_in_sandbox: (
        <PackageX className="w-6 h-6 text-red-400" />
    ),
    run_install_task_in_sandbox: (
        <Image
            src={PackageJsonLogo}
            alt="Package.json"
            width={20}
            height={20}
        />
    ),
};

const getFileExtensionIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
        case "json":
            if (
                filename.includes("package.json") ||
                filename.includes("package-lock.json")
            ) {
                return (
                    <Image src={NodeJS} alt="NodeJS" className="h-4 w-4 mr-2" />
                );
            }
            return <CurlyBraces className="h-4 w-4 mr-2 text-amber-400" />;
        case "css":
            return <Image src={CSS} alt="CSS" className="h-4 w-4 mr-2" />;
        case "js":
            return <Image src={JS} alt="JS" className="h-4 w-4 mr-2" />;
        case "mjs":
            return <Image src={JS} alt="JS" className="h-4 w-4 mr-2" />;
        case "ts":
            if (filename.includes("tailwind.config.ts")) {
                return (
                    <Image
                        src={Tailwindcss}
                        alt="TailwindCSS"
                        className="h-4 w-4 mr-2"
                    />
                );
            }
            return <Image src={TS} alt="TS" className="h-4 w-4 mr-2" />;
        case "tsx":
            return <Image src={ReactLogo} alt="TSX" className="h-4 w-4 mr-2" />;
        case "jsx":
            return <Image src={ReactLogo} alt="JSX" className="h-4 w-4 mr-2" />;
        case "gitignore":
            return <Image src={Git} alt="Git" className="h-4 w-4 mr-2" />;
        case "md":
            return (
                <Image src={Markdown} alt="Markdown" className="h-4 w-4 mr-2" />
            );
        default:
            return <File className="h-4 w-4 mr-2 text-blue-400" />;
    }
};

const fileTools = [
    "get_github_file_content",
    "update_github_file_content",
    "delete_github_file",
];

const IterationStep = ({
    name,
    description,
    status,
    remark,
    tool,
    created_at,
    index,
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
        <Card className="bg-primary-dark border-white/10 hover:shadow-md transition-shadow w-10/12 overflow-x-scroll">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-semibold text-white">
                        {index + 1}.
                    </span>

                    {toolsIcons[tool as keyof typeof toolsIcons] ||
                        statusIcons[status as keyof typeof statusIcons] || (
                            <Info className="w-6 h-6 text-gray-400" />
                        )}
                    <p className="text-xs md:text-sm font-semibold text-subtext-in-dark-bg">
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
                            <p className="text-subtext-in-dark-bg font-semibold text-sm">
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

                {tool === "search_images_from_pexels" && (
                    <div className="flex gap-1 mt-2">
                        <div className="text-xs text-gray-300">
                            <p className="text-subtext-in-dark-bg font-semibold text-sm">
                                Images reference from
                            </p>

                            <div className="flex items-center gap-2">
                                <Image
                                    src={PexelsLogo}
                                    alt="Pexels"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <a
                                    href={"https://www.pexels.com"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-underline cursor-pointer hover:text-blue-600 text-sm"
                                >
                                    {"Pexels.com"}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
                {fileTools.includes(tool) && remark && (
                    <div className="flex items-center gap-1 mt-2">
                        {getFileExtensionIcon(remark)}
                        <p className="text-subtext-in-dark-bg font-semibold text-sm">
                            {remark}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IterationStep;
