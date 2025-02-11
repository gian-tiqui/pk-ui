import { useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { Query, Room } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../@utils/services/floorService";

const FindAmenityPage = () => {
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [query] = useState<Query>({ search: "" });

  const { data } = useQuery({
    queryKey: [`floors-${JSON.stringify(query)}`],
    queryFn: () => getFloors(query),
  });

  return (
    <PageTemplate>
      <Dialog
        pt={{
          content: {
            className:
              "border-b border-l border-r pt-2 bg-slate-900 h-56 border-slate-700 text-slate-100",
          },
          header: {
            className:
              "bg-slate-900 text-slate-100 border-t border-l border-r border-slate-700",
          },
        }}
        visible={room ? true : false}
        onHide={() => {
          if (room) {
            setRoom(undefined);
          }
        }}
        header={room?.name}
      >
        <p>This room is located at this floor</p>
        <p>This room is located at this floor</p>
        <p>This room is located at this floor</p>
      </Dialog>
      <div className="flex flex-col items-center w-full h-full pt-20">
        <div className="w-[57%] h-10 ps-4 mb-14">
          <div className="flex items-center justify-between">
            <h4 className="mb-6 text-2xl font-medium text-slate-100">
              Find an amenity in our hospital.
            </h4>
            <div
              onClick={() => navigate(-1)}
              className="grid w-8 h-8 rounded-full hover:bg-slate-100 hover:text-slate-900 place-content-center"
            >
              <i className={`pi pi-arrow-circle-left text-2xl`}></i>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {data?.floors &&
              data.floors.map((floor, index) => (
                <div key={index}>
                  <p className="mb-4 text-2xl font-medium">{floor.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {floor.rooms &&
                      floor.rooms.map((room, index) => (
                        <div
                          onClick={() => setRoom(room)}
                          key={index}
                          className="p-4 border rounded hover:shadow hover:shadow-blue-400 w-44 h-44 bg-slate-900/40 border-slate-700"
                        >
                          <p className="text-xl">{room.name}</p>
                          <p className="text-xl">{room.detail}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default FindAmenityPage;
