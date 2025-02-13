import useSelectedFloorStore from "../@utils/store/selectedFloor";
import AmenityRoomCard from "./AmenityRoomCard";

const AmenityFloorRoomContent = () => {
  const { selectedFloor } = useSelectedFloorStore();

  return (
    <div className="flex flex-wrap h-full gap-4 p-4">
      {selectedFloor?.rooms &&
        selectedFloor.rooms.length > 0 &&
        selectedFloor.rooms
          .filter((room) => room.directionPattern)
          .map((room) => <AmenityRoomCard room={room} key={room.id} />)}
    </div>
  );
};

export default AmenityFloorRoomContent;
