import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const RoomTabTemplate: React.FC<Props> = ({ children }) => {
  return <div className="items-center overflow-auto h-80">{children}</div>;
};

export default RoomTabTemplate;
