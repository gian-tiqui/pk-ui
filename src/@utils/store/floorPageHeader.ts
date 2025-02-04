import { create } from "zustand";

interface State {
  refreshFloorHeader: boolean;
  setRefreshFloorHeader: (refreshFloorHeader: boolean) => void;
}

const useFloorPageHeaderStore = create<State>((set) => ({
  refreshFloorHeader: false,
  setRefreshFloorHeader: (refreshFloorHeader: boolean) =>
    set({ refreshFloorHeader }),
}));

export default useFloorPageHeaderStore;
