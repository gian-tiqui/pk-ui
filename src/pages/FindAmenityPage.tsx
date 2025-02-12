import { useEffect, useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import { Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../@utils/services/floorService";

const FindAmenityPage = () => {
  const [query] = useState<Query>({ search: "" });

  const { data } = useQuery({
    queryKey: [`floors-${JSON.stringify(query)}`],
    queryFn: () => getFloors(query),
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <PageTemplate></PageTemplate>;
};

export default FindAmenityPage;
