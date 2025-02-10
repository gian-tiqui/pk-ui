import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import useUserDataStore from "../@utils/store/userDataStore";
import { verifyPasswordById } from "../@utils/services/userService";
import handleErrors from "../@utils/functions/handleErrors";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";
import { FloorParam } from "../types/types";
import useCrmSidebarSignalStore from "../@utils/store/crmSidebarSectionSignal";
import { softDeleteFloorById } from "../@utils/services/floorService";
import CustomToast from "./CustomToast";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface FormFields {
  password: string;
  userId: number;
}

const DeleteFloorDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const toastRef = useRef<Toast>(null);
  const { setRefresh } = useCrmSidebarSignalStore();
  const param = useParams() as FloorParam;
  const navigate = useNavigate();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();
  const { user } = useUserDataStore();

  useEffect(() => {
    const setUserId = () => {
      if (user) setValue("userId", user.sub);
    };

    setUserId();
  }, [user, setValue]);

  const accept = () => {
    const { userId, password } = getValues();

    verifyPasswordById(userId, password)
      .then((response) => {
        if (response.status === 201) {
          softDeleteFloorById(+param.floorId)
            .then((response) => {
              if (response.status === 200) {
                toastRef.current?.show({
                  severity: "info",
                  summary: "Success",
                  detail: response.data.message,
                });

                setRefresh(true);
                reset();
                setVisible(false);
                navigate("/amenity-management");
              }
            })
            .catch((error) => console.error(error, toastRef));
        }
      })
      .catch((error) => handleErrors(error, toastRef));
  };

  const onSubmit = () => {
    confirmDialog({
      message: "Do you want to delete this floor?",
      header: "Delete Floor",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
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
        visible={visible}
        onHide={() => {
          if (visible === true) {
            setVisible(false);
          }
        }}
        header="Delete this floor"
        className="w-80"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="mb-4">
            Note that deleting this floor will also{" "}
            <span className="text-red-500">delete the rooms</span> associated to
            it.
          </p>

          <p className="mb-4">Enter your password to continue</p>
          <div className="h-24">
            <label
              htmlFor="passwordInput"
              className="text-sm font-semibold text-blue-400"
            >
              Password
            </label>
            <IconField id="passwordInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.LOCK}`}></InputIcon>
              <InputText
                {...register("password", { required: true })}
                placeholder="*********"
                type="password"
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.password && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">
                  Password is required.
                </p>
              </small>
            )}
          </div>
          <Button
            type="submit"
            className="justify-center w-full h-10 gap-2 mt-2 font-medium"
            icon={`${PrimeIcons.TRASH}`}
          >
            Delete floor
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default DeleteFloorDialog;
