import { create } from "zustand";
import { Room } from "../../types/types";

interface State {
  selectedRoom: Room | undefined;
  setSelectedRoom: (room: Room | undefined) => void;
}

const useSelectedRoom = create<State>((set) => ({
  selectedRoom: undefined,
  setSelectedRoom: (selectedRoom: Room | undefined) => set({ selectedRoom }),
}));

export default useSelectedRoom;
