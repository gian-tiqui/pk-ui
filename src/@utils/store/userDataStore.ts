import { create } from "zustand";
import { UserData } from "../../types/types";
import extractUserData from "../functions/extractUserData";

interface State {
  user: UserData | undefined;
  setUser: (user: UserData) => void;
}

const useUserDataStore = create<State>((set) => ({
  user: extractUserData(),
  setUser: (user: UserData) => set({ user }),
}));

export default useUserDataStore;
