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
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Image } from "primereact/image";
import CustomToast from "./CustomToast";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  roomId: number;
  handleUpload: (event: FileUploadHandlerEvent) => void;
  fileUploadRef: RefObject<FileUpload>;
}

const responsiveOptions = [
  {
    breakpoint: "1500px",
    numVisible: 5,
  },
  {
    breakpoint: "1024px",
    numVisible: 3,
  },
  {
    breakpoint: "768px",
    numVisible: 2,
  },
  {
    breakpoint: "560px",
    numVisible: 1,
  },
];

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
  const [imageObjs, setImageObjs] = useState<RoomImage[]>([]);
  const galleriaRef = useRef<Galleria>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);

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
          console.log(response.data);
          setImageObjs(response.data.images);
          setImageLocationStr(tempImgLocations);
        })
        .catch((error) => handleErrors(error, toastRef));
    };

    fetchPhotos();
  }, [roomId, query]);

  const handleImgClicked = (id: number) => {
    if (selectedImageIds.includes(id)) {
      toastRef.current?.show({
        severity: "info",
        summary: "Success",
        detail: "Id was removed.",
      });

      setSelectedImageIds((prev) => prev.filter((prevId) => prevId !== id));

      return;
    } else {
      toastRef.current?.show({
        severity: "info",
        summary: "Success",
        detail: "Id was added.",
      });

      setSelectedImageIds((prev) => [...prev, id]);
      return;
    }
  };

  useEffect(() => {
    console.log(selectedImageIds);
  }, [selectedImageIds]);

  const imageTemplate = (image: string) => {
    return (
      <img
        src={image}
        alt={image}
        style={{ width: "100%", display: "block" }}
      />
    );
  };

  const thumbnailTemplate = (image: string) => {
    return <img src={image} alt={image} style={{ display: "block" }} />;
  };

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
      <CustomToast ref={toastRef} />
      <FileUpload
        ref={fileUploadRef}
        multiple
        mode="basic"
        accept="image/*"
        customUpload
        uploadHandler={handleUpload}
      />
      <Galleria
        ref={galleriaRef}
        value={imageLocationsStr}
        responsiveOptions={responsiveOptions}
        numVisible={9}
        style={{ maxWidth: "50%" }}
        circular
        fullScreen
        showItemNavigators
        item={imageTemplate}
        thumbnail={thumbnailTemplate}
      />
      {imageObjs.map((img) => (
        <Image
          src={getImageFromServer(ImageLocation.ROOM, img.imageLocation)}
          alt={img.imageLocation}
          key={img.id}
          onClick={() => handleImgClicked(img.id)}
        />
      ))}

      <Button
        icon={PrimeIcons.EYE}
        onClick={() => galleriaRef.current?.show()}
      ></Button>
    </Dialog>
  );
};

export default RoomImageDialog;
