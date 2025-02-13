import { Dialog } from "primereact/dialog";
import useSelectedRoom from "../@utils/store/selectedRoom";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

const SelectedRoomDialog = () => {
  const { selectedRoom, setSelectedRoom } = useSelectedRoom();

  return (
    <Dialog
      visible={!!selectedRoom}
      className="w-[90%] h-[80vh]"
      header={selectedRoom?.name}
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
      onHide={() => {
        if (selectedRoom) setSelectedRoom(undefined);
      }}
    >
      <div className="w-full h-full">
        <InputTextarea
          value={selectedRoom?.detail}
          disabled
          className="w-full h-64 mb-4 bg-slate-800 text-slate-100 border-slate-600"
        />
        <div className="flex justify-end w-full h-16">
          <Button
            className="font-medium h-14"
            icon={`${PrimeIcons.MAP} me-2 text-xl`}
          >
            Get directions
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SelectedRoomDialog;
