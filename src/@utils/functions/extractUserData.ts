import { jwtDecode } from "jwt-decode";
import { Namespace } from "../enums/enum";
import { UserData } from "../../types/types";

const extractUserData = (): UserData | undefined => {
  const accessToken = localStorage.getItem(Namespace.BASE);

  if (!accessToken) {
    console.log(accessToken);
    console.error("Access token is missing.");
    return;
  }

  const userData: UserData = jwtDecode(accessToken);

  return userData;
};

export default extractUserData;
