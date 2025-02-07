import { useState } from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import RoomCanvasDialog from "./RoomCanvasDialog";
import { Button } from "primereact/button";

interface Props {
  roomId: number;
}

const RoomCanvasTab: React.FC<Props> = ({ roomId }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <RoomTabTemplate>
      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        View Directions
      </Button>
      <RoomCanvasDialog
        roomId={roomId}
        visible={visible}
        setVisible={setVisible}
      />
    </RoomTabTemplate>
  );
};

export default RoomCanvasTab;
