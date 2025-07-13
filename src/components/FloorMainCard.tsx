import React from "react";
import { Floor } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Calendar, Users } from "lucide-react";

interface Props {
  floor: Floor | undefined;
}

const FloorMainCard: React.FC<Props> = ({ floor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/amenity-management/${floor?.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      onClick={handleClick}
      className="p-6 transition-all duration-300 transform border shadow-lg cursor-pointer group bg-white/70 backdrop-blur-sm border-white/20 rounded-3xl hover:shadow-xl hover:scale-105 hover:bg-white/80"
    >
      {/* Floor Code Avatar */}
      <div className="flex items-center justify-center w-16 h-16 mb-4 transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:shadow-blue-500/50">
        <span className="text-lg font-bold text-white">{floor?.code}</span>
      </div>

      {/* Floor Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
          {floor?.name}
        </h3>

        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-blue-500" />
          <span>
            {floor?.rooms.length} Room
            {floor?.rooms && floor?.rooms.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{formatDate(String(floor?.createdAt))}</span>
        </div>
      </div>

      {/* Hover Effect Indicator */}
      <div className="mt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <div className="w-full h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      </div>
    </div>
  );
};

export default FloorMainCard;
