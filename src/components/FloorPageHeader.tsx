import { useEffect, useRef, useState } from "react";
import { FloorParam } from "../types/types";
import { Button } from "primereact/button";
import AddRoomDialog from "./AddRoomDialog";
import { useQuery } from "@tanstack/react-query";
import { getFloorById } from "../@utils/services/floorService";
import { useParams } from "react-router-dom";
import useFloorPageHeaderStore from "../@utils/store/floorPageHeader";
import DeleteFloorDialog from "./DeleteFloorDialog";
import CustomToast from "./CustomToast";
import { Toast } from "primereact/toast";

const FloorPageHeader = () => {
  const toastRef = useRef<Toast>(null);
  const [addRoomDialogVisible, setAddRoomDialogVisible] =
    useState<boolean>(false);
  const [deleteFloorDialogVisible, setDeleteFloorDialogVisible] =
    useState<boolean>(false);
  const param = useParams() as FloorParam;
  const { refreshFloorHeader, setRefreshFloorHeader } =
    useFloorPageHeaderStore();

  const { data: floor, refetch: refetchFloorData } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  useEffect(() => {
    refetchFloorData();

    return () => setRefreshFloorHeader(false);
  }, [refreshFloorHeader, setRefreshFloorHeader, refetchFloorData]);

  return (
    <header className="flex items-center w-full px-4 pt-8">
      <CustomToast ref={toastRef} />
      <AddRoomDialog
        visible={addRoomDialogVisible}
        setVisible={setAddRoomDialogVisible}
      />
      <DeleteFloorDialog
        visible={deleteFloorDialogVisible}
        setVisible={setDeleteFloorDialogVisible}
      />
      <div className="flex items-center flex-1 w-full h-20 gap-4">
        <div className="grid w-12 h-12 text-xl font-bold bg-blue-500 rounded-lg place-content-center">
          {floor?.code}
        </div>
        <div>
          <h4 className="text-xl font-medium">{floor?.name}</h4>
          <p className="font-medium">Floor Level: {floor?.level}</p>
        </div>
      </div>
      <div className="flex justify-center flex-1"></div>
      <div className="flex justify-end flex-1 gap-2">
        <Button
          icon="pi pi-plus text-lg"
          tooltip="Add a room"
          className="w-10 h-10"
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
        ></Button>
        <Button
          icon="pi pi-trash text-lg"
          severity="danger"
          className="w-10 h-10"
          tooltip="Delete this floor"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => setDeleteFloorDialogVisible(true)}
        ></Button>
      </div>
    </header>
  );
};

export default FloorPageHeader;
