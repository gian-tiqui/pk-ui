import { PrimeIcons } from "primereact/api";
import { Floor } from "../types/types";
import useSelectedFloorStore from "../@utils/store/selectedFloor";
import { Dropdown } from "primereact/dropdown";
import useSelectedRoom from "../@utils/store/selectedRoom";
import { Button } from "primereact/button";
import useStartingPointStore from "../@utils/store/startingPoint";
import { StartingPoint } from "../@utils/enums/enum";
import { useState } from "react";

interface Props {
  floors: Floor[] | undefined;
}

const FloorNav: React.FC<Props> = ({ floors }) => {
  const { selectedFloor, setSelectedFloor } = useSelectedFloorStore();
  const { selectedRoom, setSelectedRoom } = useSelectedRoom();
  const { setStartingPoint } = useStartingPointStore();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return isCollapsed ? (
    <nav className="absolute top-10 left-10">
      <header className="flex justify-between p-3 rounded-t-lg bg-slate-900/90 backdrop-blur">
        <h4 className="text-lg font-medium">Select your destination here</h4>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setIsCollapsed((prev) => !prev);
            }}
            severity="contrast"
            className="w-8 h-8"
            icon={"pi pi-expand"}
          ></Button>
          <Button
            onClick={() => {
              setSelectedFloor(undefined);
              setSelectedRoom(undefined);
            }}
            severity="contrast"
            className="w-8 h-8"
            icon={PrimeIcons.REFRESH}
          ></Button>
        </div>
      </header>
      <div className="flex items-center gap-3 p-3 shadow bg-slate-800/90 backdrop-blur">
        {floors && floors.length < 1 && (
          <p className="text-slate-100">No available floors yet</p>
        )}

        {floors && floors.length > 0 && (
          <Dropdown
            pt={{
              root: { className: "bg-slate-800" },
              header: { className: "bg-slate-800" },
              filterInput: { className: "bg-inherit text-slate-100" },
              list: { className: "bg-slate-800" },
              item: {
                className:
                  "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
              },

              input: { className: "text-slate-100" },
            }}
            filter
            options={floors}
            optionLabel="name"
            placeholder="Select a floor"
            className="w-40"
            value={selectedFloor}
            onChange={(e) => {
              const floor = e.value;
              if (floor) {
                setSelectedFloor(floor);
              }
            }}
          />
        )}
        {selectedFloor?.rooms && selectedFloor.rooms.length > 0 ? (
          <Dropdown
            pt={{
              root: { className: "bg-slate-800" },
              header: { className: "bg-slate-800" },
              filterInput: { className: "bg-inherit text-slate-100" },
              list: { className: "bg-slate-800" },
              item: {
                className:
                  "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
              },
              input: { className: "text-slate-100" },
            }}
            filter
            className="w-40"
            options={selectedFloor.rooms}
            optionLabel="name"
            value={selectedRoom}
            placeholder="Select a room"
            onChange={(e) => {
              const room = e.value;

              if (room) {
                setSelectedRoom(room);
              }
            }}
          />
        ) : (
          <p className="flex items-center text-lg font-medium text-blue-400">
            <i className={`${PrimeIcons.QUESTION_CIRCLE} me-2 text-xl`}></i>
            Select a floor
          </p>
        )}
      </div>
      <footer className="p-3 rounded-b-xl bg-slate-900">
        <p className="mb-3">Select where you are coming from?</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="h-10"
            severity="contrast"
            onClick={() => {
              setStartingPoint(StartingPoint.FRONT_ELEVATOR);
            }}
          >
            Front Elevator
          </Button>
          <Button
            className="h-10"
            severity="contrast"
            onClick={() => {
              setStartingPoint(StartingPoint.BACK_ELEVATOR);
            }}
          >
            Back Elevator
          </Button>
          <Button
            className="h-10"
            severity="contrast"
            onClick={() => {
              setStartingPoint(StartingPoint.FRONT_STAIRS);
            }}
          >
            Front Stairs
          </Button>
          <Button
            className="h-10"
            severity="contrast"
            onClick={() => {
              setStartingPoint(StartingPoint.BACK_STAIRS);
            }}
          >
            Back Stairs
          </Button>
        </div>
      </footer>
    </nav>
  ) : (
    <Button
      className="absolute w-8 h-8 top-10 left-10"
      onClick={() => {
        setIsCollapsed((prev) => !prev);
      }}
      severity="contrast"
      icon={"pi pi-expand"}
    ></Button>
  );
};

export default FloorNav;
