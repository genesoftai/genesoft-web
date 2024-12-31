import { Branding, Feature, Page } from "@/types/project";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CreateProjectStore {
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
    branding?: Branding;
    pages?: Page[];
    features?: Feature[];
    updateCreateProjectStore: (project: Partial<CreateProjectStore>) => void;
    clearCreateProjectStore: () => void;
    addPage: (page: Page) => void;
    addFeature: (feature: Feature) => void;
}

const initialProjectStoreStates = {
    name: "",
    description: "",
    purpose: "",
    target_audience: "",
    branding: {
        logo_url: "",
        color: "",
        theme: "",
        perception: "",
    },
    pages: [],
    features: [],
};

export const useCreateProjectStore = create<CreateProjectStore>()(
    persist(
        (set) => ({
            ...initialProjectStoreStates,
            updateCreateProjectStore: (project) =>
                set((state) => ({ ...state, ...project })),
            clearCreateProjectStore: () =>
                set(() => ({ ...initialProjectStoreStates })),
            addPage: (page) =>
                set((state) => ({
                    ...state,
                    pages: [...(state.pages || []), page],
                })),
            addFeature: (feature) =>
                set((state) => ({
                    ...state,
                    features: [...(state.features || []), feature],
                })),
        }),
        {
            name: "create-project-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
