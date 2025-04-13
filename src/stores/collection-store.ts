import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CollectionStore {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    web_project_id: string;
    backend_service_project_ids: string[];
    organization_id: string;
    created_at: string;
    updated_at: string;
    updateCollectionStore: (collection: Partial<CollectionStore>) => void;
    clearCollectionStore: () => void;
}

const initialCollectionStoreStates = {
    id: "",
    name: "",
    description: "",
    is_active: false,
    web_project_id: "",
    backend_service_project_ids: [],
    organization_id: "",
    created_at: "",
    updated_at: "",
};

export const useCollectionStore = create<CollectionStore>()(
    persist(
        (set) => ({
            ...initialCollectionStoreStates,
            updateCollectionStore: (collection) =>
                set((state) => ({ ...state, ...collection })),
            clearCollectionStore: () =>
                set(() => ({ ...initialCollectionStoreStates })),
        }),
        {
            name: "collection-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
