import Cookies from "js-cookie";
import { Namespace, URI } from "../enums/enum";
import apiClient from "../http-common/apiClient";

const refresh = async () => {
  const refreshToken = Cookies.get(Namespace.BASE);
  return apiClient.post(`${URI.API_URI}/api/v1/auth/refresh`, {
    refreshToken,
  });
};

export { refresh };
