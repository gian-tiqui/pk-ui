import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import CustomToast from "./CustomToast";
import { useForm } from "react-hook-form";
import {
  getRoomById,
  softDeleteRoomById,
} from "../@utils/services/roomService";
import { useQuery } from "@tanstack/react-query";
import { confirmDialog } from "primereact/confirmdialog";
import handleErrors from "../@utils/functions/handleErrors";
import useFloorRoomsSignalStore from "../@utils/store/floorRoomsSignal";

interface Props {
  roomId: number;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface FormFields {
  name?: string;
  code?: string;
}

const RoomSettingsTab: React.FC<Props> = ({ roomId, setVisible }) => {
  const toastRef = useRef<Toast>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { register, setValue } = useForm<FormFields>();
  const { setFloorRoomsSignal } = useFloorRoomsSignalStore();

  const { data: room } = useQuery({
    queryKey: [`room-${roomId}`],
    queryFn: () => getRoomById(roomId),
    enabled: roomId !== -1,
  });

  useEffect(() => {
    const setRoomData = () => {
      setValue("name", room?.name);
      setValue("code", room?.code);
    };

    setRoomData();
  }, [setValue, room]);

  const accept = () => {
    softDeleteRoomById(roomId)
      .then((response) => {
        if (response.status === 200) {
          setVisible(false);
          setFloorRoomsSignal(true);
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const handleDeleteButtonClicked = () => {
    confirmDialog({
      message: (
        <p>
          Do you want to <span className="text-blue-400">delete</span> this
          floor?
        </p>
      ),
      header: "Delete Room",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <form className="w-full pt-4 h-80 text-slate-100">
      <CustomToast ref={toastRef} />
      <ScrollPanel style={{ height: "calc(72vh - 200px)" }} className="mb-5">
        <div className="flex justify-between w-full">
          <p className="w-full">Room name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.HOME}> </InputIcon>
            <InputText
              disabled={!isEditMode}
              {...register("name")}
              placeholder="Room name"
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full"></div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Room code</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.KEY}> </InputIcon>
            <InputText
              disabled={!isEditMode}
              {...register("code")}
              placeholder="Room code"
              maxLength={2}
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full"></div>
        </div>
      </ScrollPanel>
      <div className={`flex justify-end gap-2`}>
        {isEditMode && (
          <Button
            className="w-52"
            severity="danger"
            type="button"
            icon={`${PrimeIcons.SIGN_OUT} mr-2 text-xl`}
            onClick={() => setIsEditMode(false)}
          >
            Cancel
          </Button>
        )}
        {isEditMode && (
          <Button
            className="w-52"
            type="submit"
            icon={`${PrimeIcons.SAVE} mr-2 text-xl`}
          >
            Save
          </Button>
        )}
        {!isEditMode && (
          <>
            <Button
              className="w-52"
              type="button"
              onClick={() => setIsEditMode(true)}
              icon={`${PrimeIcons.USER_EDIT} mr-2 text-xl`}
            >
              Edit
            </Button>
            <Button
              className="w-52"
              type="button"
              severity="danger"
              onClick={handleDeleteButtonClicked}
              icon={`${PrimeIcons.TRASH} mr-2 text-xl`}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default RoomSettingsTab;
