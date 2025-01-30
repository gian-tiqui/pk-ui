import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import { useForm } from "react-hook-form";

interface Props {
  visible: boolean;
  onHide: () => void;
}

interface FormFields {
  name: string;
  level: number;
  code: string;
}

const AddFloorDialog: React.FC<Props> = ({ visible, onHide }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormFields>();

  const handleAddFloorClicked = ({ name, level, code }: FormFields) => {};

  return (
    <Dialog
      header="Add a floor"
      visible={visible}
      onHide={onHide}
      className="p-4 w-96"
      pt={{
        header: {
          className:
            "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 pt-5 border-x border-slate-700 shadow-sm shadow-blue-400",
        },
      }}
    >
      <form onSubmit={handleSubmit(handleAddFloorClicked)}>
        <Button
          type="submit"
          className="justify-center w-full h-10 gap-2 font-medium"
          icon={`${PrimeIcons.PLUS}`}
        >
          Create floor
        </Button>
      </form>
    </Dialog>
  );
};

export default AddFloorDialog;
