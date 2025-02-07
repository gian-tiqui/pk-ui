import React, { useEffect, useRef, useState } from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import { useQuery } from "@tanstack/react-query";
import { getRoomById, updateRoomById } from "../@utils/services/roomService";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useForm } from "react-hook-form";
import { confirmDialog } from "primereact/confirmdialog";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";

interface Props {
  roomId: number;
}

interface FormFields {
  detail: string | undefined;
}

const RoomDetailsTab: React.FC<Props> = ({ roomId }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const toastRef = useRef<Toast>(null);
  const {
    data: room,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`room-${roomId}`],
    queryFn: () => getRoomById(roomId),
  });

  const { register, setValue, handleSubmit, getValues } = useForm<FormFields>();

  useEffect(() => {
    const setDetails = () => {
      if (room) {
        setValue("detail", room.detail);
      }
    };

    setDetails();
  }, [room, setValue]);

  const accept = () => {
    if (!roomId) return;

    const { detail } = getValues();

    updateRoomById(roomId, { detail })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Room details updated.",
          });

          refetch();
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const onSubmit = () => {
    confirmDialog({
      message: "Update the details of the floor?",
      header: "Edit details",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  if (isLoading)
    return <RoomTabTemplate>Loading room details...</RoomTabTemplate>;

  return (
    <RoomTabTemplate>
      <CustomToast ref={toastRef} />
      <form className="w-full p-1" onSubmit={handleSubmit(onSubmit)}>
        <InputTextarea
          disabled={!isEditMode}
          {...register("detail")}
          className="w-full h-64 mb-2 bg-slate-800 border-slate-600 text-slate-100"
        />
        <div className="flex justify-end w-full gap-2">
          {isEditMode && (
            <Button
              type="submit"
              className="w-32 h-10 font-medium"
              icon={`${PrimeIcons.USER_EDIT} me-2 text-lg`}
            >
              Update
            </Button>
          )}

          {!isEditMode && (
            <Button
              onClick={() => setIsEditMode(true)}
              type="button"
              className="w-32 h-10 font-medium"
              icon={`${PrimeIcons.USER_EDIT} me-2 text-lg`}
            >
              Edit
            </Button>
          )}

          {isEditMode && (
            <Button
              onClick={() => setIsEditMode(false)}
              type="button"
              severity="danger"
              className="w-32 h-10 font-medium"
              icon={`${PrimeIcons.USER_EDIT} me-2 text-lg`}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </RoomTabTemplate>
  );
};

export default RoomDetailsTab;
