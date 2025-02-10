import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import { createFloor } from "../@utils/services/floorService";
import { Toast } from "primereact/toast";
import handleErrors from "../@utils/functions/handleErrors";
import useCrmSidebarSignalStore from "../@utils/store/crmSidebarSectionSignal";
import { confirmDialog } from "primereact/confirmdialog";
import CustomToast from "./CustomToast";

interface Props {
  visible: boolean;
  onHide: () => void;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface FormFields {
  name: string;
  level: number;
  code: string;
}

const AddFloorDialog: React.FC<Props> = ({ visible, onHide, setVisible }) => {
  const toastRef = useRef<Toast>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<FormFields>();
  const { setRefresh } = useCrmSidebarSignalStore();

  const accept = () => {
    const { name, level, code } = getValues();
    createFloor(name, code, level)
      .then((response) => {
        const message = response?.data?.message || "Floor created successfully";
        const status = response?.status;

        if (status === 201) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: message,
          });

          setRefresh(true);
          reset();
          setVisible(false);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);

        handleErrors(error, toastRef);

        const status = error?.response?.status || 500;
        const message =
          error?.response?.data?.message || "An unknown error occurred.";

        toastRef.current?.show({
          severity: status === 400 ? "warn" : "error",
          summary: status === 400 ? "Warning" : "Error",
          detail: message,
        });
      });
  };

  const handleAddFloorClicked = () => {
    confirmDialog({
      message: "Do you want to add this floor?",
      header: "Create Floor",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        header="Add a floor"
        visible={visible}
        onHide={() => {
          onHide();
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
        <form onSubmit={handleSubmit(handleAddFloorClicked)}>
          <div className="h-24">
            <label
              htmlFor="floorLevelInput"
              className="text-sm font-semibold text-blue-400"
            >
              Floor level
            </label>
            <IconField id="floorLevelInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.BUILDING}`}></InputIcon>
              <InputText
                {...register("level", { required: true })}
                placeholder="1"
                type="number"
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.level && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">
                  Floor level is required.
                </p>
              </small>
            )}
          </div>
          <div className="h-24">
            <label
              htmlFor="floorCodeInput"
              className="text-sm font-semibold text-blue-400"
            >
              Floor name
            </label>
            <IconField id="floorCodeInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.ALIGN_LEFT}`}></InputIcon>
              <InputText
                {...register("name", { required: true })}
                placeholder="First Floor"
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.name && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">
                  Floor name is required.
                </p>
              </small>
            )}
          </div>
          <div className="h-24">
            <label
              htmlFor="floorCodeInput"
              className="text-sm font-semibold text-blue-400"
            >
              Floor code
            </label>
            <IconField id="floorCodeInput" iconPosition="left">
              <InputIcon className={`${PrimeIcons.BUILDING}`}></InputIcon>
              <InputText
                {...register("code", { required: true })}
                placeholder="1F"
                maxLength={2}
                className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
              />
            </IconField>
            {errors.code && (
              <small className="flex items-center gap-1 mt-1">
                <i
                  className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                ></i>
                <p className="font-medium text-red-400">
                  Floor code is required.
                </p>
              </small>
            )}
          </div>
          <Button
            type="submit"
            className="justify-center w-full h-10 gap-2 mt-2 font-medium"
            icon={`${PrimeIcons.PLUS}`}
          >
            Create floor
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddFloorDialog;
