import React, { useEffect, useRef, useState } from "react";
import RoomTabTemplate from "../templates/RoomTabTemplate";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import CustomToast from "./CustomToast";
import { useQuery } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { useForm } from "react-hook-form";
import handleErrors from "../@utils/functions/handleErrors";
import { getRoomById, updateRoomById } from "../@utils/services/roomService";
import { confirmDialog } from "primereact/confirmdialog";

interface Props {
  roomId: number;
}

interface FormFields {
  direction: string | undefined;
}

const RoomDirectionsTab: React.FC<Props> = ({ roomId }) => {
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
    const setdirections = () => {
      if (room) {
        setValue("direction", room.direction);
      }
    };

    setdirections();
  }, [room, setValue]);

  const accept = () => {
    if (!roomId) return;

    const { direction } = getValues();

    updateRoomById(roomId, { direction })
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Room directions updated.",
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
      <h4 className="font-medium text-slate-100">
        <i className={`${PrimeIcons.INFO_CIRCLE} me-2`}></i>
        Add the room direction instructions here
      </h4>
      <form className="w-full p-1" onSubmit={handleSubmit(onSubmit)}>
        <InputTextarea
          disabled={!isEditMode}
          {...register("direction")}
          className="w-full mb-2 h-52 bg-slate-800 border-slate-600 text-slate-100"
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

export default RoomDirectionsTab;
