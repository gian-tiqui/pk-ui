import { create } from "zustand";

interface State {
  floorRoomsSignal: boolean;
  setFloorRoomsSignal: (floorRoomsSignal: boolean) => void;
}

const useFloorRoomsSignalStore = create<State>((set) => ({
  floorRoomsSignal: false,
  setFloorRoomsSignal: (floorRoomsSignal: boolean) => set({ floorRoomsSignal }),
}));

export default useFloorRoomsSignalStore;
