import { useState } from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import RoomCanvasDialog from "./RoomCanvasDialog";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

interface Props {
  roomId: number;
}

const RoomCanvasTab: React.FC<Props> = ({ roomId }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <RoomTabTemplate>
      <RoomCanvasDialog
        roomId={roomId}
        visible={visible}
        setVisible={setVisible}
      />
      <div className="grid h-full place-content-center">
        <div className="flex flex-col w-52">
          <p className="mb-6 text-xl font-medium text-center text-slate-100">
            Edit the directions by pressing the button
          </p>
          <Button
            className="h-10 font-bold w-52"
            icon={`${PrimeIcons.USER_EDIT} me-2 text-xl`}
            onClick={() => {
              setVisible(true);
            }}
          >
            View Directions
          </Button>
        </div>
      </div>
    </RoomTabTemplate>
  );
};

export default RoomCanvasTab;
