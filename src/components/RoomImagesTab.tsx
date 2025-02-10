import React from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import { FileUpload } from "primereact/fileupload";

interface Props {
  roomId: number;
}

const RoomImagesTab: React.FC<Props> = ({ roomId }) => {
  return (
    <RoomTabTemplate>
      <FileUpload mode="basic" />
    </RoomTabTemplate>
  );
};

export default RoomImagesTab;
