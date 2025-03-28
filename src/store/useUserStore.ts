import { create } from "zustand";

interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
}

interface UserState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useUserStore;
