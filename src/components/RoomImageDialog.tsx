import { Dialog } from "primereact/dialog";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { getRoomPhotos } from "../@utils/services/roomService";
import { Query, RoomImage } from "../types/types";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { ImageLocation } from "../@utils/enums/enum";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  roomId: number;
  handleUpload: (event: FileUploadHandlerEvent) => void;
  fileUploadRef: RefObject<FileUpload>;
}

const RoomImageDialog: React.FC<Props> = ({
  visible,
  setVisible,
  roomId,
  handleUpload,
  fileUploadRef,
}) => {
  const [query] = useState<Query>({
    limit: 10,
    offset: 0,
    isDeleted: false,
  });
  const [imageLocationsStr, setImageLocationStr] = useState<string[]>([]);

  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const fetchPhotos = () => {
      if (!roomId) return;

      getRoomPhotos(roomId, query)
        .then((response) => {
          const roomImagesData = response.data.images;
          const tempImgLocations: string[] = [];

          roomImagesData.map((image: RoomImage) =>
            tempImgLocations.push(
              getImageFromServer(ImageLocation.ROOM, image.imageLocation)
            )
          );

          setImageLocationStr(tempImgLocations);
        })
        .catch((error) => handleErrors(error, toastRef));
    };

    fetchPhotos();
  }, [roomId, query]);

  return (
    <Dialog
      visible={visible}
      header="Images"
      className="w-[90%] h-[90%]"
      pt={{
        header: {
          className:
            "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-slate-700",
        },
      }}
      onHide={() => {
        if (visible) setVisible(false);
      }}
    >
      <FileUpload
        ref={fileUploadRef}
        multiple
        mode="basic"
        accept="image/*"
        customUpload
        uploadHandler={handleUpload}
      />
      {imageLocationsStr.map((imageUri, index: number) => (
        <img src={imageUri} alt={`image-${index}`} key={index} />
      ))}
    </Dialog>
  );
};

export default RoomImageDialog;
