import React, { useEffect, useState } from "react";
import { Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../@utils/services/floorService";
import useAmenityMainSignalStore from "../@utils/store/amenityMain";
import FloorMainCard from "./FloorMainCard";
import { Search, Clock, AlertTriangle, Building } from "lucide-react";

const AmenityManagementPageSection: React.FC = () => {
  const [query, setQuery] = useState<Query>({ search: "" });
  const { refreshMain, setRefreshMain } = useAmenityMainSignalStore();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, refetch } = useQuery({
    queryKey: [`floors-${JSON.stringify(query)}`],
    queryFn: () => getFloors(query),
  });

  useEffect(() => {
    if (refreshMain) refetch();

    return () => setRefreshMain(false);
  }, [refreshMain, refetch, setRefreshMain]);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Search Section */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search floors..."
            className="w-full py-4 pl-12 pr-4 text-gray-800 placeholder-gray-500 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Recently Added Floors Section */}
      <section className="mb-10">
        <div className="flex items-center mb-6">
          <div className="flex items-center px-4 py-2 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
            <Clock className="w-5 h-5 mr-2 text-white" />
            <h2 className="font-semibold text-white">Recently Added Floors</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.floors.map((floor) => (
            <FloorMainCard floor={floor} key={floor.id} />
          ))}
        </div>
      </section>

      {/* Floors Without Rooms Section */}
      <section className="mb-10">
        <div className="flex items-center mb-6">
          <div className="flex items-center px-4 py-2 shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl">
            <AlertTriangle className="w-5 h-5 mr-2 text-white" />
            <h2 className="font-semibold text-white">Floors Without Rooms</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.floors
            .filter((floor) => floor.rooms.length === 0)
            .map((floor) => (
              <FloorMainCard floor={floor} key={floor.id} />
            ))}
        </div>

        {data?.floors.filter((floor) => floor.rooms.length === 0).length ===
          0 && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-100 rounded-full">
              <Building className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600">All floors have rooms assigned!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AmenityManagementPageSection;
