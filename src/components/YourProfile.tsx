import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../@utils/services/departmentService";

const SettingsDetail = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>();

  const { handleSubmit } = useForm();
  const toastRef = useRef<Toast>(null);

  const { data: departments } = useQuery({
    queryKey: [`departments-dropdown`],
    queryFn: () => getDepartments({ search: "" }),
  });

  const accept = () => {
    setIsEditMode(false);
  };

  const onSubmit = () => {
    confirmDialog({
      message: "Do you want save the changes?",
      header: "Update profile",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const selectedDepartmentTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex w-full gap-2">
          <div>{option.code}</div>
          <div>{option.name}</div>
        </div>
      );
    }

    return <span className="bg-slate-800">{props.placeholder}</span>;
  };

  const departmentOptionTemplate = (option) => {
    return (
      <div className="flex w-full gap-2">
        <div>{option.code}</div>
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-4 h-80">
      <Toast ref={toastRef} />
      <ScrollPanel style={{ height: "calc(72vh - 200px)" }} className="mb-5">
        <div className="flex justify-between w-full">
          <p className="w-full">First name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              disabled={!isEditMode}
              placeholder="Jonathan"
              className="w-full h-10 bg-inherit"
            />
          </IconField>
          <div className="w-full"></div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Middle name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              disabled={!isEditMode}
              placeholder="Jason"
              className="w-full h-10 bg-inherit"
            />
          </IconField>
          <div className="w-full"></div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Last name</p>
          <IconField iconPosition="left" className="w-full">
            <InputIcon className={PrimeIcons.USER}> </InputIcon>
            <InputText
              disabled={!isEditMode}
              placeholder="Ric"
              className="w-full h-10 bg-inherit"
            />
          </IconField>
          <div className="w-full"></div>
        </div>
        <Divider />

        <div className="flex justify-between w-full">
          <p className="w-full">Department</p>
          <Dropdown
            pt={{
              header: { className: "bg-slate-800" },
              filterInput: { className: "bg-inherit text-slate-100" },
              list: { className: "bg-slate-800" },
              item: {
                className:
                  "text-slate-100 focus:bg-slate-700 focus:text-slate-100",
              },
            }}
            disabled={!isEditMode}
            className="w-full h-12 bg-inherit border-slate-400"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.value)}
            options={departments}
            optionLabel="name"
            placeholder="Select a department"
            filter
            valueTemplate={selectedDepartmentTemplate}
            itemTemplate={departmentOptionTemplate}
          />

          <div className="w-full"></div>
        </div>
      </ScrollPanel>
      <div className="flex justify-end gap-2">
        {isEditMode && (
          <Button
            className="w-52"
            severity="danger"
            type="button"
            onClick={() => setIsEditMode(false)}
          >
            Cancel
          </Button>
        )}
        {isEditMode && (
          <Button className="w-52" type="submit">
            Save
          </Button>
        )}
        {!isEditMode && (
          <Button
            className="w-52"
            type="button"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default SettingsDetail;
