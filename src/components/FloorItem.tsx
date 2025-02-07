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

  return (
    <Button
      onClick={() => {
        setSelectedId(id);
        navigate(`/amenity-management/${id}`);
      }}
      className={`flex w-full justify-between h-12 mb-2 text-sm border-none  ${
        id === selectedId ? "bg-gray-700" : "bg-inherit hover:bg-gray-800"
      }`}
      severity="contrast"
    >
      <div className="flex items-center gap-2">
        <Avatar label={code} className="font-bold bg-blue-500 w-7 h-7" />
        <p className="text-sm font-medium">{name}</p>
      </div>
      <div>
        {!imageLocation && (
          <i
            className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-red-600 text-lg`}
          ></i>
        )}
      </div>
    </Button>
  );
};

export default FloorItem;
