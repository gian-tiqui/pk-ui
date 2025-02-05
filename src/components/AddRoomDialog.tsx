import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import handleErrors from "../@utils/functions/handleErrors";
import { useParams } from "react-router-dom";
import { createRoom } from "../@utils/services/roomService";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";
import { FloorParam } from "../types/types";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface FormFields {
  name: string;
  code: string;
  floorId: number;
}

const AddRoomDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const toastRef = useRef<Toast>(null);
  const param = useParams() as FloorParam;
  const { setFloorRoomsSignal } = useFloorRoomsSignalStore();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<FormFields>();

  const accept = () => {
    const { name, code } = getValues();

    createRoom(name, code, +param.floorId)
      .then((response) => {
        if (response.status === 201) {
          const message =
            response?.data?.message || "Floor created successfully";

          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: message,
          });

          reset();
          setFloorRoomsSignal(true);
          setVisible(false);
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const handleAddRoomClicked = () => {
    confirmDialog({
      message: "Do you want to add this room?",
      header: "Create room",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <>
      <Toast
        ref={toastRef}
        pt={{ content: { className: "h-full backdrop-blur" } }}
      />
      <Dialog
        header="Add a room"
        visible={visible}
        onHide={() => {
          setVisible(false);
          reset();
        }}
        className="p-4 w-96"
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
      >
        <form onSubmit={handleSubmit(handleAddRoomClicked)}>
          <div className="h-24">
            <label
              htmlFor="roomNameInput"
              className="text-sm font-semibold text-blue-400"
            >
              Room name
            </label>
            <IconField id="roomNameInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.HOME}`}></InputIcon>
              <InputText
                {...register("name", { required: true })}
                placeholder="Male Comfort Room"
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.name && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">
                  Room name is required.
                </p>
              </small>
            )}
          </div>
          <div className="h-24">
            <label
              htmlFor="roomCodeInput"
              className="text-sm font-semibold text-blue-400"
            >
              Room code
            </label>
            <IconField id="roomCodeInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.SHIELD}`}></InputIcon>
              <InputText
                {...register("code", { required: true })}
                placeholder="MCR"
                maxLength={5}
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.code && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">
                  Room code is required.
                </p>
              </small>
            )}
          </div>

          <Button
            type="submit"
            className="justify-center w-full h-10 gap-2 mt-2 font-medium"
            icon={`${PrimeIcons.PLUS}`}
          >
            Create room
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddRoomDialog;
