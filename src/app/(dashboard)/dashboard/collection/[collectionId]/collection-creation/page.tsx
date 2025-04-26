"use client";
import { getCollectionById } from "@/actions/collection";
import PageLoading from "@/components/common/PageLoading";
import BackendGenerations from "@/components/project/backend/BackendGenerations";
import WebGenerations from "@/components/project/web/WebGenerations";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { CheckCheckIcon, SquareArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NextjsLogo from "@public/tech/nextjs.jpeg";
import NestjsLogo from "@public/tech/nestjs.svg";
import Image from "next/image";
import GenesoftBlack from "@public/assets/genesoft-logo-black.png";
import { HashLoader } from "react-spinners";
import { getLatestIteration } from "@/actions/development";
import { LatestIteration } from "@/types/development";

type TabValue = "generations" | "preview";

const CollectionCreationPage = () => {
    const { collectionId } = useParams();
    const [webProject, setWebProject] = useState<Project | null>(null);
    const [backendProject, setBackendProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTabWeb, setActiveTabWeb] = useState<TabValue>("generations");
    const [activeTabBackend, setActiveTabBackend] =
        useState<TabValue>("generations");
    const [latestWebIteration, setLatestWebIteration] =
        useState<LatestIteration | null>(null);
    const [latestBackendIteration, setLatestBackendIteration] =
        useState<LatestIteration | null>(null);
    const [isReadyShowPreviewWeb, setIsReadyShowPreviewWeb] =
        useState<boolean>(false);
    const [isReadyShowPreviewBackend, setIsReadyShowPreviewBackend] =
        useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (collectionId) {
            setupCollection();
        }
    }, [collectionId]);

    const setupCollection = async () => {
        setIsLoading(true);
        try {
            const collection = await getCollectionById(collectionId as string);
            setWebProject(collection.web_project);
            setBackendProject(collection.backend_service_projects[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToWorkspace = (projectId: string) => {
        if (projectId) {
            router.push(`/dashboard/project/${projectId}/ai-agent`);
        }
    };

    const fetchLatestWebIteration = async (project: Project) => {
        if (!project?.id) return;
        console.log("fetchLatestIteration for project", project.id);
        try {
            const data = await getLatestIteration(project.id);
            if (data.status !== "done") {
                setIsReadyShowPreviewWeb(false);
            }
            console.log("fetchLatestWebIteration", data);
            setLatestWebIteration(data);
        } catch (error) {
            console.error("Error fetching latest iteration:", error);
        }
    };

    const fetchLatestBackendIteration = async (project: Project | null) => {
        if (!project?.id) return;
        console.log("fetchLatestIteration for project", project.id);
        try {
            const data = await getLatestIteration(project.id);
            if (data.status !== "done") {
                setIsReadyShowPreviewBackend(false);
            }
            console.log("fetchLatestBackendIteration", data);
            setLatestBackendIteration(data);
        } catch (error) {
            console.error("Error fetching latest iteration:", error);
        }
    };

    // Poll for latest iteration every minute
    useEffect(() => {
        if (!webProject?.id) return;

        fetchLatestWebIteration(webProject);
        fetchLatestBackendIteration(backendProject);

        // Set up polling every 1 minute
        const iterationPollingInterval = setInterval(() => {
            fetchLatestWebIteration(webProject);
            fetchLatestBackendIteration(backendProject);
        }, 60000);

        // Clean up interval on component unmount
        return () => clearInterval(iterationPollingInterval);
    }, [webProject?.id, backendProject?.id]);

    console.log({
        message: "collection creation page",
        collectionId,
        webProject,
        backendProject,
    });

    if (isLoading) {
        return <PageLoading text="Loading collection creation..." />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-genesoft-dark text-subtext-in-dark-bg w-full py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="flex flex-row items-center justify-center px-4">
                        <Image
                            src={GenesoftBlack}
                            alt="Genesoft Logo"
                            width={40}
                            height={40}
                            className="rounded-md me-2 hidden md:block cursor-pointer"
                            onClick={() => {
                                router.push("/");
                            }}
                        />

                        {latestBackendIteration?.status === "done" &&
                        latestWebIteration?.status === "done" ? (
                            <p className="text-lg font-bold text-center text-subtext-in-dark-bg flex flex-row items-center gap-2">
                                <span className="text-base">
                                    Genesoft AI Agents completed your
                                    collection, Please go to AI Agent workspace
                                </span>
                                <span>
                                    <CheckCheckIcon size={20} />
                                </span>
                            </p>
                        ) : (
                            <p className="text-lg font-bold text-center text-subtext-in-dark-bg flex flex-row items-center gap-2">
                                <span>
                                    Genesoft AI Agents is building your
                                    collection
                                </span>
                                <span>
                                    {/* <GridLoader color="#2563EB" size={2} margin={0} /> */}
                                    <HashLoader color="#2563EB" size={20} />
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col md:flex-row gap-10 md:gap-4 justify-evenly w-full mt-8 md:mt-4">
                        <div className="flex flex-col w-full relative">
                            <div className="flex flex-row items-center justify-center gap-2 mb-4">
                                <Image
                                    src={NextjsLogo}
                                    alt="Nextjs Logo"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                <p className="text-lg font-bold text-center">
                                    Web
                                </p>
                            </div>

                            <div className="">
                                <WebGenerations
                                    project={webProject}
                                    latestIteration={latestWebIteration}
                                />

                                <div className="flex justify-center">
                                    <Button
                                        onClick={() =>
                                            handleGoToWorkspace(
                                                webProject?.id as string,
                                            )
                                        }
                                        className="absolute bottom-0 md:bottom-20 w-fit bg-genesoft text-white font-bold hover:bg-genesoft/90 mt-4"
                                    >
                                        <span>AI Agent workspace for web</span>
                                        <SquareArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex flex-col w-full">
                            <div className="flex flex-row items-center justify-center gap-2 mb-4">
                                <Image
                                    src={NestjsLogo}
                                    alt="Nestjs Logo"
                                    width={30}
                                    height={30}
                                />
                                <p className="text-lg font-bold text-center">
                                    Backend Service
                                </p>
                            </div>

                            <div style={{ minWidth: "300px" }}>
                                <BackendGenerations
                                    project={backendProject}
                                    latestIteration={latestBackendIteration}
                                />
                                <div className="flex justify-center">
                                    <Button
                                        onClick={() =>
                                            handleGoToWorkspace(
                                                backendProject?.id as string,
                                            )
                                        }
                                        className="absolute bottom-0 md:bottom-20 w-fit bg-genesoft text-white font-bold hover:bg-genesoft/90 mt-4"
                                    >
                                        <span>
                                            AI Agent workspace for backend
                                        </span>
                                        <SquareArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-primary-dark border-t border-line-in-dark-bg">
                        <p className="text-sm text-subtext-in-dark-bg">
                            Your collection is being set up. You can explore
                            your web and backend projects above.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionCreationPage;
