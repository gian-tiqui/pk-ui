import { Image } from "primereact/image";
import useSelectedFloorStore from "../@utils/store/selectedFloor";
import AmenityRoomCard from "./AmenityRoomCard";
import SelectedRoomDialog from "./SelectedRoomDialog";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { ImageLocation } from "../@utils/enums/enum";

const AmenityFloorRoomContent = () => {
  const { selectedFloor } = useSelectedFloorStore();

  return (
    <div
      className={` h-full gap-4 p-4 ${
        selectedFloor ? "flex flex-wrap" : "grid place-content-center"
      }`}
    >
      <Image
        src={getImageFromServer(
          ImageLocation.FLOOR,
          selectedFloor?.imageLocation
        )}
      />
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
