"use client";
import { getCollectionById } from "@/actions/collection";
import PageLoading from "@/components/common/PageLoading";
import BackendGenerations from "@/components/project/backend/BackendGenerations";
import WebGenerations from "@/components/project/web/WebGenerations";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { SquareArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NextjsLogo from "@public/tech/nextjs.jpeg";
import NestjsLogo from "@public/tech/nestjs.svg";
import Image from "next/image";
import GenesoftBlack from "@public/assets/genesoft-logo-black.png";
import { HashLoader } from "react-spinners";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebPreview } from "@/components/project/manage/WebPreview";
import { BackendPreview } from "@/components/project/manage/BackendPreview";

type TabValue = "generations" | "preview";

const CollectionCreationPage = () => {
    const { collectionId } = useParams();
    const [webProject, setWebProject] = useState<Project | null>(null);
    const [backendProject, setBackendProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTabWeb, setActiveTabWeb] = useState<TabValue>("generations");
    const [activeTabBackend, setActiveTabBackend] =
        useState<TabValue>("generations");
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
        <div className="flex flex-col min-h-screen bg-primary-dark text-subtext-in-dark-bg w-full">
            <div className="flex flex-row items-center justify-center px-4">
                <Image
                    src={GenesoftBlack}
                    alt="Genesoft Logo"
                    width={40}
                    height={40}
                    className="rounded-md hidden md:block cursor-pointer"
                    onClick={() => {
                        router.push("/");
                    }}
                />
                <p className="text-lg font-bold text-center text-subtext-in-dark-bg flex flex-row items-center gap-2">
                    <span>Genesoft AI Agents is building your collection</span>
                    <span>
                        {/* <GridLoader color="#2563EB" size={2} margin={0} /> */}
                        <HashLoader color="#2563EB" size={20} />
                    </span>
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-evenly w-full">
                <div className="flex flex-col w-full">
                    <div className="flex flex-row items-center justify-center gap-2">
                        <Image
                            src={NextjsLogo}
                            alt="Nextjs Logo"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <p className="text-lg font-bold text-center">Web</p>
                    </div>

                    <Tabs
                        defaultValue="generations"
                        value={activeTabWeb}
                        onValueChange={(value) =>
                            setActiveTabWeb(value as TabValue)
                        }
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-secondary-dark">
                            <TabsTrigger value="generations">
                                Generations
                            </TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="generations">
                            <WebGenerations project={webProject} />
                        </TabsContent>
                        <TabsContent value="preview">
                            <WebPreview project={webProject} />
                        </TabsContent>
                    </Tabs>

                    <Button
                        onClick={() =>
                            handleGoToWorkspace(webProject?.id as string)
                        }
                        className="w-fit self-center bg-genesoft text-white font-bold hover:bg-genesoft/90 mt-4"
                    >
                        <span>AI Agent workspace for web</span>
                        <SquareArrowRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex flex-row items-center justify-center gap-2">
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

                    <Tabs
                        defaultValue="generations"
                        value={activeTabBackend}
                        onValueChange={(value) =>
                            setActiveTabBackend(value as TabValue)
                        }
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-secondary-dark">
                            <TabsTrigger value="generations">
                                Generations
                            </TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="generations">
                            <BackendGenerations project={backendProject} />
                        </TabsContent>
                        <TabsContent value="preview">
                            <BackendPreview project={backendProject} />
                        </TabsContent>
                    </Tabs>

                    <Button
                        onClick={() =>
                            handleGoToWorkspace(backendProject?.id as string)
                        }
                        className="w-fit self-center bg-genesoft text-white font-bold hover:bg-genesoft/90 mt-4"
                    >
                        <span>AI Agent workspace for backend</span>
                        <SquareArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CollectionCreationPage;
