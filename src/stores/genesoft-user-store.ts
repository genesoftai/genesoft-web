import { GenesoftOrganization } from "@/types/organization";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface GenesoftUserStore {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    organization_id: string | null;
    organization: GenesoftOrganization | null;
    created_at: string;
    updated_at: string;
    project_id: string | null;
    updateGenesoftUser: (user: Partial<GenesoftUserStore>) => void;
    clearGenesoftUserStore: () => void;
}

const initialUserStoreStates = {
    id: "",
    email: "",
    name: null,
    image: null,
    organization_id: null,
    organization: null,
    created_at: "",
    updated_at: "",
    project_id: null,
};

export const useGenesoftUserStore = create<GenesoftUserStore>()(
    persist(
        (set) => ({
            ...initialUserStoreStates,
            updateGenesoftUser: (user) =>
                set((state) => ({ ...state, ...user })),
            clearGenesoftUserStore: () =>
                set(() => ({ ...initialUserStoreStates })),
        }),
        {
            name: "genesoft-user-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
