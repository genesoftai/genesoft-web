import { Page, Feature } from "@/types/project";

export const getPages = (pages: Page[]) => {
    return pages.map((page) => {
        return {
            name: page.name,
            description: page.description,
            file_ids: page.files
                .map((file) => file.id)
                .filter(Boolean) as string[],
            reference_link_ids: page.references
                .map((ref) => ref.id)
                .filter(Boolean) as string[],
        };
    });
};

export const getFeatures = (features: Feature[]) => {
    return features.map((feature) => {
        return {
            name: feature.name,
            description: feature.description,
            file_ids: feature.files
                ?.map((file) => file.id)
                .filter(Boolean) as string[],
            reference_link_ids: feature.references
                ?.map((ref) => ref.id)
                .filter(Boolean) as string[],
        };
    });
};
