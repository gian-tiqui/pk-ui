import React from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../@utils/services/roomService";
import { InputTextarea } from "primereact/inputtextarea";

interface Props {
  roomId: number;
}

const RoomDetailsTab: React.FC<Props> = ({ roomId }) => {
  const { data: room, isLoading } = useQuery({
    queryKey: [`room-${roomId}`],
    queryFn: () => getRoomById(roomId),
  });

  if (isLoading)
    return <RoomTabTemplate>Loading room details...</RoomTabTemplate>;

  return (
    <RoomTabTemplate>
      <div className="w-full p-1">
        <InputTextarea className="w-full h-72 bg-slate-800 border-slate-600 text-slate-100" />
      </div>
    </RoomTabTemplate>
  );
};

export default RoomDetailsTab;
