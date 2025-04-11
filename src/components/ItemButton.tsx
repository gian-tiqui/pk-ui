import React, { useState } from "react";
import { Item } from "../types/types";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface Props {
  item: Item;
}

const ItemButton: React.FC<Props> = ({ item }) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      <Dialog
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
      >
        {JSON.stringify(item)}
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
