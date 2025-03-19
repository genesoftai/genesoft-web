import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import StripeSection from "./StripeSection";
import FirebaseSection from "./FirebaseSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServicesIntegrationSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ServicesIntegrationSheet = ({
    isOpen,
    onOpenChange,
}: ServicesIntegrationSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary-dark border-secondary-dark hover:bg-primary-dark/80 hover:text-white"
                >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="text-xs font-medium">
                        {"Services Integration"}
                    </span>
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="bg-primary-dark border-line-in-dark-bg p-6 w-[350px] text-white"
            >
                <SheetHeader>
                    <SheetTitle className="text-white">
                        Services Integration
                    </SheetTitle>
                    <SheetDescription className="text-subtext-in-dark-bg">
                        Configure and connect third-party services to enhance
                        your project.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                    <div className="py-6 space-y-6">
                        <FirebaseSection />
                        <StripeSection />
                    </div>
                </ScrollArea>

                <SheetFooter>
                    <SheetClose asChild>
                        <Button className="bg-genesoft hover:bg-genesoft/90 text-white text-sm">
                            Save Changes
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default ServicesIntegrationSheet;
