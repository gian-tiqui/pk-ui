import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useQuery } from "@tanstack/react-query";
import { getFloorById } from "../@utils/services/floorService";
import { useParams } from "react-router-dom";
import { FloorParam } from "../types/types";
import CustomToast from "./CustomToast";
import AddRoomDialog from "./AddRoomDialog";
import DeleteFloorDialog from "./DeleteFloorDialog";
import { Plus, Trash2, MapPin } from "lucide-react";

const FloorPageHeader = () => {
  const toastRef = useRef<Toast>(null);
  const param = useParams() as FloorParam;
  const [addRoomDialogVisible, setAddRoomDialogVisible] = useState(false);
  const [deleteFloorDialogVisible, setDeleteFloorDialogVisible] =
    useState(false);

  const { data: floor } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  return (
    <header className="flex items-center justify-between p-6 mb-6 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-slate-200/60">
      <CustomToast ref={toastRef} />
      <AddRoomDialog
        visible={addRoomDialogVisible}
        setVisible={setAddRoomDialogVisible}
      />
      <DeleteFloorDialog
        visible={deleteFloorDialogVisible}
        setVisible={setDeleteFloorDialogVisible}
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
          {floor?.code}
        </div>
        <div className="text-slate-800">
          <h1 className="text-2xl font-bold">{floor?.name}</h1>
          <p className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            Floor Level: {floor?.level}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl hover:from-emerald-600 hover:to-teal-700 hover:scale-105"
          tooltip="Add a room"
          tooltipOptions={{ position: "left" }}
          onClick={() => {
            if (floor?.imageLocation) setAddRoomDialogVisible(true);
            else
              toastRef.current?.show({
                severity: "error",
                summary: "No floor map yet.",
                detail: "Please add a floor map first.",
              });
          }}
        >
          <Plus className="w-5 h-5" />
        </Button>

        <Button
          className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl hover:from-red-600 hover:to-rose-700 hover:scale-105"
          tooltip="Delete this floor"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => setDeleteFloorDialogVisible(true)}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default FloorPageHeader;
