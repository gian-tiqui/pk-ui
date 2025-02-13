import React from "react";
import { Floor } from "../types/types";
import { Avatar } from "primereact/avatar";
import useSelectedFloorStore from "../@utils/store/selectedFloor";

interface Props {
  floor: Floor;
}

const FloorNavItem: React.FC<Props> = ({ floor }) => {
  const { selectedFloor, setSelectedFloor } = useSelectedFloorStore();

  return (
    <div
      onClick={() => setSelectedFloor(floor)}
      className="flex flex-col items-center hover:cursor-pointer "
    >
      <Avatar
        label={floor.code}
        className={`font-medium text-sm w-7 h-7 bg-inherit `}
        shape="circle"
      />
      <small
        className={`font-medium text-slate-100 ${
          selectedFloor?.id === floor.id && "underline"
        }`}
      >
        {floor.name}
      </small>
    </div>
  );
};

export default FloorNavItem;
