import { useQuery } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFloorRoomsById } from "../@utils/services/floorService";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";
import { FloorParam, Query } from "../types/types";

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
    console.log(rooms);
  }, [rooms]);

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
      <InputText onChange={(e) => setSearchInput(e.target.value)} />
    </section>
  );
};

export default FloorRoomsTable;
