import { Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getDepartments = async (query?: Query) => {
  try {
    const response = await apiClient.get(
      `${URI.API_URI}/api/v1/department?search=${query?.search}&limit=${
        query?.limit || 50
      }`
    );

    if (response.status === 200) {
      const floors = response.data.departments;

      return floors;
    }
  } catch (error) {
    console.error(error);

    return [];
  }
};

export { getDepartments };
