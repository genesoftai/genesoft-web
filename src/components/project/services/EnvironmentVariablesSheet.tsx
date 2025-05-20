"use client";

import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
    getProjectEnvs,
    createProjectEnv,
    updateProjectEnv,
    deleteProjectEnv,
    ProjectEnv,
} from "@/actions/integration";
import { useProjectStore } from "@/stores/project-store";
import {
    Loader2,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Save,
    X,
    Pencil,
    Variable,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnvironmentVariablesSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSetEnv: () => void;
}

export const EnvironmentVariablesSheet = ({
    isOpen,
    onOpenChange,
    onSetEnv,
}: EnvironmentVariablesSheetProps) => {
    const { id: projectId } = useProjectStore();
    const [envs, setEnvs] = useState<ProjectEnv[]>([]);
    const [loading, setLoading] = useState(false);
    const [newEnv, setNewEnv] = useState({
        key: "",
        value: "",
        isSecret: false,
    });
    const [editingEnv, setEditingEnv] = useState<ProjectEnv | null>(null);
    const [showValues, setShowValues] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen && projectId) {
            fetchEnvs();
        }
    }, [isOpen, projectId]);

    const fetchEnvs = async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            const data = await getProjectEnvs(projectId);
            setEnvs(data);

            // Initialize showValues state for each env
            const initialShowValues: Record<string, boolean> = {};
            data.forEach((env: ProjectEnv) => {
                initialShowValues[env.id] = false;
            });
            setShowValues(initialShowValues);
        } catch (error) {
            console.error("Error fetching environment variables:", error);
            toast({
                title: "Error",
                description: "Failed to fetch environment variables",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEnv = async () => {
        if (!projectId || !newEnv.key || !newEnv.value) return;

        try {
            setLoading(true);
            await createProjectEnv(projectId, newEnv);
            toast({
                title: "Success",
                description: "Environment variable added successfully",
            });
            setNewEnv({ key: "", value: "", isSecret: false });
            fetchEnvs();
        } catch (error) {
            console.error("Error adding environment variable:", error);
            toast({
                title: "Error",
                description: "Failed to add environment variable",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            onSetEnv();
        }
    };

    const handleUpdateEnv = async (env: ProjectEnv) => {
        if (!projectId) return;

        try {
            setLoading(true);
            await updateProjectEnv(projectId, env.id, {
                value: env.value,
                isSecret: env.isSecret,
            });
            toast({
                title: "Success",
                description: "Environment variable updated successfully",
            });
            setEditingEnv(null);
            fetchEnvs();
        } catch (error) {
            console.error("Error updating environment variable:", error);
            toast({
                title: "Error",
                description: "Failed to update environment variable",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            onSetEnv();
        }
    };

    const handleDeleteEnv = async (envId: string) => {
        if (!projectId) return;

        try {
            setLoading(true);
            await deleteProjectEnv(projectId, envId);
            toast({
                title: "Success",
                description: "Environment variable deleted successfully",
            });
            fetchEnvs();
        } catch (error) {
            console.error("Error deleting environment variable:", error);
            toast({
                title: "Error",
                description: "Failed to delete environment variable",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            onSetEnv();
        }
    };

    const toggleShowValue = (envId: string) => {
        setShowValues((prev) => ({
            ...prev,
            [envId]: !prev[envId],
        }));
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex bg-primary-dark border-secondary-dark hover:bg-primary-dark/80 hover:text-white p-4"
                >
                    <Variable className="h-4 w-4 md:h-6 md:w-6 mr-2" />
                    <span className="text-xs md:text-sm font-medium">
                        {"Environment Variables"}
                    </span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="bg-primary-dark border-line-in-dark-bg p-6 w-[500px] text-white"
            >
                <SheetHeader>
                    <SheetTitle className="text-white">
                        Environment Variables
                    </SheetTitle>
                    <SheetDescription className="text-subtext-in-dark-bg">
                        Manage environment variables for your GitHub repository
                        so Genesoft AI Agents can use these variables in
                        development environment.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Add new environment variable */}
                    <div className="space-y-4 p-4 border border-line-in-dark-bg rounded-md">
                        <h3 className="text-sm font-medium">
                            Add New Variable
                        </h3>
                        <div className="space-y-2">
                            <Label
                                htmlFor="env-key"
                                className="text-white text-xs"
                            >
                                Key
                            </Label>
                            <Input
                                id="env-key"
                                placeholder="DATABASE_URL"
                                className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                                value={newEnv.key}
                                onChange={(e) =>
                                    setNewEnv({
                                        ...newEnv,
                                        key: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="env-value"
                                className="text-white text-xs"
                            >
                                Value
                            </Label>
                            <Input
                                id="env-value"
                                placeholder="postgresql://user:password@localhost:5432/db"
                                className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                                value={newEnv.value}
                                onChange={(e) =>
                                    setNewEnv({
                                        ...newEnv,
                                        value: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="env-secret"
                                checked={newEnv.isSecret}
                                onCheckedChange={(checked: boolean) =>
                                    setNewEnv({ ...newEnv, isSecret: checked })
                                }
                                className="data-[state=checked]:bg-green-500"
                            />
                            <Label
                                htmlFor="env-secret"
                                className="text-white text-xs"
                            >
                                Secret (value will be masked)
                            </Label>
                        </div>
                        <Button
                            onClick={handleAddEnv}
                            className="w-full bg-genesoft hover:bg-genesoft/90 text-white"
                            disabled={loading || !newEnv.key || !newEnv.value}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Variable"
                            )}
                        </Button>
                    </div>

                    {/* List of environment variables */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            Environment Variables
                        </h3>
                        {loading && envs.length === 0 ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-6 w-6 animate-spin text-genesoft" />
                            </div>
                        ) : envs.length === 0 ? (
                            <p className="text-subtext-in-dark-bg text-sm">
                                No environment variables found.
                            </p>
                        ) : (
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-2">
                                    {envs.map((env) => (
                                        <div
                                            key={env.id}
                                            className="p-3 border border-line-in-dark-bg rounded-md"
                                        >
                                            {editingEnv?.id === env.id ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">
                                                            {env.key}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    handleUpdateEnv(
                                                                        editingEnv,
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                {loading ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Save className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    setEditingEnv(
                                                                        null,
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor={`edit-value-${env.id}`}
                                                            className="text-white text-xs"
                                                        >
                                                            Value
                                                        </Label>
                                                        <Input
                                                            id={`edit-value-${env.id}`}
                                                            className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                                                            value={
                                                                editingEnv.value
                                                            }
                                                            onChange={(e) =>
                                                                setEditingEnv({
                                                                    ...editingEnv,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Switch
                                                            id={`edit-secret-${env.id}`}
                                                            checked={
                                                                editingEnv.isSecret
                                                            }
                                                            onCheckedChange={(
                                                                checked: boolean,
                                                            ) =>
                                                                setEditingEnv({
                                                                    ...editingEnv,
                                                                    isSecret:
                                                                        checked,
                                                                })
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`edit-secret-${env.id}`}
                                                            className="text-white text-xs"
                                                        >
                                                            Secret
                                                        </Label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium">
                                                            {env.key}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    setEditingEnv(
                                                                        env,
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    handleDeleteEnv(
                                                                        env.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-subtext-in-dark-bg">
                                                            {env.isSecret &&
                                                            !showValues[env.id]
                                                                ? "**********"
                                                                : env.value}
                                                        </span>
                                                        {env.isSecret && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    toggleShowValue(
                                                                        env.id,
                                                                    )
                                                                }
                                                            >
                                                                {showValues[
                                                                    env.id
                                                                ] ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        )}
                                                    </div>
                                                    {env.isSecret && (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                            <span className="text-xs text-subtext-in-dark-bg">
                                                                Secret
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default EnvironmentVariablesSheet;
