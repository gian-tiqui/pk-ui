import React, { Dispatch, SetStateAction } from "react";
import { Floor } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { PrimeIcons } from "primereact/api";

const FloorItem: React.FC<
  Floor & {
    setSelectedId: Dispatch<SetStateAction<number | undefined>>;
    selectedId: number | undefined;
  }
> = ({ code, name, id, selectedId, setSelectedId, imageLocation }) => {
  const navigate = useNavigate();

  const isSelected = id === selectedId;

  return (
    <Button
      onClick={() => {
        setSelectedId(id);
        navigate(`/amenity-management/${id}`);
      }}
      className={`w-full p-4 mb-3 border-none shadow-lg transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
          : "bg-white/70 backdrop-blur-sm hover:bg-white/80 text-gray-800"
      } rounded-2xl border-white/20`}
      severity="contrast"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {/* Avatar with modern styling */}
          <div className="relative">
            <Avatar
              label={code}
              className={`font-bold w-10 h-10 text-sm transition-all duration-300 ${
                isSelected
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              } rounded-xl`}
            />
            {/* Status indicator */}
            <div
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                imageLocation
                  ? "bg-emerald-500 border-emerald-300"
                  : "bg-red-500 border-red-300"
              } ${isSelected ? "border-white" : "border-white"}`}
            />
          </div>

          {/* Floor Info */}
          <div className="flex flex-col items-start">
            <p
              className={`text-sm font-bold transition-all duration-300 ${
                isSelected ? "text-white" : "text-gray-800"
              }`}
            >
              {name}
            </p>
            <p
              className={`text-xs transition-all duration-300 ${
                isSelected ? "text-blue-100" : "text-gray-500"
              }`}
            >
              Floor {code}
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex items-center gap-2">
          {imageLocation ? (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${
                isSelected
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              <i className={`${PrimeIcons.CHECK_CIRCLE} text-xs`}></i>
              <span className="text-xs font-medium">Active</span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 ${
                isSelected
                  ? "bg-white/20 text-white"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <i className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-xs`}></i>
              <span className="text-xs font-medium">Setup</span>
            </div>
          )}

          {/* Arrow indicator */}
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
              isSelected
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <i className={`${PrimeIcons.CHEVRON_RIGHT} text-xs`}></i>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default FloorItem;
