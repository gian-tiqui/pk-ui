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
import useAmenityMainSignalStore from "../@utils/store/amenityMain";

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
  const { setRefreshMain } = useAmenityMainSignalStore();

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

          setRefreshMain(true);
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
        header={
          <div className="flex items-center gap-3 p-6 text-white bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm">
              <i className={`${PrimeIcons.BUILDING} text-lg`}></i>
            </div>
            <div>
              <h2 className="text-xl font-bold">Add New Floor</h2>
              <p className="text-sm text-blue-100">Create a new floor entry</p>
            </div>
          </div>
        }
        visible={visible}
        onHide={() => {
          onHide();
          reset();
        }}
        className="w-[480px]"
        pt={{
          root: {
            className: "rounded-3xl overflow-hidden shadow-2xl border-none",
          },
          header: {
            className:
              "border-none p-0 bg-gradient-to-r from-blue-500 to-indigo-600",
          },
          content: {
            className:
              "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 border-none",
          },
        }}
      >
        <form
          onSubmit={handleSubmit(handleAddFloorClicked)}
          className="space-y-6"
        >
          {/* Floor Level Field */}
          <div className="p-5 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20">
            <label
              htmlFor="floorLevelInput"
              className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                <i className={`${PrimeIcons.BUILDING} text-sm text-white`}></i>
              </div>
              Floor Level
            </label>
            <IconField id="floorLevelInput" iconPosition="left">
              <InputIcon
                className={`${PrimeIcons.HASHTAG} text-gray-400`}
              ></InputIcon>
              <InputText
                {...register("level", { required: true })}
                placeholder="Enter floor level (e.g., 1, 2, 3...)"
                type="number"
                className="w-full h-12 px-4 text-gray-700 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-xl border-white/20 focus:border-blue-400 focus:bg-white/80 hover:bg-white/80"
              />
            </IconField>
            {errors.level && (
              <div className="flex items-center gap-2 p-3 mt-3 text-red-600 border shadow-lg bg-red-50/70 backdrop-blur-sm rounded-xl border-red-200/20">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm`}></i>
                <span className="text-sm font-medium">
                  Floor level is required
                </span>
              </div>
            )}
          </div>

          {/* Floor Name Field */}
          <div className="p-5 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20">
            <label
              htmlFor="floorNameInput"
              className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                <i
                  className={`${PrimeIcons.ALIGN_LEFT} text-sm text-white`}
                ></i>
              </div>
              Floor Name
            </label>
            <IconField id="floorNameInput" iconPosition="left">
              <InputIcon
                className={`${PrimeIcons.TAG} text-gray-400`}
              ></InputIcon>
              <InputText
                {...register("name", { required: true })}
                placeholder="Enter floor name (e.g., Ground Floor, First Floor)"
                className="w-full h-12 px-4 text-gray-700 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-xl border-white/20 focus:border-emerald-400 focus:bg-white/80 hover:bg-white/80"
              />
            </IconField>
            {errors.name && (
              <div className="flex items-center gap-2 p-3 mt-3 text-red-600 border shadow-lg bg-red-50/70 backdrop-blur-sm rounded-xl border-red-200/20">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm`}></i>
                <span className="text-sm font-medium">
                  Floor name is required
                </span>
              </div>
            )}
          </div>

          {/* Floor Code Field */}
          <div className="p-5 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20">
            <label
              htmlFor="floorCodeInput"
              className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                <i className={`${PrimeIcons.CODE} text-sm text-white`}></i>
              </div>
              Floor Code
            </label>
            <IconField id="floorCodeInput" iconPosition="left">
              <InputIcon
                className={`${PrimeIcons.BOOKMARK} text-gray-400`}
              ></InputIcon>
              <InputText
                {...register("code", { required: true })}
                placeholder="Enter floor code (e.g., 1F, 2F, GF)"
                maxLength={2}
                className="w-full h-12 px-4 text-gray-700 transition-all duration-300 border shadow-lg bg-white/70 backdrop-blur-sm rounded-xl border-white/20 focus:border-purple-400 focus:bg-white/80 hover:bg-white/80"
              />
            </IconField>
            {errors.code && (
              <div className="flex items-center gap-2 p-3 mt-3 text-red-600 border shadow-lg bg-red-50/70 backdrop-blur-sm rounded-xl border-red-200/20">
                <i className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm`}></i>
                <span className="text-sm font-medium">
                  Floor code is required
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-4 text-white transition-all duration-300 transform border-none shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
            icon={`${PrimeIcons.PLUS} mr-2`}
          >
            <span className="text-lg font-semibold">Create Floor</span>
          </Button>
        </form>
      </Dialog>
    </>
  );
};

export default AddFloorDialog;
