import { useEffect, useState } from "react";
import { FloorParam } from "../types/types";
import { Button } from "primereact/button";
import AddRoomDialog from "./AddRoomDialog";
import { useQuery } from "@tanstack/react-query";
import { getFloorById } from "../@utils/services/floorService";
import { useParams } from "react-router-dom";
import useFloorPageHeaderStore from "../@utils/store/floorPageHeader";
import DeleteFloorDialog from "./DeleteFloorDialog";

const FloorPageHeader = () => {
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
    <header className="flex items-center w-full h-20 mb-8 ">
      <AddRoomDialog
        visible={addRoomDialogVisible}
        setVisible={setAddRoomDialogVisible}
      />
      <DeleteFloorDialog
        visible={deleteFloorDialogVisible}
        setVisible={setDeleteFloorDialogVisible}
      />
      <div className="flex items-center flex-1 w-full h-20 gap-4">
        <div className="grid w-20 h-20 text-4xl font-bold bg-blue-500 rounded-lg place-content-center">
          {floor?.code}
        </div>
        <div>
          <h4 className="text-4xl font-medium">{floor?.name}</h4>
          <p className="font-medium">Floor Level: {floor?.level}</p>
        </div>
      </div>
      <div className="flex justify-center flex-1"></div>
      <div className="flex justify-end flex-1 gap-2">
        <Button
          icon="pi pi-plus text-xl"
          tooltip="Add floor"
          tooltipOptions={{ position: "left" }}
          onClick={() => setAddRoomDialogVisible(true)}
        ></Button>
        <Button
          icon="pi pi-trash text-xl"
          severity="danger"
          tooltip="Delete floor"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => setDeleteFloorDialogVisible(true)}
        ></Button>
      </div>
    </header>
  );
};

export default FloorPageHeader;
