import React, { useEffect, useState } from "react";
import { Doctor, Item, Query } from "../types/types";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useQuery } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import getAllDoctors from "../@utils/services/doctorService";

interface Props {
  item: Item;
}

const ItemButton: React.FC<Props> = ({ item }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [query, setQuery] = useState<Query>({
    search: "",
    offset: 0,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: doctorsData } = useQuery({
    queryKey: [`doctors-${JSON.stringify(query)}`],
    queryFn: () => getAllDoctors(query),
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    }, 700);

    return () => clearTimeout(interval);
  }, [searchTerm]);

  return (
    <>
      <Dialog
        header={`${item.description}`}
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        className="h-full w-96"
      >
        <InputText
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          className="w-full"
        />
        <div className="flex flex-col gap-2 mt-2 overflow-auto">
          {doctorsData?.data.doctors &&
            doctorsData.data.doctors.length > 0 &&
            doctorsData.data.doctors.map((doctor: Doctor) => (
              <Button className="h-12">{`${doctor.firstName} ${doctor.lastName}`}</Button>
            ))}
        </div>
      </Dialog>
      <Button
        className="h-12"
        onClick={() => {
          setVisible(true);
        }}
      >
        {item.description}
      </Button>
    </>
  );
};

export default ItemButton;
