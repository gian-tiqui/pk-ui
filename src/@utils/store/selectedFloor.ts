import { create } from "zustand";
import { Floor } from "../../types/types";

interface State {
  selectedFloor: Floor | undefined;
  setSelectedFloor: (selectedFloor: Floor) => void;
}

const useSelectedFloorStore = create<State>((set) => ({
  selectedFloor: undefined,
  setSelectedFloor: (selectedFloor: Floor) => set({ selectedFloor }),
}));

export default useSelectedFloorStore;
