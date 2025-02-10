import React, { useRef } from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { uploadRoomPhotos } from "../@utils/services/roomService";
import { Toast } from "primereact/toast";
import handleErrors from "../@utils/functions/handleErrors";
import { PrimeIcons } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import CustomToast from "./CustomToast";

interface Props {
  roomId: number;
}

const RoomImagesTab: React.FC<Props> = ({ roomId }) => {
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
    <RoomTabTemplate>
      <CustomToast ref={toastRef} />
      <FileUpload
        ref={fileUploadRef}
        multiple
        mode="basic"
        accept="image/*"
        customUpload
        uploadHandler={handleUpload}
      />
    </RoomTabTemplate>
  );
};

export default RoomImagesTab;
