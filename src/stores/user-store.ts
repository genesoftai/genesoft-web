import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserStore {
  id: string; //required
  aud: string; //required
  role?: string;
  email: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata: {
    provider: string;
    providers: string[];
  }; //required
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  }; //required
  identities?: {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }[];
  created_at: string; //required
  updated_at?: string;
  is_anonymous?: boolean;
  updateUser: (user: Partial<UserStore>) => void;
  clearUserStore: () => void;
}

const initialUserStoreStates = {
  id: '',
  aud: '',
  role: '',
  email: '',
  email_confirmed_at: '',
  phone: '',
  confirmed_at: '',
  last_sign_in_at: '',
  app_metadata: {
    provider: '',
    providers: [],
  },
  user_metadata: {
    email: '',
    email_verified: false,
    phone_verified: false,
    sub: '',
  },
  identities: [],
  created_at: '',
  updated_at: '',
  is_anonymous: false,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialUserStoreStates,
      updateUser: (user) => set((state) => ({ ...state, ...user })),
      clearUserStore: () => set(() => ({ ...initialUserStoreStates })),
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
