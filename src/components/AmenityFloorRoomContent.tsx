import useSelectedFloorStore from "../@utils/store/selectedFloor";
import AmenityRoomCard from "./AmenityRoomCard";
import SelectedRoomDialog from "./SelectedRoomDialog";

const AmenityFloorRoomContent = () => {
  const { selectedFloor } = useSelectedFloorStore();

  return (
    <div
      className={` h-full gap-4 p-4 ${
        selectedFloor ? "flex flex-wrap" : "grid place-content-center"
      }`}
    >
      <SelectedRoomDialog />
      {selectedFloor?.rooms && selectedFloor.rooms.length > 0 ? (
        selectedFloor.rooms
          .filter((room) => room.directionPattern)
          .map((room) => <AmenityRoomCard room={room} key={room.id} />)
      ) : (
        <p className="text-lg font-medium text-blue-400">Select a floor</p>
      )}
    </div>
  );
};

export default AmenityFloorRoomContent;
