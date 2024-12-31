"use client";

import React, { useEffect, useState } from "react";
import { getUserByEmail } from "@/actions/user";
import { useUserStore } from "@/stores/user-store";
import SimpleLoading from "@/components/common/SimpleLoading";
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
import { updateOrganization } from "@/actions/organization";
import { useRouter } from "next/navigation";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { GenesoftOrganization } from "@/types/organization";
import { useCreateProjectStore } from "@/stores/create-project-store";

type Props = {};

const pageName = "OrganizationInfoPage";
const OrganizationInfoPage = (props: Props) => {
    const { email } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [hasOrganization, setHasOrganization] = useState(false);
    const [organization, setOrganization] =
        useState<GenesoftOrganization | null>(null);
    const [organizationName, setOrganizationName] = useState("");
    const [organizationDescription, setOrganizationDescription] = useState("");
    const [isUpdatingOrganization, setIsUpdatingOrganization] = useState(false);
    const router = useRouter();
    const { updateGenesoftUser } = useGenesoftUserStore();

    useEffect(() => {
        if (email) {
            setupUserOrganization();
        }
    }, [email]);

    const setupUserOrganization = async () => {
        setLoading(true);
        const user = await getUserByEmail({ email });
        if (!user.organization) {
            router.push("/dashboard");
        }
        setHasOrganization(user.organization !== null);
        setOrganization(user.organization);
        updateGenesoftUser(user);
        setLoading(false);
        setOrganizationName(user.organization.name);
        setOrganizationDescription(user.organization.description);
    };

    const handleUpdateOrganization = async () => {
        setIsUpdatingOrganization(true);
        try {
            const result = await updateOrganization({
                id: organization.id,
                name: organizationName,
                description: organizationDescription,
            });
            console.log({
                message: `${pageName}: Organization created successfully`,
                result,
            });
            setHasOrganization(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdatingOrganization(false);
        }
    };

    console.log({
        message: `${pageName}: Overview`,
        email,
        hasOrganization,
        organization,
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-primary-dark text-white">
                <SimpleLoading color="#2563EB" size={50} />
                <p className="text-2xl">
                    Loading your organization information...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary-dark text-white w-full">
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white">
                                    Organization
                                </BreadcrumbPage>
                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                                <BreadcrumbPage className="text-white">
                                    Info
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
                {hasOrganization && (
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min p-4 w-full flex flex-col">
                        <p className="text-2xl p-4 text-subtext-in-dark-bg font-bold">
                            Organization Information
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
                                disabled={isUpdatingOrganization}
                                className="flex items-center p-4 self-center w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                                onClick={handleUpdateOrganization}
                            >
                                <span>Update organization</span>
                                {isUpdatingOrganization && (
                                    <Loader2 className="animate-spin" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizationInfoPage;
