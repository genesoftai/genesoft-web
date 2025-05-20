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
import { useProjectStore } from "@/stores/project-store";
import { Loader2, Trash2, Save, X, Pencil, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetupCommand {
    id: string;
    name: string;
    command: string;
}

interface SetupCommandSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSetCommand: () => void;
}

export const SetupCommandSheet = ({
    isOpen,
    onOpenChange,
    onSetCommand,
}: SetupCommandSheetProps) => {
    const { id: projectId } = useProjectStore();
    const [commands, setCommands] = useState<SetupCommand[]>([
        { id: "1", name: "install", command: "npm install" },
        { id: "2", name: "dev", command: "npm run dev" },
        { id: "3", name: "test", command: "npm test" },
    ]);
    const [loading, setLoading] = useState(false);
    const [newCommand, setNewCommand] = useState({
        name: "",
        command: "",
    });
    const [editingCommand, setEditingCommand] = useState<SetupCommand | null>(
        null,
    );
    const { toast } = useToast();

    const handleAddCommand = async () => {
        if (!newCommand.name || !newCommand.command) return;

        try {
            setLoading(true);
            // Add API call here to save command
            const newId = Math.random().toString(36).substr(2, 9);
            const newCommandWithId = {
                id: newId,
                ...newCommand,
            };
            setCommands([...commands, newCommandWithId]);
            toast({
                title: "Success",
                description: "Command added successfully",
            });
            setNewCommand({ name: "", command: "" });
        } catch (error) {
            console.error("Error adding command:", error);
            toast({
                title: "Error",
                description: "Failed to add command",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            onSetCommand();
        }
    };

    const handleUpdateCommand = async (command: SetupCommand) => {
        try {
            setLoading(true);
            // Add API call here to update command
            const updatedCommands = commands.map((cmd) =>
                cmd.id === command.id ? command : cmd,
            );
            setCommands(updatedCommands);
            toast({
                title: "Success",
                description: "Command updated successfully",
            });
            setEditingCommand(null);
        } catch (error) {
            console.error("Error updating command:", error);
            toast({
                title: "Error",
                description: "Failed to update command",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            onSetCommand();
        }
    };

    const handleDeleteCommand = async (commandId: string) => {
        try {
            setLoading(true);
            // Add API call here to delete command
            const filteredCommands = commands.filter(
                (cmd) => cmd.id !== commandId,
            );
            setCommands(filteredCommands);
            toast({
                title: "Success",
                description: "Command deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting command:", error);
            toast({
                title: "Error",
                description: "Failed to delete command",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            onSetCommand();
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex bg-primary-dark border-secondary-dark hover:bg-primary-dark/80 hover:text-white p-4"
                >
                    <Terminal className="h-4 w-4 md:h-6 md:w-6 mr-2" />
                    <span className="text-xs md:text-sm font-medium">
                        {"Setup Commands"}
                    </span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="bg-primary-dark border-line-in-dark-bg p-6 w-[500px] text-white"
            >
                <SheetHeader>
                    <SheetTitle className="text-white">
                        Setup Commands
                    </SheetTitle>
                    <SheetDescription className="text-subtext-in-dark-bg">
                        Manage setup commands for your project that will be used
                        by Genesoft AI Agents during development.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Add new command */}
                    <div className="space-y-4 p-4 border border-line-in-dark-bg rounded-md">
                        <h3 className="text-sm font-medium">Add New Command</h3>
                        <div className="space-y-2">
                            <Label
                                htmlFor="command-name"
                                className="text-white text-xs"
                            >
                                Name
                            </Label>
                            <Input
                                id="command-name"
                                placeholder="build"
                                className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                                value={newCommand.name}
                                onChange={(e) =>
                                    setNewCommand({
                                        ...newCommand,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="command-value"
                                className="text-white text-xs"
                            >
                                Command
                            </Label>
                            <Input
                                id="command-value"
                                placeholder="npm run build"
                                className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                                value={newCommand.command}
                                onChange={(e) =>
                                    setNewCommand({
                                        ...newCommand,
                                        command: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <Button
                            onClick={handleAddCommand}
                            className="w-full bg-genesoft hover:bg-genesoft/90 text-white"
                            disabled={
                                loading ||
                                !newCommand.name ||
                                !newCommand.command
                            }
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add Command"
                            )}
                        </Button>
                    </div>

                    {/* List of commands */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Commands</h3>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                                {commands.map((cmd) => (
                                    <div
                                        key={cmd.id}
                                        className="p-3 border border-line-in-dark-bg rounded-md"
                                    >
                                        {editingCommand?.id === cmd.id ? (
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Input
                                                        className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                                                        value={
                                                            editingCommand.name
                                                        }
                                                        onChange={(e) =>
                                                            setEditingCommand({
                                                                ...editingCommand,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleUpdateCommand(
                                                                    editingCommand,
                                                                )
                                                            }
                                                            disabled={loading}
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
                                                                setEditingCommand(
                                                                    null,
                                                                )
                                                            }
                                                            disabled={loading}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Input
                                                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                                                    value={
                                                        editingCommand.command
                                                    }
                                                    onChange={(e) =>
                                                        setEditingCommand({
                                                            ...editingCommand,
                                                            command:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium">
                                                        {cmd.name}
                                                    </span>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                setEditingCommand(
                                                                    cmd,
                                                                )
                                                            }
                                                            disabled={loading}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                handleDeleteCommand(
                                                                    cmd.id,
                                                                )
                                                            }
                                                            disabled={loading}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-subtext-in-dark-bg">
                                                    {cmd.command}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SetupCommandSheet;
