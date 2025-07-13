import React from "react";
import { UserData } from "../types/types";
import { Building2, User } from "lucide-react";

interface Props {
  user: UserData | undefined;
}

const AmenityManagementPageHeader: React.FC<Props> = ({ user }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
          <Building2 className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-800">
          Amenity Management
        </h1>
        <div className="inline-flex items-center px-6 py-3 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-gray-600">Welcome back, </span>
          <span className="ml-1 font-semibold text-blue-600">
            {user?.firstName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AmenityManagementPageHeader;
