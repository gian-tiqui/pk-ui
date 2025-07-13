import axios from "axios";
import { Floor, Query, Room } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const createFloor = async (name: string, code: string, level: number) => {
  const parseLevel = Number(level);

  return apiClient.post(`${URI.API_URI}/api/v1/floor`, {
    name,
    code,
    level: parseLevel,
  });
};

const getFloors = async (
  query: Query
): Promise<{ floors: Floor[]; count: number } | undefined> => {
  try {
    const response = await axios.get(
      `${URI.API_URI}/api/v1/floor?search=${query.search}&limit=${
        query.limit || 10
      }`
    );

    if (response.status === 200) {
      const floors: Floor[] = response.data.floors;
      const count: number = response.data.count;

      return { floors, count };
    }
  } catch (error) {
    console.error(error);

    return { floors: [], count: -1 };
  }
};

const getFloorById = async (floorId: number) => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/floor/${floorId}`
    );

    const floor: Floor = response.data.floor;

    return floor;
  } catch (error) {
    console.error(error);

    return undefined;
  }
};

const getFloorRoomsById = async (
  floorId: number,
  query?: Query
): Promise<{ rooms: Room[]; count: number }> => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/floor/${floorId}/room`,
      { params: query }
    );

    const rooms: Room[] = response.data.rooms ?? [];
    const count: number = response.data.count;

    return { rooms, count };
  } catch (error) {
    console.error(error);
    return { rooms: [] as Room[], count: 0 };
  }
};

const updateFloorById = async (
  floorId: number,
  name?: string,
  code?: string,
  level?: number
) => {
  return apiClient.patch(`${URI.API_URI}/api/v1/floor/${floorId}`, {
    level,
    code,
    name,
  });
};

const softDeleteFloorById = async (floorId: number) => {
  return apiClient.delete(`${URI.API_URI}/api/v1/floor/${floorId}`);
};

export {
  getFloors,
  createFloor,
  getFloorById,
  getFloorRoomsById,
  updateFloorById,
  softDeleteFloorById,
};
