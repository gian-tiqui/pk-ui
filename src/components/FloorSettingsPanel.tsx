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
  const { setRefresh } = useCrmSidebarSignalStore();
  const { setRefreshFloorHeader } = useFloorPageHeaderStore();

  useEffect(() => {
    if (param.floorId) setValue("floorId", +param.floorId);
  }, [setValue, param.floorId]);

  const accept = async () => {
    const { floorId, code, level, name } = getValues();

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
      .catch((error) => handleErrors(error, toastRef));
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full pt-4 h-80 text-slate-100"
    >
      <CustomToast ref={toastRef} />
      <ScrollPanel style={{ height: "calc(72vh - 200px)" }} className="mb-5">
        <div className="flex justify-between w-full">
          <p className="w-full">Floor name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              {...register("name")}
              disabled={!isEditMode}
              placeholder="Ground Floor"
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full"></div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Floor code</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              {...register("code")}
              disabled={!isEditMode}
              placeholder="GF"
              maxLength={2}
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full"></div>
        </div>

        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Floor level</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              {...register("level")}
              disabled={!isEditMode}
              placeholder="0"
              className="w-full h-10 bg-inherit text-slate-100"
            />
          </IconField>
          <div className="flex items-center justify-end w-full"></div>
        </div>
      </ScrollPanel>
      <div className="flex justify-end gap-2">
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
          <Button
            className="w-52"
            type="button"
            onClick={() => setIsEditMode(true)}
            icon={`${PrimeIcons.USER_EDIT} mr-2 text-xl`}
          >
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default FloorSettingsPanel;
