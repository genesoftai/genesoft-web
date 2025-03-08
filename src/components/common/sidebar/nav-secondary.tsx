import * as React from "react";
import { type LucideIcon, Send } from "lucide-react";
import { useEffect, useState } from "react";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sendSupportEmail } from "@/actions/email";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
    }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const [supportDialogOpen, setSupportDialogOpen] = useState(false);
    const [supportEmail, setSupportEmail] = useState("");
    const [supportQuery, setSupportQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { email: userEmail } = useGenesoftUserStore();

    const handleSupportClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setSupportDialogOpen(true);
    };

    const handleSupportSubmit = async () => {
        if (!supportEmail || !supportQuery) {
            toast({
                title: "Missing information",
                description: "Please provide both email and your question",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await sendSupportEmail({
                email: supportEmail,
                query: supportQuery,
            });

            if (response) {
                toast({
                    title: "Support request sent",
                    description: "We'll get back to you as soon as possible!",
                });
                setSupportQuery("");
                setSupportDialogOpen(false);
            } else {
                throw new Error("Failed to send support request");
            }
        } catch (error) {
            console.error("Error sending support request:", error);
            toast({
                title: "Error",
                description: "Failed to send your request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            setSupportEmail(userEmail);
        }
    }, [userEmail]);

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem
                            key={item.title}
                            onClick={handleSupportClick}
                        >
                            <SidebarMenuButton
                                asChild
                                size="sm"
                                className="text-white hover:bg-secondary-dark bg-primary-dark"
                            >
                                {item.title === "Support" ? (
                                    <a href="#" onClick={handleSupportClick}>
                                        <item.icon className="text-subtext-in-dark-bg" />
                                        <span className="text-subtext-in-dark-bg">
                                            {item.title}
                                        </span>
                                    </a>
                                ) : (
                                    <a href={item.url}>
                                        <item.icon className="text-subtext-in-dark-bg" />
                                        <span className="text-subtext-in-dark-bg">
                                            {item.title}
                                        </span>
                                    </a>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>

            <AlertDialog
                open={supportDialogOpen}
                onOpenChange={setSupportDialogOpen}
            >
                <AlertDialogContent className="bg-tertiary-dark border-line-in-dark-bg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Get Support
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-subtext-in-dark-bg">
                            Please provide your details and we&apos;ll get back
                            to you as soon as possible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="support-email"
                                className="text-white"
                            >
                                Your Email
                            </Label>
                            <Input
                                id="support-email"
                                placeholder="email@example.com"
                                className="bg-secondary-dark border-line-in-dark-bg text-white"
                                value={supportEmail}
                                onChange={(e) =>
                                    setSupportEmail(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="support-query"
                                className="text-white"
                            >
                                How can we help you?
                            </Label>
                            <Textarea
                                id="support-query"
                                placeholder="Describe your question, issue, or feature request in detail..."
                                className="min-h-[120px] bg-secondary-dark border-line-in-dark-bg text-white"
                                value={supportQuery}
                                onChange={(e) =>
                                    setSupportQuery(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-secondary-dark text-white hover:bg-secondary-dark/80 border-line-in-dark-bg hover:text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSupportSubmit}
                            className="bg-genesoft hover:bg-genesoft/90 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit
                                </span>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarGroup>
    );
}
