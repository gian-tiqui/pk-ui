import { Floor } from "../../types/types";

const filterCompleteCloor = (floors: Floor[]): Floor[] => {
  if (floors.length < 1) return [];

  return [
    ...floors
      .filter(
        (floor) => floor.imageLocation !== undefined && floor.rooms.length > 0
      )
      .map((floor) => floor),
  ];
};

export default filterCompleteCloor;
