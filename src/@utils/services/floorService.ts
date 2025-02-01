import { Floor, Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getFloors = async (query: Query) => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/floor?search=${query.search}&limit=${
        query.limit || 10
      }`
    );

    if (response.status === 200) {
      const floors: Floor[] = response.data.floors;

      return floors;
    }
  } catch (error) {
    console.error(error);

    return [];
  }
};

const createFloor = async (name: string, code: string, level: number) => {
  const parseLevel = Number(level);

  return apiClient.post(`${URI.API_URI}/api/v1/floor`, {
    name,
    code,
    level: parseLevel,
  });
};

export { getFloors, createFloor };
