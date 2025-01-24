import { useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import { Dialog } from "primereact/dialog";
import { PrimeIcons } from "primereact/api";
import { useNavigate } from "react-router-dom";

// new branch

const FindAmenityPage = () => {
  const navigate = useNavigate();

  const details: string = "Lorem ipsum";
  const [room, setRoom] = useState<
    { name: string; details: string } | undefined
  >(undefined);

  const floors: {
    name: string;
    rooms: { name: string; details: string }[];
    code: string;
  }[] = [
    {
      name: "Ground Floor",
      rooms: [
        { name: "Room 1", details },
        { name: "Room 2", details },
        { name: "Room 3", details },
        { name: "Room 4", details },
      ],
      code: "GF",
    },
    {
      name: "2nd Floor",
      rooms: [
        { name: "Room 1", details },
        { name: "Room 2", details },
        { name: "Room 3", details },
        { name: "Room 4", details },
      ],

      code: "2F",
    },
    {
      name: "3rd Floor",
      rooms: [
        { name: "Room 1", details },
        { name: "Room 2", details },
        { name: "Room 3", details },
        { name: "Room 4", details },
      ],

      code: "3F",
    },
    {
      name: "4th Floor",
      rooms: [
        { name: "Room 1", details },
        { name: "Room 2", details },
        { name: "Room 3", details },
        { name: "Room 4", details },
      ],

      code: "4F",
    },
    {
      name: "5th Floor",
      rooms: [
        { name: "Room 1", details },
        { name: "Room 2", details },
        { name: "Room 3", details },
        { name: "Room 4", details },
      ],

      code: "5F",
    },
    {
      name: "6th Floor",
      rooms: [
        { name: "Room 1", details },
        { name: "Room 2", details },
        { name: "Room 3", details },
        { name: "Room 4", details },
      ],

      code: "7F",
    },
  ];

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
            <i onClick={() => navigate(-1)} className={PrimeIcons.TIMES}></i>
          </div>

          <div className="flex flex-col gap-2">
            {floors.map((floor) => (
              <div>
                <p className="mb-4 text-2xl font-medium">{floor.name}</p>
                <div className="flex flex-wrap gap-2">
                  {floor.rooms.map((room, index) => (
                    <div
                      onClick={() => setRoom(room)}
                      key={index}
                      className="p-4 border rounded hover:shadow hover:shadow-blue-400 w-44 h-44 bg-slate-900/40 border-slate-700"
                    >
                      <p className="text-xl">{room.name}</p>
                      <p className="text-xl">{room.details}</p>
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
