import React, { Dispatch, SetStateAction, useState } from "react";
import { Floor } from "../types/types";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import AddRoomDialog from "./AddRoomDialog";

interface Props {
  floor?: Floor;
  setSearchInput: Dispatch<SetStateAction<string>>;
}

const FloorPageHeader: React.FC<Props> = ({ floor, setSearchInput }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <header className="flex items-center w-full h-20 mb-8 ">
      <AddRoomDialog visible={visible} setVisible={setVisible} />
      <div className="flex items-center flex-1 w-full h-20 gap-4">
        <div className="grid w-20 h-20 text-4xl font-bold bg-blue-500 rounded-lg place-content-center">
          {floor?.code}
        </div>
        <div>
          <h4 className="text-4xl font-medium">{floor?.name}</h4>
          <p className="font-medium">Floor Level: {floor?.level}</p>
        </div>
      </div>
      <div className="flex justify-center flex-1">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            className="border bg-inherit border-slate-600 text-slate-100"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </IconField>
      </div>
      <div className="flex justify-end flex-1">
        <Button
          icon="pi pi-plus text-xl"
          onClick={() => setVisible(true)}
        ></Button>
      </div>
    </header>
  );
};

export default FloorPageHeader;
