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
import { LayoutGrid } from "lucide-react";
import StripeSection from "./StripeSection";
import FirebaseSection from "./FirebaseSection";
import GitHubSection from "./GitHubSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStripeEnvs } from "@/actions/integration";
import { getFirebaseEnvs } from "@/actions/integration";
import { useProjectStore } from "@/stores/project-store";
import { FirebaseEnv, StripeEnv } from "@/types/integration";

interface ServicesIntegrationSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ServicesIntegrationSheet = ({
    isOpen,
    onOpenChange,
}: ServicesIntegrationSheetProps) => {
    const [stripeEnv, setStripeEnv] = useState<StripeEnv | null>(null);
    const [firebaseEnv, setFirebaseEnv] = useState<FirebaseEnv | null>(null);

    const { id: projectId } = useProjectStore();

    useEffect(() => {
        if (projectId) {
            setupIntegration();
        }
    }, [projectId]);

    const setupIntegration = async () => {
        const stripeEnv = await getStripeEnvs(projectId);
        const firebaseEnv = await getFirebaseEnvs(projectId);
        setStripeEnv(stripeEnv);
        setFirebaseEnv(firebaseEnv);
    };

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
                        <GitHubSection projectId={projectId} />
                        {/* <FirebaseSection
                            projectId={projectId}
                            firebaseEnv={firebaseEnv as FirebaseEnv}
                        />
                        <StripeSection
                            projectId={projectId}
                            stripeEnv={stripeEnv as StripeEnv}
                        /> */}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default ServicesIntegrationSheet;
