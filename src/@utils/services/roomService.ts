import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const createRoom = async (name: string, code: string, floorId: number) => {
  return apiClient.post(`${URI.API_URI}/api/v1/room`, {
    name,
    code,
    floorId,
  });
};

export { createRoom };
