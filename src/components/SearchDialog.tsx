import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import React, { Dispatch, SetStateAction } from "react";
import SearchResults from "./SearchResults";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const SearchDialog: React.FC<Props> = ({ visible, setVisible }) => {
  return (
    <Dialog
      visible={visible}
      header="What would you like to find?"
      onHide={() => {
        if (visible) setVisible(false);
      }}
      className="w-96 h-96"
      pt={{
        content: {
          className:
            "border-b border-l border-r pt-2 bg-slate-900 h-56 border-slate-700",
        },
        header: {
          className:
            "bg-slate-900 text-slate-100 border-t border-l border-r border-slate-700",
        },
      }}
    >
      <IconField iconPosition="left" className="mb-5">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          placeholder="Search..."
          className="w-full bg-inherit placeholder-slate-300 text-slate-100 border-slate-600"
        />
      </IconField>

      <SearchResults />
    </Dialog>
  );
};

export default SearchDialog;
