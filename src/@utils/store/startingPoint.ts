import { create } from "zustand";
import { StartingPoint } from "../enums/enum";

interface State {
  startingPoint: number | undefined;
  setStartingPoint: (startingPoint: number) => void;
}

const useStartingPointStore = create<State>((set) => ({
  startingPoint: StartingPoint.FRONT_ELEVATOR,
  setStartingPoint: (startingPoint: number | undefined) =>
    set({ startingPoint }),
}));

export default useStartingPointStore;
