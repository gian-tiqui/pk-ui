import { Dialog } from "primereact/dialog";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  deleteRoomPhotosByRoomId,
  getRoomPhotos,
} from "../@utils/services/roomService";
import { Query, RoomImage } from "../types/types";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { ImageLocation } from "../@utils/enums/enum";
import { Image } from "primereact/image";
import CustomToast from "./CustomToast";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  roomId: number;
  handleUpload: (event: FileUploadHandlerEvent) => void;
  fileUploadRef: RefObject<FileUpload>;
  toastRef: RefObject<Toast>;
  signal: boolean;
  setSignal: Dispatch<SetStateAction<boolean>>;
}

const RoomImageDialog: React.FC<Props> = ({
  visible,
  setVisible,
  roomId,
  handleUpload,
  fileUploadRef,
  toastRef,
  signal,
  setSignal,
}) => {
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [query] = useState<Query>({
    limit: 10,
    offset: 0,
    isDeleted: false,
  });
  const [imageObjs, setImageObjs] = useState<RoomImage[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);

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
          setImageObjs(response.data.images);
        })
        .catch((error) => handleErrors(error, toastRef));
    };

    fetchPhotos();

    return () => setSignal(false);
  }, [roomId, query, signal, toastRef, setSignal]);

  const accept = () => {
    const imageIds: string = selectedImageIds.join(",");

    if (!imageIds || imageIds === "") {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "You have not selected a single image",
      });

      return;
    }

    deleteRoomPhotosByRoomId(roomId, imageIds)
      .then((response) => {
        if (response.status === 200) {
          if (signal === false) setSignal(true);
          setSelectedImageIds([]);
          setDeleteMode(false);

          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Images has been moved to trash",
          });
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const handleDelete = () => {
    confirmDialog({
      message: "Do you want to move the images to trash?",
      header: "Delete Images",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const handleImgClicked = (id: number) => {
    if (selectedImageIds.includes(id)) {
      setSelectedImageIds((prev) => prev.filter((prevId) => prevId !== id));

      return;
    } else {
      setSelectedImageIds((prev) => [...prev, id]);
      return;
    }
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
      <div className="flex justify-between w-full">
        <FileUpload
          ref={fileUploadRef}
          multiple
          mode="basic"
          accept="image/*"
          customUpload
          uploadHandler={handleUpload}
          className="mb-5"
        />
        <div className="flex gap-2">
          {!deleteMode && (
            <Button
              icon={`${PrimeIcons.ALIGN_JUSTIFY}`}
              severity="info"
              className="w-12 h-12"
              onClick={() => {
                if (deleteMode == false) setDeleteMode(true);
              }}
            ></Button>
          )}
          {deleteMode && (
            <Button
              icon={`${PrimeIcons.TRASH}`}
              severity="danger"
              className="w-12 h-12"
              onClick={() => {
                if (deleteMode == true) {
                  handleDelete();
                }
              }}
            ></Button>
          )}
          {deleteMode && (
            <Button
              icon={`${PrimeIcons.TIMES}`}
              severity="warning"
              className="w-12 h-12"
              onClick={() => {
                if (deleteMode == true) {
                  setDeleteMode(false);
                  setSelectedImageIds([]);
                }
              }}
            ></Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {imageObjs.map((img) => (
          <div
            className={`w-96 flex items-center justify-center overflow-hidden ${
              selectedImageIds.includes(img.id) && "opacity-35"
            }`}
            key={img.id}
          >
            <Image
              preview
              src={getImageFromServer(ImageLocation.ROOM, img.imageLocation)}
              alt={img.imageLocation}
              onClick={deleteMode ? () => handleImgClicked(img.id) : undefined}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </Dialog>
  );
};

export default RoomImageDialog;
