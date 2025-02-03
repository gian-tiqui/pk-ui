import { useParams } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import {
  getFloorById,
  getFloorRoomsById,
} from "../@utils/services/floorService";
import { useEffect, useState } from "react";
import { Query } from "../types/types";
import FloorPageHeader from "../components/FloorPageHeader";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";
import { TabPanel, TabView } from "primereact/tabview";

type Param = {
  floorId: string;
};

const FloorPage = () => {
  const param = useParams() as Param;
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

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    refetch,
  } = useQuery({
    queryKey: [`floor-${param.floorId}-rooms-${JSON.stringify(query)}`],
    queryFn: () => getFloorRoomsById(+param.floorId, query),
  });

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  useEffect(() => {
    if (floorRoomsSignal === true) {
      refetch();
    }

    return () => setFloorRoomsSignal(false);
  }, [refetch, setFloorRoomsSignal, floorRoomsSignal]);

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

        <TabView
          pt={{
            panelContainer: { className: "h-80 w-full bg-inherit" },
            nav: { className: "w-full bg-inherit" },
            tab: { className: "w-full bg-inherit" },
          }}
        >
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <TabPanel
                header={`Header ${index + 1}`}
                key={index}
                pt={{ headerAction: { className: "bg-inherit" } }}
              >
                <p className="m-0 text-slate-100">
                  {index + 1}. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                  sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
              </TabPanel>
            ))}
        </TabView>
      </div>
    </PageTemplate>
  );
};

export default FloorPage;
