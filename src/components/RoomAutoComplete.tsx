import {
  AutoCompleteCompleteEvent,
  AutoComplete,
} from "primereact/autocomplete";
import { useState } from "react";

const RoomAutoComplete = () => {
  const [value, setValue] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    setItems([...Array(10).keys()].map((item) => event.query + "-" + item));
  };

  return (
    <AutoComplete
      placeholder="Search a room here"
      loadingIcon="pi pi-spinner pi-spin"
      value={value}
      suggestions={items}
      completeMethod={search}
      onChange={(e) => setValue(e.value)}
      pt={{
        input: {
          root: {
            className: "bg-inherit border border-slate-600 text-slate-100",
          },
        },
        panel: { className: "bg-slate-800" },
        item: { className: "text-slate-100 px-4 py-2" },
      }}
    />
  );
};

export default RoomAutoComplete;
