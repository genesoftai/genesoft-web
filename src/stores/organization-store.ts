import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface GenesoftOrganizationStore {
    id: string;
    name: string | null;
    description: string | null;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    updateGenesoftOrganization: (
        organization: Partial<GenesoftOrganizationStore>,
    ) => void;
    clearGenesoftOrganizationStore: () => void;
}

const initialOrganizationStoreStates = {
    id: "",
    name: "",
    description: "",
    image: "",
    is_active: false,
    created_at: "",
    updated_at: "",
};

export const useGenesoftOrganizationStore = create<GenesoftOrganizationStore>()(
    persist(
        (set) => ({
            ...initialOrganizationStoreStates,
            updateGenesoftOrganization: (organization) =>
                set((state) => ({ ...state, ...organization })),
            clearGenesoftOrganizationStore: () =>
                set(() => ({ ...initialOrganizationStoreStates })),
        }),
        {
            name: "genesoft-organization-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
