import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Branding {
    logo_url?: string;
    color?: string;
    theme?: string;
    perception?: string;
}

interface Page {
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
}

interface Feature {
    name: string;
    description: string;
    file_ids?: string[];
    reference_link_ids?: string[];
}

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
        }),
        {
            name: "create-project-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
