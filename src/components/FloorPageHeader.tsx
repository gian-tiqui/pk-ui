import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Floor, FloorParam } from "../types/types";
import { Button } from "primereact/button";
import AddRoomDialog from "./AddRoomDialog";
import { useQuery } from "@tanstack/react-query";
import { getFloorById } from "../@utils/services/floorService";
import { useParams } from "react-router-dom";
import useFloorPageHeaderStore from "../@utils/store/floorPageHeader";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";

interface Props {
  floor?: Floor;
  setSearchInput: Dispatch<SetStateAction<string>>;
}

const FloorPageHeader: React.FC<Props> = () => {
  const [value, setValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    setItems([...Array(10).keys()].map((item) => event.query + "-" + item));
  };

  const [visible, setVisible] = useState<boolean>(false);
  const param = useParams() as FloorParam;
  const { refreshFloorHeader, setRefreshFloorHeader } =
    useFloorPageHeaderStore();

  const { data: floor, refetch: refetchFloorData } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  useEffect(() => {
    refetchFloorData();

    return () => setRefreshFloorHeader(false);
  }, [refreshFloorHeader, setRefreshFloorHeader, refetchFloorData]);

  return (
    <header className="flex items-center w-full h-20 mb-8 ">
      <AddRoomDialog visible={visible} setVisible={setVisible} />
      <div className="flex items-center flex-1 w-full h-20 gap-4">
        <div className="grid w-20 h-20 text-4xl font-bold bg-blue-500 rounded-lg place-content-center">
          {floor?.code}
        </div>
        <div>
          <h4 className="text-4xl font-medium">{floor?.name}</h4>
          <p className="font-medium">Floor Level: {floor?.level}</p>
        </div>
      </div>
      <div className="flex justify-center flex-1">
        <AutoComplete
          placeholder="Search a room here"
          loadingIcon="pi pi-spinner pi-spin"
          value={value}
          suggestions={items}
          completeMethod={search}
          onChange={(e) => setValue(e.value)}
          pt={{
            input: {
              root: {
                className: "bg-inherit border border-slate-600 text-slate-100",
              },
            },
            panel: { className: "bg-slate-800" },
            item: { className: "text-slate-100 px-4 py-2" },
          }}
        />
      </div>
      <div className="flex justify-end flex-1">
        <Button
          icon="pi pi-plus text-xl"
          onClick={() => setVisible(true)}
        ></Button>
      </div>
    </header>
  );
};

export default FloorPageHeader;
