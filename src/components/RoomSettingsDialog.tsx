import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { getRoomById } from "../@utils/services/roomService";
import { PrimeIcons } from "primereact/api";
import RoomSettingsTabView from "./RoomSettingsTabView";

interface Props {
  roomId: number;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const RoomSettingsDialog: React.FC<Props> = ({
  visible,
  setVisible,
  roomId,
}) => {
  const { data: room } = useQuery({
    queryKey: [`room-${roomId}`],
    queryFn: () => getRoomById(roomId),
    enabled: roomId !== -1,
  });

  return (
    <Dialog
      visible={visible}
      className="w-[90%] h-[90%]"
      onHide={() => setVisible(false)}
      header={
        <div className="flex items-center gap-1">
          <i className={`${PrimeIcons.BUILDING} text-xl me-1`}></i>
          <p>{room?.name}</p>
        </div>
      }
      pt={{
        header: {
          className:
            "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-slate-700",
        },
      }}
    >
      <div className="w-full h-full">
        <RoomSettingsTabView />
      </div>
    </Dialog>
  );
};

export default RoomSettingsDialog;
