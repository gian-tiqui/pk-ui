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

interface Props {
  isDeleted?: boolean;
}

const FloorRoomsTable: React.FC<Props> = ({ isDeleted = false }) => {
  const defaultQuery: Query = {
    search: "",
    sortBy: "name",
    sortOrder: "asc",
    isDeleted,
  };
  const dataTableRef = useRef<DataTable<Room[]>>(null);
  const param = useParams() as FloorParam;
  const [query, setQuery] = useState<Query>(defaultQuery);
  const [searchInput, setSearchInput] = useState<string>("");
  const { floorRoomsSignal, setFloorRoomsSignal } = useFloorRoomsSignalStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchInput }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data: rooms, refetch: refetchFloorRooms } = useQuery({
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

  return (
    <section>
      <div className="flex justify-end w-full gap-2 mb-4">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder="Search"
            className="h-10 border bg-inherit border-slate-600 text-slate-100"
          />
        </IconField>
        <Button
          className="w-10 h-10"
          severity="warning"
          icon={`${PrimeIcons.EXCLAMATION_TRIANGLE}`}
          tooltip="Rooms with incomplete data"
          tooltipOptions={{ position: "bottom" }}
        ></Button>
        <Button
          className="w-10 h-10"
          tooltip="Clear Filters"
          icon={`${PrimeIcons.REFRESH}`}
          tooltipOptions={{ position: "bottom" }}
          onClick={() => {
            setQuery(defaultQuery);
            setSearchInput("");
            dataTableRef.current?.reset();
          }}
        ></Button>
      </div>
      <DataTable
        ref={dataTableRef}
        value={rooms}
        scrollable
        scrollHeight="320px"
        pt={{
          bodyRow: { className: "bg-slate-900" },
          headerRow: { className: "bg-slate-900" },
        }}
      >
        <Column
          sortable
          field="name"
          className="text-slate-100"
          header="Name"
        />
        <Column
          sortable
          field="code"
          className="text-slate-100"
          header="Code"
        />
        <Column
          sortable
          field="detail"
          className="text-slate-100"
          header="Detail"
        />
        <Column
          sortable
          field="createdAt"
          className="text-slate-100"
          header="Created At"
        />
        <Column
          sortable
          field="updatedAt"
          className="text-slate-100"
          header="Updated At"
        />
        <Column
          header="Action"
          body={() => (
            <>
              {isDeleted ? (
                <Button className="w-10 h-10" icon={PrimeIcons.COG}></Button>
              ) : (
                <Button className="w-10 h-10" icon={PrimeIcons.COG}></Button>
              )}
            </>
          )}
        />
      </DataTable>
    </section>
  );
};

export default FloorRoomsTable;
