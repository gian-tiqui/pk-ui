import { create } from "zustand";

interface State {
  refreshMain: boolean;
  setRefreshMain: (refreshMain: boolean) => void;
}

const useAmenityMainSignalStore = create<State>((set) => ({
  refreshMain: false,
  setRefreshMain: (refreshMain: boolean) => set({ refreshMain }),
}));

export default useAmenityMainSignalStore;
