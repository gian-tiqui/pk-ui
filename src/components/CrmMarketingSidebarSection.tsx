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
    <section className="flex-1 p-6 overflow-auto h-96 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Home Button */}
      <div className="mb-6">
        <Button
          onClick={() => navigate("/amenity-management")}
          className="w-full py-3 text-gray-800 transition-all duration-300 transform border-none shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl hover:bg-white/80 hover:scale-105 border-white/20"
          icon={`${PrimeIcons.HOME} mr-3 text-lg text-blue-600`}
        >
          <span className="font-semibold">Home</span>
        </Button>
      </div>

      {/* Search Field */}
      <div className="mb-6">
        <IconField iconPosition="left">
          <InputIcon className="text-gray-400 pi pi-search"></InputIcon>
          <InputText
            placeholder="Search floors..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 px-4 text-gray-700 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20 focus:border-blue-400 focus:bg-white/80 hover:bg-white/80"
          />
        </IconField>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between p-4 mb-4 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20">
        <h3 className="text-lg font-bold text-gray-800">Floors</h3>
        <div
          onClick={() => setVisible(true)}
          className="flex items-center gap-2 px-3 py-2 text-white transition-all duration-300 transform shadow-lg cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
        >
          <i className={`${PrimeIcons.PLUS} text-sm`}></i>
          <span className="text-sm font-medium">Add Floor</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20">
        <ScrollPanel
          ref={scrollPanelRef}
          className="pb-4"
          style={{ height: "calc(100vh - 350px)" }}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 px-4 py-3 text-blue-600 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20">
                <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                <span className="text-sm font-medium">Loading floors...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="p-4 text-red-600 border shadow-lg bg-red-50/70 backdrop-blur-sm rounded-2xl border-red-200/20">
              <div className="flex items-center gap-2">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-lg`}></i>
                <span className="text-sm font-medium">
                  Problem loading floors. Please try again.
                </span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {data?.floors && data?.floors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500">
                <i className={`${PrimeIcons.BUILDING} text-2xl text-white`}></i>
              </div>
              <p className="font-medium text-gray-600">No floors yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Add your first floor to get started
              </p>
            </div>
          )}

          {/* Floor Items */}
          {data?.floors && data?.floors.length > 0 && (
            <div className="space-y-3">
              {data.floors.map((floor) => (
                <FloorItem
                  key={floor.id}
                  {...floor}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                />
              ))}
            </div>
          )}
        </ScrollPanel>
      </div>
    </section>
  );
};

export default CrmMarketingSidebarSection;
