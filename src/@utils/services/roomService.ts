import { Room } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const createRoom = async (name: string, code: string, floorId: number) => {
  return apiClient.post(`${URI.API_URI}/api/v1/room`, {
    name,
    code,
    floorId,
  });
};

const getRoomById = async (roomId: number): Promise<Room | undefined> => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/room/${roomId}`
    );

    const floor: Room = response.data.room;

    return floor;
  } catch (error) {
    console.error(error);

    return undefined;
  }
};

export { createRoom, getRoomById };
