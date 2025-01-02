import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Globe,
    Rocket,
} from "lucide-react";

export function WebInfo() {
    return (
        <Card className="bg-primary-dark border-none text-white">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Web Application Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Current Status</div>
                    <div className="flex items-center gap-2 text-sm text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                        Deployed on cloud
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">URL</div>
                    <a
                        href="https://fijigirl-store.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
                    >
                        <Globe className="h-4 w-4" />
                        https://fijigirl-store.com
                    </a>
                </div>

                <Collapsible>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Pages</div>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            See more about pages
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="mt-2 space-y-2">
                        {/* Add page content here */}
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">
                            3rd party services
                        </div>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            See more about pages
                            <ChevronUp className="h-4 w-4" />
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="mt-2 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">Payment</div>
                            <div className="font-medium">Stripe</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">Email</div>
                            <div className="font-medium">Sendgrid</div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div className="flex flex-col items-center gap-2">
                    <Button
                        className="bg-genesoft w-fit self-center hover:text-black hover:bg-white"
                        size="lg"
                    >
                        <Rocket className="mr-2 h-4 w-4" />
                        <span>Launch</span>
                    </Button>
                    <p className="text-xs text-subtext-in-dark-bg">
                        Make latest version of your web online
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
