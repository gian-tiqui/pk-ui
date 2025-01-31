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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "../@utils/services/departmentService";

const SettingsDetail = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [query, setQuery] = useState<Query>({});
  const { handleSubmit } = useForm();
  const toastRef = useRef<Toast>(null);

  const { data: departments } = useQuery({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => getDepartments(query),
  });

  useEffect(() => {
    console.log(query);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({ search: searchTerm });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img
            alt={option.name}
            src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
            className={`mr-2 flag flag-${option.code.toLowerCase()}`}
            style={{ width: "18px" }}
          />
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.name}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px" }}
        />
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
            disabled={!isEditMode}
            className="w-full h-12 bg-inherit border-slate-400"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.value)}
            options={departments}
            optionLabel="name"
            placeholder="Select a department"
            filter
            valueTemplate={selectedCountryTemplate}
            itemTemplate={countryOptionTemplate}
          />
          <div className="w-full"></div>
        </div>
        <Divider />
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
