"use client";

import React, { useState, useEffect } from "react";
import {
    getCodebaseUnderstanding,
    getRepositoryTreesFromProject,
    updateCodebaseUnderstanding,
    getFileContentFromProject,
    updateFileContent,
} from "@/actions/codebase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Loader2,
    Save,
    Edit,
    Code,
    Folder,
    ChevronRight,
    ChevronDown,
    CurlyBraces,
    File,
    Check,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
    buildFileTreeForEditor,
    processRepositoryTree,
} from "@/utils/common/codebase";
import { cn } from "@/lib/utils";
import CSS from "@public/tech/css.png";
import JS from "@public/tech/javascript.png";
import TS from "@public/tech/typescript.png";
import ReactLogo from "@public/tech/react.png";
import NodeJS from "@public/tech/nodejs.png";
import Markdown from "@public/tech/markdown.png";
import Tailwindcss from "@public/tech/tailwindcss.svg";
import Git from "@public/tech/git.png";

import Image from "next/image";

type Props = {
    projectId?: string;
};

interface FileItem {
    name: string;
    path: string;
    type: "file" | "directory";
    children?: FileItem[];
    sha: string;
    size?: number;
    url: string;
}

const CodeEditor = ({ projectId }: Props) => {
    const [open, setOpen] = useState(false);
    const [codebaseUnderstanding, setCodebaseUnderstanding] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [repositoryTree, setRepositoryTree] = useState<FileItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [fileContent, setFileContent] = useState("");
    const [editableFileContent, setEditableFileContent] = useState("");
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [isEditingFile, setIsEditingFile] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState<
        Record<string, boolean>
    >({});

    useEffect(() => {
        if (projectId && open) {
            fetchCodebaseUnderstanding();
            setupRepositoryTree();
        }
    }, [projectId, open]);

    useEffect(() => {
        if (fileContent) {
            setEditableFileContent(fileContent);
        }
    }, [fileContent]);

    const fetchCodebaseUnderstanding = async () => {
        if (!projectId) return;

        setIsLoading(true);
        try {
            const data = await getCodebaseUnderstanding(projectId);
            setCodebaseUnderstanding(data.understanding || "");
        } catch (error) {
            console.error("Failed to fetch codebase understanding:", error);
            toast("Failed to load codebase understanding", {
                className: "bg-red-500 text-white",
                icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                description:
                    "An error occurred while fetching the codebase understanding",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const setupRepositoryTree = async () => {
        if (!projectId) return;

        setIsLoading(true);
        try {
            const data = await getRepositoryTreesFromProject(projectId);
            const processedTree = processRepositoryTree(data);
            setRepositoryTree(processedTree);
        } catch (error) {
            console.error("Failed to fetch repository tree:", error);
            toast("Failed to load repository structure", {
                className: "bg-red-500 text-white",
                icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                description:
                    "An error occurred while fetching the repository structure",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!projectId) return;

        setIsSaving(true);
        try {
            await updateCodebaseUnderstanding(projectId, codebaseUnderstanding);

            toast("Codebase understanding updated successfully", {
                className: "bg-green-500 text-white",
                icon: <Check className="h-4 w-4 text-green-500" />,
                description: "Your changes have been saved",
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save codebase understanding:", error);
            toast("Failed to save codebase understanding", {
                className: "bg-red-500 text-white",
                icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                description: "An error occurred while saving your changes",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const toggleFileEditMode = () => {
        setIsEditingFile(!isEditingFile);
    };

    const toggleFolder = (path: string) => {
        setExpandedFolders((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const handleFileSelect = async (file: FileItem) => {
        if (file.type === "file") {
            setSelectedFile(file);
            setIsLoadingFile(true);
            setIsEditingFile(false);
            console.log("File:", file);
            try {
                const data = await getFileContentFromProject(
                    projectId,
                    file.path,
                );
                setFileContent(data.content || "");
            } catch (error) {
                console.error("Failed to fetch file content:", error);
                toast("Failed to load file content", {
                    className: "bg-red-500 text-white",
                    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                    description:
                        "An error occurred while fetching the file content",
                });
                setFileContent(`// Error loading content for ${file.path}`);
            } finally {
                setIsLoadingFile(false);
            }
        }
    };

    const handleSaveFile = async () => {
        if (!projectId || !selectedFile) return;

        setIsSaving(true);
        try {
            // TODO: Implement file content update API call
            await updateFileContent(
                projectId,
                selectedFile.path,
                editableFileContent,
            );

            toast("File updated successfully", {
                className: "bg-green-500 text-white",
                icon: <Check className="h-4 w-4 text-green-500" />,
                description: "Your changes have been saved",
            });
            setFileContent(editableFileContent);
            setIsEditingFile(false);
        } catch (error) {
            console.error("Failed to save file:", error);
            toast("Failed to save file", {
                className: "bg-red-500 text-white",
                icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                description: "An error occurred while saving your changes",
            });
        } finally {
            setIsSaving(false);
        }
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
                        <Image
                            src={NodeJS}
                            alt="NodeJS"
                            className="h-4 w-4 mr-2"
                        />
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
                return (
                    <Image src={ReactLogo} alt="TSX" className="h-4 w-4 mr-2" />
                );
            case "jsx":
                return (
                    <Image src={ReactLogo} alt="JSX" className="h-4 w-4 mr-2" />
                );
            case "gitignore":
                return <Image src={Git} alt="Git" className="h-4 w-4 mr-2" />;
            case "md":
                return (
                    <Image
                        src={Markdown}
                        alt="Markdown"
                        className="h-4 w-4 mr-2"
                    />
                );
            default:
                return <File className="h-4 w-4 mr-2 text-blue-400" />;
        }
    };

    const renderFileTree = (items: FileItem[], level = 0) => {
        return items.map((item) => (
            <div key={item.path} className="pl-4">
                <div
                    className={cn(
                        "flex items-center py-1 cursor-pointer hover:bg-primary-dark/20 rounded px-2",
                        selectedFile?.path === item.path &&
                            "bg-primary-dark/30",
                    )}
                    onClick={() =>
                        item.type === "directory"
                            ? toggleFolder(item.path)
                            : handleFileSelect(item)
                    }
                >
                    {item.type === "directory" ? (
                        <>
                            {expandedFolders[item.path] ? (
                                <ChevronDown className="h-4 w-4 mr-1" />
                            ) : (
                                <ChevronRight className="h-4 w-4 mr-1" />
                            )}
                            <Folder className="h-4 w-4 mr-2 text-yellow-400" />
                        </>
                    ) : (
                        <>
                            <div className="w-4 mr-1" />
                            {getFileExtensionIcon(item.name)}
                        </>
                    )}
                    <span className="text-sm">{item.name}</span>
                </div>
                {item.type === "directory" &&
                    item.children &&
                    expandedFolders[item.path] && (
                        <div className="ml-2 border-l border-line-in-dark-bg">
                            {renderFileTree(item.children, level + 1)}
                        </div>
                    )}
            </div>
        ));
    };

    // Helper function to determine language for syntax highlighting
    const getLanguageFromFilename = (filename: string) => {
        const extension = filename.split(".").pop()?.toLowerCase();
        switch (extension) {
            // JavaScript/TypeScript
            case "js":
                return "javascript";
            case "jsx":
                return "jsx";
            case "ts":
                return "typescript";
            case "tsx":
                return "tsx";
            case "mjs":
                return "javascript";
            case "cjs":
                return "javascript";

            // NextJS specific
            case "next-env.d.ts":
                return "typescript";
            case "next.config.js":
                return "javascript";

            // NestJS specific
            case "module.ts":
                return "typescript";
            case "controller.ts":
                return "typescript";
            case "service.ts":
                return "typescript";
            case "resolver.ts":
                return "typescript";
            case "entity.ts":
                return "typescript";
            case "dto.ts":
                return "typescript";
            case "guard.ts":
                return "typescript";
            case "middleware.ts":
                return "typescript";
            case "pipe.ts":
                return "typescript";
            case "filter.ts":
                return "typescript";
            case "interceptor.ts":
                return "typescript";

            // Data formats
            case "json":
                return "json";
            case "yml":
            case "yaml":
                return "yaml";

            // Web files
            case "html":
                return "html";
            case "css":
                return "css";
            case "scss":
                return "scss";
            case "sass":
                return "sass";
            case "less":
                return "less";

            // Documentation
            case "md":
                return "markdown";

            // Config files
            case "env":
                return "text";
            case "gitignore":
                return "text";
            case "dockerignore":
                return "text";
            case "editorconfig":
                return "text";
            case "eslintrc":
                return "json";
            case "prettierrc":
                return "json";

            default:
                return "text";
        }
    };

    return (
        <div className="self-center flex justify-between items-center w-full">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="flex items-center bg-primary-dark border-secondary-dark hover:bg-secondary-dark hover:text-white"
                    >
                        <Code className="h-4 w-4" />
                        <span>Code Editor</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-full md:w-[90%] max-w-[1400px] h-[90%] bg-primary-dark border-line-in-dark-bg text-white rounded-lg flex flex-col transition-colors">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            <span>Code Editor</span>
                        </DialogTitle>
                        <DialogDescription className="text-subtext-in-dark-bg">
                            Browse the repository files, select files to edit,
                            and save your changes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-1 gap-4 overflow-hidden">
                        {/* File tree sidebar */}
                        <div className="w-1/4 border-r border-line-in-dark-bg overflow-y-auto p-2">
                            <h3 className="text-sm font-medium mb-2">
                                Repository Files
                            </h3>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-20">
                                    <Loader2 className="h-6 w-6 animate-spin text-genesoft" />
                                </div>
                            ) : repositoryTree.length > 0 ? (
                                <div className="mt-2">
                                    {renderFileTree(repositoryTree)}
                                </div>
                            ) : (
                                <p className="text-sm text-subtext-in-dark-bg">
                                    No files found
                                </p>
                            )}
                        </div>

                        {/* Main content area */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto">
                                {selectedFile ? (
                                    <div className="h-full flex flex-col">
                                        <div className="p-2 text-sm font-medium border-b border-line-in-dark-bg">
                                            <div className="flex items-center gap-2">
                                                {getFileExtensionIcon(
                                                    selectedFile.name,
                                                )}
                                                <span>{selectedFile.path}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-2 overflow-auto">
                                            {isLoadingFile ? (
                                                <div className="flex items-center justify-center h-20">
                                                    <Loader2 className="h-6 w-6 animate-spin text-genesoft" />
                                                </div>
                                            ) : isEditingFile ? (
                                                <Textarea
                                                    value={editableFileContent}
                                                    onChange={(e) =>
                                                        setEditableFileContent(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="min-h-[200px] mt-2 bg-secondary-dark border-line-in-dark-bg text-white focus:border-white/50 transition-colors h-full font-mono"
                                                    style={{
                                                        height: "calc(100% - 16px)",
                                                    }}
                                                />
                                            ) : (
                                                <SyntaxHighlighter
                                                    language={getLanguageFromFilename(
                                                        selectedFile.path,
                                                    )}
                                                    style={atomOneDark}
                                                    className="h-full"
                                                    showLineNumbers={true}
                                                    wrapLines={true}
                                                >
                                                    {fileContent}
                                                </SyntaxHighlighter>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full p-4">
                                        <div className="flex flex-col gap-2 mb-4">
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg font-medium mb-2">
                                                    Codebase Understanding
                                                </p>
                                            </div>

                                            <p className="text-sm text-subtext-in-dark-bg">
                                                This is the codebase
                                                understanding for AI Agents to
                                                understand codebase and develop
                                                the project. AI Agent can make
                                                mistakes, so you can update
                                                codebase understanding to
                                                improve AI Agent capabilities.
                                            </p>
                                        </div>

                                        {isEditing ? (
                                            <Textarea
                                                id="codebase-understanding"
                                                value={codebaseUnderstanding}
                                                onChange={(e) =>
                                                    setCodebaseUnderstanding(
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[200px] mt-2 bg-secondary-dark border-line-in-dark-bg text-white focus:border-white/50 transition-colors h-full"
                                                placeholder="Describe your codebase understanding..."
                                            />
                                        ) : (
                                            <div className="text-white rounded-lg w-full p-4 bg-secondary-dark min-h-[200px] mt-2 border border-line-in-dark-bg overflow-auto whitespace-pre-wrap">
                                                <SyntaxHighlighter
                                                    language="yaml"
                                                    style={atomOneDark}
                                                >
                                                    {codebaseUnderstanding}
                                                </SyntaxHighlighter>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 border-t border-line-in-dark-bg pt-4">
                        {selectedFile ? (
                            isEditingFile ? (
                                <>
                                    <Button
                                        onClick={toggleFileEditMode}
                                        variant="outline"
                                        className="text-white bg-tertiary-dark border-line-in-dark-bg hover:bg-secondary-dark hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveFile}
                                        disabled={isSaving}
                                        className="bg-genesoft hover:bg-genesoft/80 text-white"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => setSelectedFile(null)}
                                        variant="outline"
                                        className="text-white bg-tertiary-dark border-line-in-dark-bg hover:bg-secondary-dark hover:text-white"
                                    >
                                        Back to Understanding
                                    </Button>
                                    <Button
                                        onClick={toggleFileEditMode}
                                        className="bg-genesoft hover:bg-genesoft/80 text-white"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit File
                                    </Button>
                                </>
                            )
                        ) : isEditing ? (
                            <>
                                <Button
                                    onClick={toggleEditMode}
                                    variant="outline"
                                    className="text-white bg-tertiary-dark border-line-in-dark-bg hover:bg-secondary-dark hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-genesoft hover:bg-genesoft/80 text-white"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={toggleEditMode}
                                className="bg-genesoft hover:bg-genesoft/80 text-white"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CodeEditor;
