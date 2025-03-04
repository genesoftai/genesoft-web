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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    createOrganization,
    getOrganizationProjects,
    getOrganizationsByUserId,
} from "@/actions/organization";
import { useRouter } from "next/navigation";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { ProjectCard } from "@/components/project/ProjectCard";
import PageLoading from "@/components/common/PageLoading";
import { GenesoftUser } from "@/types/user";
import { Project } from "@/types/project";
import posthog from "posthog-js";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import OrganizationProjects from "@/components/project/manage/OrganizationProjects";
const pageName = "DashboardPage";

export default function Dashboard() {
    posthog.capture("pageview_dashboard");
    const { email } = useUserStore();
    const { updateGenesoftUser } = useGenesoftUserStore();
    const [loading, setLoading] = useState(false);
    const [hasOrganization, setHasOrganization] = useState(false);
    const [user, setUser] = useState<GenesoftUser | null>(null);
    const [organizationName, setOrganizationName] = useState("");
    const [organizationDescription, setOrganizationDescription] = useState("");
    const [isCreatingOrganization, setIsCreatingOrganization] = useState(false);
    const [organizationProjects, setOrganizationProjects] = useState<Project[]>(
        [],
    );
    const router = useRouter();
    const { id: organizationId, updateGenesoftOrganization } =
        useGenesoftOrganizationStore();

    useEffect(() => {
        if (email) {
            setupUser();
        }
        if (hasOrganization) {
            setUpOrganizationProjects();
        }
    }, [email, hasOrganization]);

    const setupUser = async () => {
        setLoading(true);
        const user = await getUserByEmail({ email });
        const organizations = await getOrganizationsByUserId(user.id);
        setHasOrganization(organizations.length > 0);
        setUser(user);
        updateGenesoftUser(user);
        if (organizations.length > 0) {
            updateGenesoftOrganization({
                id: organizations[0].id,
                name: organizations[0].name,
            });
        }

        setLoading(false);
    };

    const handleCreateOrganization = async () => {
        posthog.capture("click_create_organization_from_dashboard");
        setIsCreatingOrganization(true);
        try {
            const result = await createOrganization({
                email,
                name: organizationName,
                description: organizationDescription,
            });
            console.log({
                message: `${pageName}: Organization created successfully`,
                result,
            });
            setHasOrganization(true);
            updateGenesoftOrganization({
                id: result.id,
                name: result.name,
                description: result.description,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreatingOrganization(false);
        }
    };

    const setUpOrganizationProjects = async () => {
        const projects = await getOrganizationProjects(organizationId);
        console.log({
            message: `${pageName}: Organization projects`,
            projects,
        });
        setOrganizationProjects(projects);
    };

    console.log({
        message: `${pageName}: Overview`,
        email,
        hasOrganization,
        user,
    });

    if (loading) {
        return <PageLoading size={50} text={"Loading your information..."} />;
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
                                    Dashboard
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                {hasOrganization ? (
                    <OrganizationProjects organizationId={organizationId} />
                ) : (
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min p-4 w-full flex flex-col">
                        <p className="text-2xl p-4 text-subtext-in-dark-bg font-bold">
                            Create Organization
                        </p>

                        <p className="text-base p-4 text-subtext-in-dark-bg">
                            You don&apos;t have an organization yet. Please
                            create a new organization.
                        </p>

                        <div className="flex flex-col items-start gap-y-8 p-4 self-center w-10/12 sm:w-8/12 md:w-6/12">
                            <div className="grid w-full max-w-sm items-center gap-1.5 text-subtext-in-dark-bg">
                                <Label
                                    className="text-xl font-bold"
                                    htmlFor="name"
                                >
                                    Organization Name
                                </Label>
                                <Input
                                    type="text"
                                    id="name"
                                    placeholder="Enter name of your organization"
                                    className="border-tertiary-dark bg-neutral-700 w-8/12"
                                    required
                                    value={organizationName}
                                    onChange={(e) =>
                                        setOrganizationName(e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid w-full gap-1.5 text-subtext-in-dark-bg">
                                <Label
                                    className="text-xl font-bold"
                                    htmlFor="description"
                                >
                                    Organization Description
                                </Label>
                                <Textarea
                                    placeholder="Enter description of your organization"
                                    id="description"
                                    className="border-tertiary-dark bg-neutral-700 w-full"
                                    required
                                    value={organizationDescription}
                                    onChange={(e) =>
                                        setOrganizationDescription(
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <Button
                                disabled={isCreatingOrganization}
                                className="flex items-center p-4 self-center w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                                onClick={handleCreateOrganization}
                            >
                                <span>Create organization</span>
                                {isCreatingOrganization && (
                                    <Loader2 className="animate-spin" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
