import React from "react";
import { UserData } from "../types/types";

interface Props {
  user: UserData | undefined;
}

const AmenityManagementPageHeader: React.FC<Props> = ({ user }) => {
  return (
    <header className="mt-4 mb-14">
      <h4 className="text-3xl text-center">
        Welcome back, <span className="text-blue-400">{user?.firstName}</span>
      </h4>
    </header>
  );
};

export default AmenityManagementPageHeader;
