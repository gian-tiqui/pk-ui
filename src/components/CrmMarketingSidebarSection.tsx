import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import React, { Dispatch, RefObject, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import FloorItem from "./FloorItem";
import { Floor } from "../types/types";

interface Props {
  navigate: NavigateFunction;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  scrollPanelRef: RefObject<ScrollPanel>;
  data: { floors: Floor[]; count: number } | undefined;
  isLoading: boolean;
  isError: boolean;
  selectedId: number | undefined;
  setSelectedId: Dispatch<SetStateAction<number | undefined>>;
}

const CrmMarketingSidebarSection: React.FC<Props> = ({
  navigate,
  setSearchTerm,
  setVisible,
  scrollPanelRef,
  data,
  isLoading,
  isError,
  selectedId,
  setSelectedId,
}) => {
  return (
    <section className="flex-1 overflow-hidden">
      <div className="py-2 mx-5">
        <Button
          onClick={() => navigate("/amenity-management")}
          className="w-full h-10 px-3"
          icon={`${PrimeIcons.HOME} mr-3 text-lg`}
        >
          Home
        </Button>
      </div>
      <IconField iconPosition="left" className="mx-5 mt-2 mb-5">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 border-slate-700 bg-slate-800 text-slate-100"
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
        ref={scrollPanelRef}
        className={`pb-36 ms-5 ${
          data?.floors && data?.floors?.length > 6 ? "me-1" : "me-5"
        }`}
        style={{ height: "calc(100vh - 250px)" }}
      >
        {isLoading && <small className="text-slate-100">Loading floors</small>}
        {isError && (
          <small className="text-slate-100">
            There was a problem in loading the floors
          </small>
        )}
        {data?.floors && data?.floors.length === 0 ? (
          <small className="text-slate-100">No floors yet</small>
        ) : (
          data?.floors?.map((floor) => (
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

export default CrmMarketingSidebarSection;
