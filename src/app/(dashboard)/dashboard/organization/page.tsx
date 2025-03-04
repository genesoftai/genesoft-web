"use client";

import React, { useEffect, useState } from "react";
import { getUserByEmail } from "@/actions/user";
import { useUserStore } from "@/stores/user-store";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import {
    Breadcrumb,
    BreadcrumbPage,
    BreadcrumbItem,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getOrganizationsByUserId } from "@/actions/organization";
import { useRouter } from "next/navigation";
import PageLoading from "@/components/common/PageLoading";
import { GenesoftOrganization } from "@/types/organization";
import posthog from "posthog-js";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";

const pageName = "OrganizationsPage";

const OrganizationsPage = () => {
    posthog.capture("pageview_organizations");
    const { email } = useUserStore();
    const { id: userId, updateGenesoftUser } = useGenesoftUserStore();
    const [loading, setLoading] = useState(false);
    const [organizations, setOrganizations] = useState<GenesoftOrganization[]>(
        [],
    );
    const router = useRouter();
    const { id: organizationId, updateGenesoftOrganization } =
        useGenesoftOrganizationStore();

    useEffect(() => {
        if (email) {
            setupUser();
        }
    }, [email]);

    const setupUser = async () => {
        setLoading(true);
        try {
            const user = await getUserByEmail({ email });
            updateGenesoftUser(user);

            if (userId) {
                const userOrganizations =
                    await getOrganizationsByUserId(userId);
                setOrganizations(userOrganizations);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrganization = () => {
        posthog.capture("click_create_organization_from_organizations_page");
        router.push("/dashboard");
    };

    const handleSelectOrganization = (organizationId: string) => {
        posthog.capture("click_select_organization");
        const org = organizations.find(
            (organization) => organization.id === organizationId,
        );
        updateGenesoftOrganization({
            id: organizationId,
            name: org?.name,
            description: org?.description,
            image: org?.image,
            is_active: org?.is_active,
            created_at: org?.created_at,
            updated_at: org?.updated_at,
        });
        router.push(`/dashboard/organization/info`);
    };

    if (loading) {
        return <PageLoading size={50} text={"Loading your organizations..."} />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary-dark text-white w-full">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1 text-white" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white">
                                    Organizations
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                <div className="flex flex-col gap-4 p-4 md:p-8 w-full rounded-xl bg-secondary-dark">
                    <div>
                        <div className="flex flex-col gap-y-2 mb-8">
                            <p className="text-xl md:text-2xl text-subtext-in-dark-bg font-bold">
                                Your Organizations
                            </p>
                            <p className="text-sm md:text-base text-subtext-in-dark-bg">
                                List of all organizations you are a member of
                            </p>
                        </div>

                        {organizations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-0 w-full">
                                {organizations.map((organization) => (
                                    <div
                                        key={organization.id}
                                        className="flex flex-col p-4 rounded-lg bg-tertiary-dark border border-neutral-700 hover:border-genesoft transition-all cursor-pointer"
                                        onClick={() =>
                                            handleSelectOrganization(
                                                organization.id,
                                            )
                                        }
                                    >
                                        <h3 className="text-lg font-bold text-white mb-2">
                                            {organization.name}
                                        </h3>
                                        <p className="text-sm text-subtext-in-dark-bg mb-4">
                                            {organization.description}
                                        </p>
                                        <div className="mt-auto">
                                            <Button
                                                className={`w-full ${
                                                    organizationId !==
                                                    organization.id
                                                        ? "bg-genesoft hover:bg-genesoft/80 text-white"
                                                        : "bg-gray-500 text-gray-300"
                                                }`}
                                                disabled={
                                                    organizationId ===
                                                    organization.id
                                                }
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectOrganization(
                                                        organization.id,
                                                    );
                                                }}
                                            >
                                                {organizationId !==
                                                organization.id
                                                    ? "Select Organization"
                                                    : "Current Organization"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-base p-4 text-subtext-in-dark-bg">
                                You are not a member of any organizations yet.
                                Create one!
                            </p>
                        )}
                    </div>

                    {organizations.length === 0 && (
                        <Button
                            className="flex items-center p-4 self-center w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                            onClick={handleCreateOrganization}
                        >
                            <span className="text-xs md:text-base">
                                Create Organization
                            </span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizationsPage;
