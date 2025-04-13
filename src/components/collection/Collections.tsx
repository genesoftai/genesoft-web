import React, { useEffect, useState } from "react";
import { getOrganizationCollections } from "@/actions/organization";
import { Collection } from "@/types/collection";
import { CollectionCard } from "@/components/collection/CollectionCard";
import CreateCollectionDialog from "./CreateCollectionDialog";
import { Boxes } from "lucide-react";

type Props = {
    organizationId: string;
};

const Collections = ({ organizationId }: Props) => {
    const [organizationCollections, setOrganizationCollections] = useState<
        Collection[]
    >([]);

    const handleCreateCollection = () => {
        setUpOrganizationCollections();
    };

    const setUpOrganizationCollections = async () => {
        const collections = await getOrganizationCollections(organizationId);

        setOrganizationCollections(collections);
    };

    useEffect(() => {
        if (organizationId) {
            setUpOrganizationCollections();
        }
    }, [organizationId]);

    return (
        <div className="flex flex-col gap-4 p-4 md:p-8 w-full rounded-xl bg-secondary-dark">
            <div>
                <div className="flex flex-col gap-y-2 mb-8">
                    <div className="flex items-center gap-2">
                        <Boxes className="w-8 h-8" />
                        <p className="text-xl md:text-2xl text-subtext-in-dark-bg font-bold">
                            Organization Collections
                        </p>
                    </div>

                    <p className="text-sm md:text-base text-subtext-in-dark-bg">
                        List of all collections of web integrated with backend
                        service in your organization so AI Agents can
                        collaborate between web and backend service
                    </p>
                </div>

                {/* TODO: list all projects in organization */}
                {organizationCollections.length > 0 ? (
                    <div className="flex flex-col gap-4 pt-0 w-full items-center rounded-xl bg-secondary-dark">
                        {organizationCollections.map(
                            (collection: Collection) => (
                                <CollectionCard
                                    key={collection.id}
                                    collectionProps={collection}
                                />
                            ),
                        )}
                    </div>
                ) : (
                    <p className="text-base p-4 text-subtext-in-dark-bg">
                        You have no collections yet. Create one!
                    </p>
                )}
            </div>

            <CreateCollectionDialog
                organizationId={organizationId}
                onCreateCollection={handleCreateCollection}
            />

            <div className="min-h-[100vh] flex-1 rounded-xl bg-secondary-dark md:min-h-min" />
        </div>
    );
};

export default Collections;
