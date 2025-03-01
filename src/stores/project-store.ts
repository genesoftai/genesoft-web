import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ProjectStore {
    id: string;
    name: string;
    description: string;
    purpose: string;
    target_audience: string;
    created_at: string;
    updated_at: string;
    branding?: {
        id: string;
        projectId: string;
        logo_url: string;
        color: string;
        theme: string;
        perception: string;
        created_at: string;
        updated_at: string;
    };
    pages?: {
        id: string;
        project_id: string;
        name: string;
        description: string;
        file_ids: string[];
        reference_link_ids: string[];
        created_at: string;
        updated_at: string;
    }[];
    features?: {
        id: string;
        project_id: string;
        name: string;
        description: string;
        file_ids: string[];
        reference_link_ids: string[];
        created_at: string;
        updated_at: string;
    }[];
    updateProjectStore: (project: Partial<ProjectStore>) => void;
    clearProjectStore: () => void;
}

const initialProjectStoreStates = {
    id: "",
    name: "",
    description: "",
    purpose: "",
    target_audience: "",
    created_at: "",
    updated_at: "",
    branding: {
        id: "",
        projectId: "",
        logo_url: "",
        color: "",
        theme: "",
        perception: "",
        created_at: "",
        updated_at: "",
    },
    pages: [],
    features: [],
};

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set) => ({
            ...initialProjectStoreStates,
            updateProjectStore: (project) =>
                set((state) => ({ ...state, ...project })),
            clearProjectStore: () =>
                set(() => ({ ...initialProjectStoreStates })),
        }),
        {
            name: "project-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
