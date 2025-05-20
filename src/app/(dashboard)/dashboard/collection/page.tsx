"use client";

import React, { useEffect, useState } from "react";
import { getUserByEmail } from "@/actions/user";
import { useUserStore } from "@/stores/user-store";
import {
    Breadcrumb,
    BreadcrumbPage,
    BreadcrumbItem,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getOrganizationsByUserId } from "@/actions/organization";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import PageLoading from "@/components/common/PageLoading";
import posthog from "posthog-js";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { useSearchParams } from "next/navigation";
import { createSubscriptionFromCheckoutSession } from "@/actions/subscription";
import Collections from "@/components/collection/Collections";

export default function CollectionsPage() {
    posthog.capture("pageview_dashboard");
    const { email } = useUserStore();
    const { updateGenesoftUser } = useGenesoftUserStore();
    const [loading, setLoading] = useState(false);
    const [hasOrganization, setHasOrganization] = useState(false);

    const { id: organizationId, updateGenesoftOrganization } =
        useGenesoftOrganizationStore();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");

    useEffect(() => {
        if (success && sessionId) {
            createSubscriptionFromCheckoutSession(sessionId);
        }
    }, [success, sessionId]);

    useEffect(() => {
        if (email) {
            setupUser();
        }
    }, [email, hasOrganization]);

    const setupUser = async () => {
        setLoading(true);
        const user = await getUserByEmail({ email });
        const organizations = await getOrganizationsByUserId(user.id);
        setHasOrganization(organizations.length > 0);
        updateGenesoftUser(user);
        if (!organizationId && organizations.length > 0) {
            updateGenesoftOrganization({
                id: organizations[0].id,
                name: organizations[0].name,
            });
        }

        setLoading(false);
    };

    if (loading) {
        return <PageLoading size={50} text={"Loading your collections..."} />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-genesoft-dark text-white w-full">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1 text-white" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white">
                                    Collections
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                <Collections organizationId={organizationId} />
            </div>
        </div>
    );
}
