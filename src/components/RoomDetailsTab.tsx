import React from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../@utils/services/roomService";

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
      {roomId} {JSON.stringify(room?.directionPattern)}
    </RoomTabTemplate>
  );
};

export default RoomDetailsTab;
