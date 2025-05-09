import React from "react";
import { Room } from "../types/types";
import useSelectedRoom from "../@utils/store/selectedRoom";

interface Props {
  room: Room;
}

const AmenityRoomCard: React.FC<Props> = ({ room }) => {
  const { setSelectedRoom } = useSelectedRoom();

  return (
    <div
      onClick={() => setSelectedRoom(room)}
      className="flex flex-col justify-between p-4 rounded-l shadow hover:cursor-pointer hover:shadow-blue-400 bg-slate-900 border-slate-600 "
    >
      <div className="flex justify-between w-full">
        <p className="font-medium">{room.name}</p>
      </div>
    </div>
  );
};

export default AmenityRoomCard;
