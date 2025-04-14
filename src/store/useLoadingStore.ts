import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
}));

export default useLoadingStore;
