import { ImageLocation } from "../enums/enum";

const getImageFromServer = (entity: string, imageLocation: string) => {
  return `${ImageLocation.BASE}/${ImageLocation.UPLOADS}/${entity}/${imageLocation}`;
};

export default getImageFromServer;
