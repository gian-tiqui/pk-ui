import React from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";

interface Props {
  roomId: number;
}

const RoomImagesTab: React.FC<Props> = ({ roomId }) => {
  return <RoomTabTemplate>{roomId}</RoomTabTemplate>;
};

export default RoomImagesTab;
