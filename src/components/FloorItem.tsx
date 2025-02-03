import React, { Dispatch, SetStateAction } from "react";
import { Floor } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const FloorItem: React.FC<
  Floor & {
    setSelectedId: Dispatch<SetStateAction<number | undefined>>;
    selectedId: number | undefined;
  }
> = ({ code, name, id, selectedId, setSelectedId }) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        setSelectedId(id);
        navigate(`/amenity-management/${id}`);
      }}
      className={`flex w-full h-12 gap-2 mb-2 text-sm border-none  ${
        id === selectedId ? "bg-gray-700" : "bg-inherit hover:bg-gray-800"
      }`}
      severity="contrast"
    >
      <Avatar label={code} className="font-bold bg-blue-500 w-7 h-7" />
      <p className="text-sm font-medium">{name}</p>
    </Button>
  );
};

export default FloorItem;
