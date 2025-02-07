import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getFloorRoomsById } from "../@utils/services/floorService";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";
import { FloorParam, Query, Room } from "../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import RoomSettingsDialog from "./RoomSettingsDialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import {
  removeRoomById,
  retrieveRoomById,
} from "../@utils/services/roomService";
import handleErrors from "../@utils/functions/handleErrors";
import { OverlayPanel } from "primereact/overlaypanel";
import CustomToast from "./CustomToast";

interface Props {
  isDeleted?: boolean;
}

const FloorRoomsTable: React.FC<Props> = ({ isDeleted = false }) => {
  const toastRef = useRef<Toast>(null);
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const defaultQuery: Query = {
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    isDeleted,
    offset: 0,
    limit: 5,
  };
  const [roomSettingVisible, setRoomSettingVisisble] = useState<boolean>(false);
  const dataTableRef = useRef<DataTable<Room[]>>(null);
  const param = useParams() as FloorParam;
  const [query, setQuery] = useState<Query>(defaultQuery);
  const [searchInput, setSearchInput] = useState<string>("");
  const { floorRoomsSignal, setFloorRoomsSignal } = useFloorRoomsSignalStore();
  const [selectedRoomId, setSelectedRoomId] = useState<number>(-1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchInput }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, refetch: refetchFloorRooms } = useQuery({
    queryKey: [`floor-${param.floorId}-rooms-${JSON.stringify(query)}`],
    queryFn: () => getFloorRoomsById(+param.floorId, query),
  });

  useEffect(() => {
    refetchFloorRooms();
  }, [query, refetchFloorRooms]);

  useEffect(() => {
    if (floorRoomsSignal === true) {
      refetchFloorRooms();
    }

    return () => setFloorRoomsSignal(false);
  }, [refetchFloorRooms, setFloorRoomsSignal, floorRoomsSignal]);

  const handleNextPageClicked = () => {};

  const handlePrevPageClicked = () => {};

  const accept = () => {
    retrieveRoomById(selectedRoomId)
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Room retrieved successfully",
          });
          setFloorRoomsSignal(true);
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const handleRetrieveFloorButtonClicked = () => {
    confirmDialog({
      message: "Do you want to retrieve this room?",
      header: "Retrieve Room",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const acceptRemoveRoom = () => {
    removeRoomById(selectedRoomId)
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Room deleted successfully",
          });
          setFloorRoomsSignal(true);
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const handleRemoveFloorButtonClicked = () => {
    confirmDialog({
      message: (
        <p>
          Do you want to{" "}
          <span className="text-red-500">permanently delete</span> this room?
        </p>
      ),
      header: "Delete Room",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept: acceptRemoveRoom,
    });
  };

  return (
    <section>
      <CustomToast ref={toastRef} />
      <RoomSettingsDialog
        roomId={selectedRoomId}
        visible={roomSettingVisible}
        setVisible={setRoomSettingVisisble}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full">
          <p className="text-lg font-medium text-slate-100">
            Total number of rooms: {data?.count}
          </p>
        </div>
        <div className="flex justify-end w-full gap-2 mb-4">
          <Button
            className="w-10 h-10"
            icon={`${PrimeIcons.BACKWARD}`}
            tooltip="Previous Page"
            tooltipOptions={{ position: "bottom" }}
            onClick={handlePrevPageClicked}
          ></Button>
          <Button
            className="w-10 h-10"
            icon={`${PrimeIcons.FORWARD}`}
            tooltip="Next Page"
            tooltipOptions={{ position: "bottom" }}
            onClick={handleNextPageClicked}
          ></Button>
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              placeholder="Search"
              className="h-10 border bg-inherit border-slate-600 text-slate-100"
            />
          </IconField>
          {!isDeleted && (
            <Button
              className="w-10 h-10"
              severity="warning"
              icon={`${PrimeIcons.EXCLAMATION_TRIANGLE}`}
              tooltip="Rooms with incomplete data"
              tooltipOptions={{ position: "bottom" }}
              onClick={() => {
                setQuery((prev) => ({ ...prev, isIncomplete: true }));
              }}
            ></Button>
          )}
          <Button
            className="w-10 h-10"
            tooltip="Clear Filters"
            icon={`${PrimeIcons.UNDO}`}
            tooltipOptions={{ position: "bottom" }}
            onClick={() => {
              setQuery(defaultQuery);
              setSearchInput("");
              dataTableRef.current?.reset();
            }}
          ></Button>
        </div>
      </div>

      <DataTable
        ref={dataTableRef}
        value={data?.rooms}
        size="small"
        // scrollable
        // scrollHeight="320px"
        pt={{
          bodyRow: { className: "bg-slate-900" },
          headerRow: { className: "bg-slate-900" },
        }}
      >
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          sortable
          field="name"
          className="text-slate-100"
          header="Name"
        />
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          sortable
          field="code"
          className="text-slate-100"
          header="Code"
        />
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          sortable
          field="detail"
          className="text-slate-100"
          header="Detail"
        />
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          sortable
          field="createdAt"
          className="text-slate-100"
          header="Created At"
        />
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
            sortIcon: { className: "text-slate-100" },
          }}
          sortable
          field="updatedAt"
          className="text-slate-100"
          header="Updated At"
        />
        <Column
          pt={{
            headerCell: { className: "bg-slate-950 h-14 text-slate-100" },
          }}
          header="Action"
          body={(rowData) => (
            <>
              {isDeleted ? (
                <>
                  <OverlayPanel
                    ref={overlayPanelRef}
                    className=" bg-slate-800"
                    pt={{ content: { className: "flex gap-3 flex-col p-3" } }}
                  >
                    <Button
                      className="h-10 "
                      icon={`${PrimeIcons.UNDO} me-2`}
                      onClick={() => {
                        handleRetrieveFloorButtonClicked();
                      }}
                    >
                      Restore
                    </Button>
                    <Button
                      className="h-10 "
                      severity="danger"
                      icon={`${PrimeIcons.TRASH} me-2`}
                      onClick={() => {
                        handleRemoveFloorButtonClicked();
                      }}
                    >
                      Delete
                    </Button>
                  </OverlayPanel>
                  <Button
                    className="w-10 h-10"
                    icon={PrimeIcons.COG}
                    onClick={(e) => {
                      setSelectedRoomId(rowData.id);
                      overlayPanelRef.current?.toggle(e);
                    }}
                  ></Button>
                </>
              ) : (
                <Button
                  className="w-10 h-10"
                  icon={PrimeIcons.COG}
                  onClick={() => {
                    setSelectedRoomId(rowData.id);

                    setRoomSettingVisisble(true);
                  }}
                ></Button>
              )}
            </>
          )}
        />
      </DataTable>
    </section>
  );
};

export default FloorRoomsTable;
