import { useQuery } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFloorRoomsById } from "../@utils/services/floorService";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";
import { FloorParam, Query } from "../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

const FloorRoomsTable = () => {
  const param = useParams() as FloorParam;
  const [query, setQuery] = useState<Query>({
    search: "",
    sortBy: "name",
    sortOrder: "asc",
  });
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
      {/* <InputText onChange={(e) => setSearchInput(e.target.value)} /> */}
      <DataTable
        value={rooms}
        pt={{
          bodyRow: { className: "bg-slate-900" },
          headerRow: { className: "bg-slate-900" },
        }}
      >
        <Column field="name" header="Name" />
        <Column field="code" header="Code" />
        <Column field="detail" header="Detail" />
        <Column field="createdAt" header="Created At" />
        <Column field="updatedAt" header="Updated At" />
        <Column
          header="Action"
          body={() => (
            <Button className="w-10 h-10" icon={PrimeIcons.COG}></Button>
          )}
        />
      </DataTable>
    </section>
  );
};

export default FloorRoomsTable;
