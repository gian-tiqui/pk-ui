import { useParams } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import {
  getFloorById,
  getFloorRoomsById,
} from "../@utils/services/floorService";
import { useEffect, useState } from "react";
import { FloorParam, Query } from "../types/types";
import FloorPageHeader from "../components/FloorPageHeader";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";
import FloorPageContent from "../components/FloorPageContent";

const FloorPage = () => {
  const param = useParams() as FloorParam;
  const [query, setQuery] = useState<Query>({ search: "" });
  const [searchInput, setSearchInput] = useState<string>("");
  const { floorRoomsSignal, setFloorRoomsSignal } = useFloorRoomsSignalStore();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchInput }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data: floor, isLoading: isLoadingFloor } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

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

  if (isLoadingFloor)
    return (
      <PageTemplate>
        <div className="grid h-full p-4">Loading floor data...</div>
      </PageTemplate>
    );

  return (
    <PageTemplate>
      <div className="h-full px-10 pt-16">
        <FloorPageHeader floor={floor} setSearchInput={setSearchInput} />
        <FloorPageContent />
      </div>
    </PageTemplate>
  );
};

export default FloorPage;
