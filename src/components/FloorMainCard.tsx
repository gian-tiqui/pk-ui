import React from "react";
import { Floor } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";

interface Props {
  floor: Floor | undefined;
}

const FloorMainCard: React.FC<Props> = ({ floor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/amenity-management/${floor?.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col justify-between p-4 border border-slate-600 rounded-xl w-52 h-52 bg-slate-900 hover:shadow-blue-500 hover:shadow"
    >
      <Avatar
        label={floor?.code}
        shape="circle"
        className="text-xl font-extrabold bg-blue-500 w-14 h-14"
      />

      <div>
        <p className="text-lg font-medium">{floor?.name}</p>
        <div className="flex justify-between w-full">
          <small>
            {floor?.rooms.length} Room
            {floor?.rooms && floor?.rooms.length > 1 ? "s" : ""}
          </small>
          <small>{String(floor?.createdAt)}</small>
        </div>
      </div>
    </div>
  );
};

export default FloorMainCard;
