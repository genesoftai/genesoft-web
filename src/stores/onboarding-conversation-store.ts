import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OnboardingConversationStore {
    id: string;
    updateOnboardingConversationStore: (
        onboardingConversation: Partial<OnboardingConversationStore>,
    ) => void;
    clearOnboardingConversationStore: () => void;
}

const initialOnboardingConversationStoreStates = {
    id: "",
};

export const useOnboardingConversationStore =
    create<OnboardingConversationStore>()(
        persist(
            (set) => ({
                ...initialOnboardingConversationStoreStates,
                updateOnboardingConversationStore: (onboardingConversation) =>
                    set((state) => ({ ...state, ...onboardingConversation })),
                clearOnboardingConversationStore: () =>
                    set(() => ({
                        ...initialOnboardingConversationStoreStates,
                    })),
            }),
            {
                name: "onboarding-conversation-storage",
                storage: createJSONStorage(() => localStorage),
            },
        ),
    );
