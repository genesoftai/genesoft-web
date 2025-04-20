import { runTaskInCodesandbox } from "@/actions/codesandbox";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, SquareTerminal, XIcon } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
    vscDarkPlus,
    oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const commands = [
    {
        name: "Install Dependencies",
        command: "pnpm install",
        task: "install",
        description: "Install dependencies for the project",
    },
    {
        name: "Start App",
        command: "pnpm run start",
        task: "start-app",
        description: "Start the project",
    },
    {
        name: "Start Dev Server",
        command: "pnpm run start:dev",
        task: "dev",
        description: "Start the development server so you can test API service",
    },
    {
        name: "Build",
        command: "pnpm run build",
        task: "build",
        description: "Build the project",
    },
    {
        name: "Lint",
        command: "pnpm run lint",
        task: "lint",
        description: "Lint the project",
    },
    {
        name: "Run Tests",
        command: "pnpm run test",
        task: "test",
        description: "Run the tests",
    },
    {
        name: "Run Tests in Watch Mode",
        command: "pnpm run test:watch",
        task: "test-watch",
        description: "Run the tests in watch mode",
    },
    {
        name: "Run E2E Tests",
        command: "pnpm run test:e2e",
        task: "test-e2e",
        description: "Run the E2E tests",
    },
    {
        name: "Start Production",
        command: "pnpm run start:prod",
        task: "start-prod",
        description: "Start the production server",
    },
];
type BackendServiceTerminalProps = {
    sandboxId: string;
};

export function BackendServiceTerminal({
    sandboxId,
}: BackendServiceTerminalProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [task, setTask] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const handleRunTask = async (task: string) => {
        setTask(task);
        try {
            setIsRunning(true);
            await runTaskInCodesandbox(sandboxId, task);
        } catch (error) {
            console.error("Error running task:", error);
        } finally {
            setIsRunning(false);
            setIsOpen(false);
        }
    };
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    className={`border-none px-4 py-2 text-sm transition-colors bg-white text-black `}
                >
                    <SquareTerminal className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-primary-dark text-white border-none h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <div className="flex gap-2 items-center relative">
                        <SquareTerminal className="h-6 w-6" />
                        <AlertDialogTitle>
                            Run command to development environment
                        </AlertDialogTitle>
                        <XIcon
                            className="absolute right-0 top-0 cursor-pointer text-white"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    <AlertDialogDescription>
                        Select command to run on development environment so you
                        can test API service.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-2">
                    {commands.map((command) => (
                        <Button
                            key={command.name}
                            variant="outline"
                            className="w-full justify-start bg-secondary-dark text-white border-none flex flex-col h-fit items-start hover:text-white hover:bg-secondary-dark/90"
                            onClick={() => handleRunTask(command.task)}
                            disabled={isRunning}
                        >
                            {task === command.task && isRunning ? (
                                <div className="flex gap-2 items-center">
                                    <span className="text-sm text-left text-genesoft">
                                        Running {command.name} task...
                                    </span>
                                    <Loader2 className="h-4 w-4 animate-spin text-genesoft" />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <span className="text-sm text-left font-semibold">
                                        {command.name}
                                    </span>

                                    <SyntaxHighlighter
                                        language="bash"
                                        style={oneDark}
                                        customStyle={{
                                            margin: 0,
                                            padding: "1rem",
                                            background: "transparent",
                                        }}
                                    >
                                        {command.command}
                                    </SyntaxHighlighter>
                                </div>
                            )}
                        </Button>
                    ))}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel className="text-black">
                        close
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
