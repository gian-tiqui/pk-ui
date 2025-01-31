import { create } from "zustand";

interface State {
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

const useCrmSidebarSignalStore = create<State>((set) => ({
  refresh: false,
  setRefresh: (refresh: boolean) => set({ refresh }),
}));

export default useCrmSidebarSignalStore;
