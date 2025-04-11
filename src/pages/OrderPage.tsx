import { useEffect, useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import { Item, Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import getAllItems from "../@utils/services/itemService";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import ItemButton from "../components/ItemButton";

const OrderPage = () => {
  const [query, setQuery] = useState<Query>({
    search: "",
    offset: 0,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const interval = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    }, 700);

    return () => clearInterval(interval);
  }, [searchTerm]);

  const { data: itemsData } = useQuery({
    queryKey: [`items-${JSON.stringify(query)}`],
    queryFn: () => getAllItems(query),
  });

  useEffect(() => {
    console.log(query);
    console.log(itemsData?.data.items);
  }, [itemsData, query]);

  return (
    <PageTemplate>
      <div className="w-full h-screen ">
        <InputText
          className="mb-6"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <div className="flex flex-col gap-2 overflow-auto h-96">
          {itemsData?.data.items &&
            itemsData.data.items.length > 0 &&
            itemsData.data.items.map((item: Item) => (
              <ItemButton item={item} key={item.code} />
            ))}
        </div>
      </div>
    </PageTemplate>
  );
};

export default OrderPage;
