import React from "react";
import { Room } from "../types/types";
import { Avatar } from "primereact/avatar";

interface Props {
  room: Room;
}

const AmenityRoomCard: React.FC<Props> = ({ room }) => {
  return (
    <div className="flex flex-col justify-between p-4 rounded-l shadow hover:cursor-pointer hover:shadow-blue-400 bg-slate-900 border-slate-600 h-52 w-52">
      <Avatar label={room.code} className="font-medium bg-blue-500" />
      <div className="flex justify-between w-full">
        <p className="font-medium">{room.name}</p>
      </div>
    </div>
  );
};

export default AmenityRoomCard;
