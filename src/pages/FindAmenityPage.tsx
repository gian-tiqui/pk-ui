import { useEffect, useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import { Floor, Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../@utils/services/floorService";
import filterCompleteCloor from "../@utils/functions/filterCompleteFloors";
import FloorNav from "../components/FloorNav";
import AmenityFloorRoomContent from "../components/AmenityFloorRoomContent";

const FindAmenityPage = () => {
  const [query] = useState<Query>({ search: "" });
  const [completeFloors, setCompleteFloors] = useState<Floor[]>();

  const { data } = useQuery({
    queryKey: [`floors-${JSON.stringify(query)}`],
    queryFn: () => getFloors(query),
  });

  useEffect(() => {
    if (data) setCompleteFloors(filterCompleteCloor(data?.floors));
  }, [data]);

  return (
    <PageTemplate>
      <div className="w-screen h-full">
        <AmenityFloorRoomContent />
        <FloorNav floors={completeFloors} />
      </div>
    </PageTemplate>
  );
};

export default FindAmenityPage;
