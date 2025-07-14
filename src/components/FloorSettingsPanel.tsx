import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { useParams } from "react-router-dom";
import CustomToast from "./CustomToast";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useQuery } from "@tanstack/react-query";
import { getFloorById, updateFloorById } from "../@utils/services/floorService";
import { FloorParam } from "../types/types";
import { confirmDialog } from "primereact/confirmdialog";
import handleErrors from "../@utils/functions/handleErrors";
import useCrmSidebarSignalStore from "../@utils/store/crmSidebarSectionSignal";
import useFloorPageHeaderStore from "../@utils/store/floorPageHeader";

interface FormFields {
  name?: string;
  level?: number;
  code?: string;
  floorId: number;
}

const FloorSettingsPanel = () => {
  const toastRef = useRef<Toast>(null);
  const param = useParams() as FloorParam;
  const { handleSubmit, register, setValue, getValues } = useForm<FormFields>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setRefresh } = useCrmSidebarSignalStore();
  const { setRefreshFloorHeader } = useFloorPageHeaderStore();

  useEffect(() => {
    if (param.floorId) setValue("floorId", +param.floorId);
  }, [setValue, param.floorId]);

  const accept = async () => {
    const { floorId, code, level, name } = getValues();
    setIsSubmitting(true);

    updateFloorById(floorId, name, code, level)
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Floor data updated successfully.",
          });

          setRefresh(true);
          setRefreshFloorHeader(true);
          setIsEditMode(false);
        }
      })
      .catch((error) => handleErrors(error, toastRef))
      .finally(() => setIsSubmitting(false));
  };

  const onSubmit = () => {
    confirmDialog({
      message: "Do you want to update the floor data?",
      header: "Update floor",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const { data: floor } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  useEffect(() => {
    const setFormFields = () => {
      setValue("name", floor?.name);
      setValue("level", floor?.level);
      setValue("code", floor?.code);
    };

    setFormFields();
  }, [floor, setValue]);

  const handleCancel = () => {
    // Reset form values to original
    setValue("name", floor?.name);
    setValue("level", floor?.level);
    setValue("code", floor?.code);
    setIsEditMode(false);
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white border shadow-sm h-80 rounded-xl border-slate-200">
      <CustomToast ref={toastRef} />

      {/* Header */}
      <div className="relative flex-shrink-0 px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200">
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Floor Settings
              </h3>
              <p className="text-sm text-slate-600">
                Configure floor details and properties
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isEditMode ? "bg-orange-400" : "bg-green-400"
              }`}
            ></div>
            <span className="text-sm font-medium text-slate-600">
              {isEditMode ? "Edit Mode" : "View Mode"}
            </span>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollPanel style={{ height: "100%" }} className="h-full">
          <form
            id="floor-settings-form"
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* Floor Name */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <svg
                    className="w-4 h-4 mr-2 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Floor Name
                </label>
                {isEditMode && (
                  <span className="px-2 py-1 text-xs rounded-full text-slate-500 bg-slate-100">
                    Required
                  </span>
                )}
              </div>
              <div className="relative">
                <IconField iconPosition="left" className="w-full">
                  <InputIcon className={PrimeIcons.HOME}></InputIcon>
                  <InputText
                    {...register("name")}
                    disabled={!isEditMode}
                    placeholder="Ground Floor"
                    className={`w-full h-12 transition-all duration-200 ${
                      !isEditMode
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-white border-slate-300 text-slate-900 focus:border-slate-500 focus:shadow-sm"
                    }`}
                  />
                </IconField>
              </div>
            </div>

            <Divider className="my-6 border-slate-200" />

            {/* Floor Code */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <svg
                    className="w-4 h-4 mr-2 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Floor Code
                </label>
                {isEditMode && (
                  <span className="px-2 py-1 text-xs rounded-full text-slate-500 bg-slate-100">
                    Max 2 chars
                  </span>
                )}
              </div>
              <div className="relative">
                <IconField iconPosition="left" className="w-full">
                  <InputIcon className={PrimeIcons.TAG}></InputIcon>
                  <InputText
                    {...register("code")}
                    disabled={!isEditMode}
                    placeholder="GF"
                    maxLength={2}
                    className={`w-full h-12 transition-all duration-200 ${
                      !isEditMode
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-white border-slate-300 text-slate-900 focus:border-slate-500 focus:shadow-sm"
                    }`}
                  />
                </IconField>
              </div>
            </div>

            <Divider className="my-6 border-slate-200" />

            {/* Floor Level */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <svg
                    className="w-4 h-4 mr-2 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  Floor Level
                </label>
                {isEditMode && (
                  <span className="px-2 py-1 text-xs rounded-full text-slate-500 bg-slate-100">
                    Numeric
                  </span>
                )}
              </div>
              <div className="relative">
                <IconField iconPosition="left" className="w-full">
                  <InputIcon className={PrimeIcons.SORT_NUMERIC_UP}></InputIcon>
                  <InputText
                    {...register("level")}
                    disabled={!isEditMode}
                    placeholder="0"
                    type="number"
                    className={`w-full h-12 transition-all duration-200 ${
                      !isEditMode
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-white border-slate-300 text-slate-900 focus:border-slate-500 focus:shadow-sm"
                    }`}
                  />
                </IconField>
              </div>
            </div>
          </form>
        </ScrollPanel>
      </div>

      {/* Actions - Always visible at bottom, outside of form and scroll */}
      <div className="flex-shrink-0 px-6 py-4 border-t bg-slate-50 border-slate-200">
        <div className="flex justify-end gap-3">
          {isEditMode ? (
            <>
              <Button
                className="h-10 px-4 py-2 transition-all duration-200 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                severity="secondary"
                type="button"
                icon={`${PrimeIcons.TIMES} mr-2`}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="h-10 px-4 py-2 text-white transition-all duration-200 bg-slate-900 hover:bg-slate-800"
                type="submit"
                form="floor-settings-form"
                icon={`${PrimeIcons.SAVE} mr-2`}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              className="h-10 px-4 py-2 font-medium text-white transition-all duration-200 shadow-sm bg-slate-900 hover:bg-slate-800"
              type="button"
              onClick={() => setIsEditMode(true)}
              icon={`${PrimeIcons.PENCIL} mr-2`}
            >
              Edit Floor
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorSettingsPanel;
