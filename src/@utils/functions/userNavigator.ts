import { NavigateFunction } from "react-router-dom";
import { User, UserData } from "../../types/types";
import { Department } from "../enums/enum";

const navigateUserByDeptId = (
  user: User | UserData | undefined,
  navigate: NavigateFunction
) => {
  if (user) {
    switch (user.deptId) {
      case Department.IT: {
        navigate("/user-management");
        break;
      }
      case Department.MRKT: {
        navigate("/amenity-management");
        break;
      }
      case Department.SSD: {
        navigate("/amenity-management");
        break;
      }
      default: {
        break;
      }
    }
  }
};

export default navigateUserByDeptId;
