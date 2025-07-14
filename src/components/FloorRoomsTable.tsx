import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getFloorRoomsById } from "../@utils/services/floorService";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";
import { FloorParam, Query, Room } from "../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import RoomSettingsDialog from "./RoomSettingsDialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { retrieveRoomById } from "../@utils/services/roomService";
import handleErrors from "../@utils/functions/handleErrors";
import { OverlayPanel } from "primereact/overlaypanel";
import CustomToast from "./CustomToast";
import DeleteRoomDialog from "./DeleteRoomDialog";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  Settings,
  Undo,
  Trash2,
} from "lucide-react";

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
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);

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

  useEffect(() => {
    const totalRooms = data?.count ?? 0;
    const currentOffset = query.offset ?? 0;
    const limit = query.limit ?? 5;

    setIsPrevDisabled(currentOffset === 0);
    setIsNextDisabled(currentOffset + limit >= totalRooms);
  }, [query.offset, data?.count, query.limit]);

  const handleNextPageClicked = () => {
    if (isNextDisabled) return;
    setQuery((prev) => ({
      ...prev,
      offset: (prev.offset ?? 0) + (prev.limit ?? 5),
    }));
  };

  const handlePrevPageClicked = () => {
    if (isPrevDisabled) return;
    setQuery((prev) => ({
      ...prev,
      offset: Math.max((prev.offset ?? 0) - (prev.limit ?? 5), 0),
    }));
  };

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
      message: (
        <p>
          Do you want to <span className="text-blue-600">retrieve</span> this
          room?
        </p>
      ),
      header: "Retrieve Room",
      icon: "pi pi-question-circle",
      defaultFocus: "reject",
      accept,
    });
  };

  const acceptRemoveRoom = () => {
    setVisible(true);
  };

  const handleRemoveFloorButtonClicked = () => {
    confirmDialog({
      message: (
        <p>
          Do you want to{" "}
          <span className="text-red-600">permanently delete</span> this room?
        </p>
      ),
      header: "Delete Room",
      icon: "pi pi-question-circle",
      defaultFocus: "reject",
      accept: acceptRemoveRoom,
    });
  };

  return (
    <div className="h-full">
      <CustomToast ref={toastRef} />
      <RoomSettingsDialog
        roomId={selectedRoomId}
        visible={roomSettingVisible}
        setVisible={setRoomSettingVisisble}
      />
      <DeleteRoomDialog
        visible={visible}
        setVisible={setVisible}
        selectedRoomId={selectedRoomId}
      />

      {/* Header with Stats and Controls */}
      <div className="flex items-center justify-between p-4 mb-4 border shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 border shadow-lg bg-white/60 backdrop-blur-sm rounded-xl border-slate-200/60">
            <span className="text-sm text-slate-600">Total Rooms: </span>
            <span className="font-bold text-slate-800">{data?.count || 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="flex items-center justify-center w-10 h-10 transition-all duration-300 border-none shadow-lg text-slate-700 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 disabled:opacity-50"
            tooltip="Previous Page"
            tooltipOptions={{ position: "bottom" }}
            onClick={handlePrevPageClicked}
            disabled={isPrevDisabled}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            className="flex items-center justify-center w-10 h-10 transition-all duration-300 border-none shadow-lg text-slate-700 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80 disabled:opacity-50"
            tooltip="Next Page"
            tooltipOptions={{ position: "bottom" }}
            onClick={handleNextPageClicked}
            disabled={isNextDisabled}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <IconField iconPosition="left" className="ml-2">
            <InputIcon>
              <Search className="w-4 h-4 text-slate-500" />
            </InputIcon>
            <InputText
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              placeholder="Search rooms..."
              className="h-10 pl-10 border shadow-lg text-slate-700 placeholder-slate-400 bg-white/60 backdrop-blur-sm border-slate-200/60 rounded-xl focus:border-blue-400"
            />
          </IconField>

          <Button
            className="flex items-center justify-center w-10 h-10 transition-all duration-300 border-none shadow-lg text-slate-700 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80"
            tooltip="Clear Filters"
            tooltipOptions={{ position: "bottom" }}
            onClick={() => {
              setQuery(defaultQuery);
              setSearchInput("");
              dataTableRef.current?.reset();
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="border shadow-lg bg-white/40 backdrop-blur-sm rounded-2xl border-slate-200/60">
        <DataTable
          ref={dataTableRef}
          value={data?.rooms}
          size="small"
          className="text-slate-800"
          pt={{
            wrapper: { className: "rounded-2xl overflow-hidden" },
            header: {
              className: "bg-white/60 backdrop-blur-sm border-slate-200/60",
            },
            bodyRow: {
              className:
                "bg-white/30 hover:bg-white/50 transition-all duration-200 border-slate-200/40",
            },
            headerRow: {
              className: "bg-white/60 backdrop-blur-sm border-slate-200/60",
            },
          }}
        >
          <Column
            pt={{
              headerCell: {
                className:
                  "bg-white/60 backdrop-blur-sm h-14 text-slate-800 font-semibold border-slate-200/60",
              },
              sortIcon: { className: "text-slate-700" },
              bodyCell: { className: "text-slate-800 border-slate-200/40" },
            }}
            sortable
            field="name"
            header="Name"
          />
          <Column
            pt={{
              headerCell: {
                className:
                  "bg-white/60 backdrop-blur-sm h-14 text-slate-800 font-semibold border-slate-200/60",
              },
              sortIcon: { className: "text-slate-700" },
              bodyCell: { className: "text-slate-800 border-slate-200/40" },
            }}
            sortable
            field="code"
            header="Code"
          />
          <Column
            pt={{
              headerCell: {
                className:
                  "bg-white/60 backdrop-blur-sm h-14 text-slate-800 font-semibold border-slate-200/60",
              },
              sortIcon: { className: "text-slate-700" },
              bodyCell: { className: "text-slate-800 border-slate-200/40" },
            }}
            sortable
            field="status"
            header="Status"
          />
          <Column
            pt={{
              headerCell: {
                className:
                  "bg-white/60 backdrop-blur-sm h-14 text-slate-800 font-semibold border-slate-200/60",
              },
              sortIcon: { className: "text-slate-700" },
              bodyCell: { className: "text-slate-800 border-slate-200/40" },
            }}
            sortable
            field="createdAt"
            header="Created At"
          />
          <Column
            pt={{
              headerCell: {
                className:
                  "bg-white/60 backdrop-blur-sm h-14 text-slate-800 font-semibold border-slate-200/60",
              },
              sortIcon: { className: "text-slate-700" },
              bodyCell: { className: "text-slate-800 border-slate-200/40" },
            }}
            sortable
            field="updatedAt"
            header="Updated At"
          />
          <Column
            pt={{
              headerCell: {
                className:
                  "bg-white/60 backdrop-blur-sm h-14 text-slate-800 font-semibold border-slate-200/60",
              },
              bodyCell: { className: "text-slate-800 border-slate-200/40" },
            }}
            header="Action"
            body={(rowData) => (
              <>
                {isDeleted ? (
                  <>
                    <OverlayPanel
                      ref={overlayPanelRef}
                      className="border shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/60 rounded-xl"
                      pt={{
                        content: { className: "flex gap-3 flex-col p-4" },
                      }}
                    >
                      <Button
                        className="flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700"
                        onClick={handleRetrieveFloorButtonClicked}
                      >
                        <Undo className="w-4 h-4" />
                        Restore
                      </Button>
                      <Button
                        className="flex items-center gap-2 px-4 py-2 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-red-500 to-rose-600 rounded-xl hover:from-red-600 hover:to-rose-700"
                        onClick={handleRemoveFloorButtonClicked}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </OverlayPanel>
                    <Button
                      className="flex items-center justify-center w-10 h-10 transition-all duration-300 border-none shadow-lg text-slate-700 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-white/80"
                      onClick={(e) => {
                        setSelectedRoomId(rowData.id);
                        overlayPanelRef.current?.toggle(e);
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700"
                    tooltip="Open settings"
                    tooltipOptions={{ position: "bottom" }}
                    onClick={() => {
                      setSelectedRoomId(rowData.id);
                      setRoomSettingVisisble(true);
                    }}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default FloorRoomsTable;
