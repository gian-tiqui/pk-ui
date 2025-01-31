import { PrimeIcons } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import FloorItem from "./FloorItem";
import { useQuery } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getFloors } from "../@utils/services/floorService";
import { Query } from "../types/types";
import useCrmSidebarSignalStore from "../@utils/store/crmSidebarSectionSignal";

interface Props {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const CrmSidebarSection: React.FC<Props> = ({ setVisible }) => {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [query, setQuery] = useState<Query>({});
  const { refresh, setRefresh } = useCrmSidebarSignalStore();

  const {
    data: floors,
    refetch,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [`floors-${query}`],
    queryFn: () => getFloors(query),
  });

  useEffect(() => {
    if (refresh === true) {
      console.log("refetched");
      refetch();
    }

    return () => setRefresh(false);
  }, [refresh, setRefresh, refetch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({ search: searchTerm });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  return (
    <section className="flex-1 overflow-hidden">
      <IconField iconPosition="left" className="mx-5 mt-2 mb-5">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 border-slate-700 bg-inherit text-slate-100"
        />
      </IconField>
      <div className="flex items-center justify-between h-10 mx-5">
        <small className="text-sm">Floors</small>
        <div
          onClick={() => setVisible(true)}
          className="flex items-center gap-2 hover:cursor-pointer hover:border-b"
        >
          <i className={`${PrimeIcons.PLUS} text-xs`}></i>
          <p className="text-sm">Add Floor</p>
        </div>
      </div>
      <ScrollPanel
        className={`pb-36 ms-5 ${
          floors && floors?.length > 6 ? "me-1" : "me-5"
        }`}
        style={{ height: "calc(100vh - 200px)" }}
      >
        {isLoading && <small className="text-slate-100">Loading floors</small>}
        {isError && (
          <small className="text-slate-100">
            There was a problem in loading the floors
          </small>
        )}
        {floors && floors.length === 0 ? (
          <small className="text-slate-100">No floors yet</small>
        ) : (
          floors?.map((floor) => (
            <FloorItem
              key={floor.id}
              {...floor}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))
        )}
      </ScrollPanel>
    </section>
  );
};

export default CrmSidebarSection;
