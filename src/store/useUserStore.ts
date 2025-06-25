import { create } from "zustand";
import { UserType } from "@/types/users";

interface UserState {
  user: UserType | null;
  isInitialized: boolean;
  setUser: (user: UserType) => void;
  clearUser: () => void;
  updateNickname: (nickname: string) => void;
  updateProfileImage: (url: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user, isInitialized: true }),
  clearUser: () => set({ user: null, isInitialized: true }),
  updateNickname: (nickname: string) =>
    set((state) => ({ user: state.user ? { ...state.user, nickname } : null })),
  updateProfileImage: (url: string) =>
    set((state) => ({
      user: state.user ? { ...state.user, profileImageUrl: url } : null,
    })),
}));

export default useUserStore;
