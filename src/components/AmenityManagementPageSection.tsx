import React, { useEffect, useState } from "react";
import { Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../@utils/services/floorService";
import { PrimeIcons } from "primereact/api";
import useAmenityMainSignalStore from "../@utils/store/amenityMain";
import FloorMainCard from "./FloorMainCard";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

const AmenityManagementPageSection: React.FC = () => {
  const [query] = useState<Query>({ search: "" });
  const { refreshMain, setRefreshMain } = useAmenityMainSignalStore();

  const { data, refetch } = useQuery({
    queryKey: [`floors-${JSON.stringify(query)}`],
    queryFn: () => getFloors(query),
    enabled: query !== undefined,
  });

  useEffect(() => {
    if (refreshMain) refetch();

    return () => setRefreshMain(false);
  }, [refreshMain, refetch, setRefreshMain]);

  return (
    <section className="flex flex-col mb-6">
      <IconField iconPosition="left" className="mb-6">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          placeholder="Search"
          className="border bg-inherit border-slate-600 bg-slate-800 text-slate-100"
        />
      </IconField>

      <small className="flex items-center gap-1 mb-3 text-slate-300">
        <i className={`${PrimeIcons.CLOCK}`}></i>Recently added floors
      </small>

      <div className="flex flex-wrap gap-2 mb-5">
        {data?.floors.map((floor) => (
          <FloorMainCard floor={floor} key={floor.id} />
        ))}
      </div>

      <small className="flex items-center gap-1 mb-3 text-slate-300">
        <i className={`${PrimeIcons.EXCLAMATION_TRIANGLE}`}></i>Floors without
        rooms
      </small>

      <div className="flex flex-wrap gap-2 mb-5">
        {data?.floors
          .filter((floor) => floor.rooms.length === 0)
          .map((floor) => (
            <FloorMainCard floor={floor} key={floor.id} />
          ))}
      </div>
    </section>
  );
};

export default AmenityManagementPageSection;
