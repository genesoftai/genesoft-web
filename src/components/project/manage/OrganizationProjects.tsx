import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { ProjectCard } from "../ProjectCard";
import { Project } from "@/types/project";
import posthog from "posthog-js";
import { useRouter } from "next/navigation";
import { getOrganizationProjects } from "@/actions/organization";

type Props = {
    organizationId: string;
};

const OrganizationProjects = ({ organizationId }: Props) => {
    const router = useRouter();
    const [organizationProjects, setOrganizationProjects] = useState<Project[]>(
        [],
    );

    const handleCreateProject = () => {
        posthog.capture("click_create_project_from_organization_projects");
        router.push("/dashboard/project/create/info");
    };

    const setUpOrganizationProjects = async () => {
        const projects = await getOrganizationProjects(organizationId);
        setOrganizationProjects(projects);
    };

    useEffect(() => {
        if (organizationId) {
            setUpOrganizationProjects();
        }
    }, [organizationId]);

    return (
        <div className="flex flex-col gap-4 p-4 md:p-8 w-full rounded-xl bg-secondary-dark">
            <div>
                <div className="flex flex-col gap-y-2 mb-8">
                    <p className="text-xl md:text-2xl text-subtext-in-dark-bg font-bold">
                        Organization Projects
                    </p>
                    <p className="text-sm md:text-base text-subtext-in-dark-bg">
                        List of all projects in your organization to develop and
                        managed by software development team of AI Agents
                    </p>
                </div>

                {/* TODO: list all projects in organization */}
                {organizationProjects.length > 0 ? (
                    <div className="flex flex-col gap-4 pt-0 w-full items-center rounded-xl bg-secondary-dark">
                        {organizationProjects.map((project: Project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id}
                                name={project.name}
                                description={project.description}
                                purpose={project.purpose}
                                target_audience={project.target_audience}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-base p-4 text-subtext-in-dark-bg">
                        You have no projects yet. Create one!
                    </p>
                )}
            </div>

            <Button
                className="flex items-center p-4 self-center w-fit bg-genesoft font-medium hover:bg-genesoft/80"
                onClick={handleCreateProject}
            >
                <span className="text-xs md:text-base">Create Project</span>
            </Button>

            <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
        </div>
    );
};

export default OrganizationProjects;
