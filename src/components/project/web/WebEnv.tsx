import {
    readFileFromCodesandboxWithHibernate,
    writeFileToCodesandboxWithoutHibernate,
} from "@/actions/codesandbox";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Variable, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
const exampleEnvs = `
test
`;

type Props = {
    sandboxId: string;
};

export function WebEnv({ sandboxId }: Props) {
    const [envs, setEnvs] = useState(exampleEnvs);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        if (sandboxId) {
            setupEnvs();
        }
    }, [sandboxId]);

    const setupEnvs = async () => {
        try {
            setLoading(true);
            const response = await readFileFromCodesandboxWithHibernate(
                sandboxId,
                ".env",
            );
            console.log({
                message: ".env RESPONSE",
                response,
            });
            if (response && response.content) {
                // Format the content to be human readable
                const formattedContent = response.content.toString();
                setEnvs(formattedContent);
            } else {
                // Fallback to example if no content is returned
                setEnvs(exampleEnvs);
            }
        } catch (error) {
            console.error("Error loading environment variables:", error);
            setEnvs(exampleEnvs);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await writeFileToCodesandboxWithoutHibernate(
                sandboxId,
                ".env",
                envs,
            );
            toast({
                title: "Environment variables saved successfully",
            });
        } catch (error) {
            console.error("Error saving environment variables:", error);
            toast({
                title: "Error saving environment variables",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    className={`border-none px-4 py-2 text-sm transition-colors bg-white text-black `}
                >
                    <Variable className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-primary-dark text-white border-none">
                <AlertDialogHeader>
                    <div className="flex gap-2 items-center relative">
                        <Variable className="h-6 w-6" />
                        <AlertDialogTitle>
                            Environment Variables
                        </AlertDialogTitle>
                        <XIcon
                            className="absolute right-0 top-0 cursor-pointer text-white"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    <AlertDialogDescription>
                        This .env file will save to development environment so
                        you can test API service.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                ) : (
                    <Textarea
                        placeholder={exampleEnvs}
                        className="bg-secondary-dark text-white border-none min-h-[200px] md:min-h-[300px]"
                        value={envs}
                        onChange={(e) => setEnvs(e.target.value)}
                    />
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel className="text-black">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="text-white bg-genesoft"
                        onClick={handleSave}
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                            "Save"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
