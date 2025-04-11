import { Query } from "../../types/types";
import { URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const getAllItems = async (params: Query) => {
  return apiClient.get(`${URI.API_URI}/api/v1/item`, { params });
};

export default getAllItems;
