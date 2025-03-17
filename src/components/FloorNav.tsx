import { PrimeIcons } from "primereact/api";
import { Floor } from "../types/types";
import useSelectedFloorStore from "../@utils/store/selectedFloor";
import { Dropdown } from "primereact/dropdown";
import useSelectedRoom from "../@utils/store/selectedRoom";

interface Props {
  floors: Floor[] | undefined;
}

const FloorNav: React.FC<Props> = ({ floors }) => {
  const { selectedFloor, setSelectedFloor } = useSelectedFloorStore();
  const { selectedRoom, setSelectedRoom } = useSelectedRoom();

  return (
    <nav className="absolute top-10 left-10">
      <header className="p-3 rounded-t-lg bg-slate-900/90 backdrop-blur">
        <h4 className="text-lg font-medium">Select your destination here</h4>
      </header>
      <div className="flex items-center gap-3 p-3 shadow bg-slate-800/90 rounded-b-xl backdrop-blur">
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
            options={selectedFloor.rooms
              .filter((room) => room.directionPattern)
              .map((room) => room)}
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
    </nav>
  );
};

export default FloorNav;
