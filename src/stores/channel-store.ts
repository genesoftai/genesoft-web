import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ChannelStore {
    category: string;
    id: string;
    updateChannelStore: (channel: Partial<ChannelStore>) => void;
    clearChannelStore: () => void;
}

const initialChannelStoreStates = {
    category: "",
    id: "",
};

export const useChannelStore = create<ChannelStore>()(
    persist(
        (set) => ({
            ...initialChannelStoreStates,
            updateChannelStore: (channel) =>
                set((state) => ({ ...state, ...channel })),
            clearChannelStore: () =>
                set(() => ({ ...initialChannelStoreStates })),
        }),
        {
            name: "channel-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
