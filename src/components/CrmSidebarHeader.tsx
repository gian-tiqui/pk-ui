import CrmAsideButtonToggler from "./CrmAsideButtonToggler";
import useUserDataStore from "../@utils/store/userDataStore";
import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

const CrmSidebarHeader = () => {
  const { user } = useUserDataStore();
  const [avatarLabel, setAvatarLabel] = useState<string>("");

  useEffect(() => {
    if (!user) {
      console.error("Info could not be extracted");
      return;
    }
    setAvatarLabel(
      user?.firstName.charAt(0).toUpperCase() +
        user?.lastName.charAt(0).toLowerCase()
    );
  }, [user]);

  return (
    <header className="flex items-center justify-between cursor-default">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <span className="text-lg font-bold text-white">{avatarLabel}</span>
          </div>
          <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm -bottom-1 -right-1"></div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {user?.firstName} {user?.lastName}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Building2 className="w-3 h-3" />
            <span>{user?.deptName}</span>
          </div>
        </div>
      </div>
      <CrmAsideButtonToggler />
    </header>
  );
};

export default CrmSidebarHeader;
