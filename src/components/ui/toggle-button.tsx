import React from "react";
import { Button } from "@/components/ui/button";
import {
    PanelRight,
    PanelLeftClose,
    MonitorPlay,
    PanelRightClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToggleButtonProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    className?: string;
    showLabel?: boolean;
}

export function ToggleButton({
    isCollapsed,
    setIsCollapsed,
    className,
    showLabel = true,
}: ToggleButtonProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "gap-2 transition-all duration-300 hover:bg-gray-200",
                            isCollapsed ? "bg-gray-200" : "bg-white",
                            className,
                        )}
                    >
                        {showLabel && (
                            <span className="text-sm text-black">
                                {isCollapsed ? "Show" : "Hide"}
                            </span>
                        )}
                        {isCollapsed ? (
                            <MonitorPlay className="h-4 w-4" />
                        ) : (
                            <PanelRightClose className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-white text-xs">
                        {isCollapsed ? "Show" : "Hide"}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default ToggleButton;
