import React, { useRef, useState } from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { uploadRoomPhotos } from "../@utils/services/roomService";
import { Toast } from "primereact/toast";
import handleErrors from "../@utils/functions/handleErrors";
import { PrimeIcons } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import CustomToast from "./CustomToast";
import RoomImageDialog from "./RoomImageDialog";
import { Button } from "primereact/button";

interface Props {
  roomId: number;
}

const RoomImagesTab: React.FC<Props> = ({ roomId }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const fileUploadRef = useRef<FileUpload>(null);
  const toastRef = useRef<Toast>(null);

  const accept = (formData: FormData) => {
    uploadRoomPhotos(roomId, formData)
      .then((response) => {
        if (response.status === 201) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Photos uploaded successfully",
          });

          fileUploadRef.current?.clear();
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const handleUpload = (event: FileUploadHandlerEvent) => {
    const formData = new FormData();

    event.files.forEach((file) => {
      formData.append("files", file);
    });

    confirmDialog({
      message: "Do you want to upload these photos?",
      header: "Photo upload",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept: () => accept(formData),
    });
  };

  return (
    <>
      <RoomTabTemplate>
        <RoomImageDialog
          fileUploadRef={fileUploadRef}
          handleUpload={handleUpload}
          roomId={roomId}
          setVisible={setVisible}
          visible={visible}
        />
        <div className="grid w-full h-full place-content-center">
          <CustomToast ref={toastRef} />
          <Button
            icon={`${PrimeIcons.EYE}`}
            className="w-10 h-10"
            onClick={() => {
              setVisible(true);
            }}
          ></Button>
        </div>
      </RoomTabTemplate>
    </>
  );
};

export default RoomImagesTab;
