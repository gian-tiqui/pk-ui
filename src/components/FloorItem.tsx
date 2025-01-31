import React, { Dispatch, SetStateAction } from "react";
import { Floor } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

const FloorItem: React.FC<
  Floor & {
    setSelectedId: Dispatch<SetStateAction<number | undefined>>;
    selectedId: number | undefined;
  }
> = ({ code, name, id, selectedId, setSelectedId }) => {
  return (
    <Button
      key={id}
      onClick={() => setSelectedId(id)}
      className={`flex w-full h-12 gap-2 mb-2 text-sm border-none bg-inherit  ${
        id === selectedId ? "bg-gray-700" : "hover:bg-gray-800"
      }`}
      severity="contrast"
    >
      <Avatar label={code} className="font-bold bg-blue-500 w-7 h-7" />
      <p className="text-sm font-medium">{name}</p>
    </Button>
  );
};

export default FloorItem;
