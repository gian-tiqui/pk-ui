import { PrimeIcons } from "primereact/api";
import { TabView, TabPanel } from "primereact/tabview";
import { Panel } from "../types/types";
import RoomSettingsTab from "./RoomSettingsTab";
import React, { Dispatch, SetStateAction } from "react";
import RoomCanvasTab from "./RoomCanvasTab";
import RoomDetailsTab from "./RoomDetailsTab";
import RoomImagesTab from "./RoomImagesTab";
import RoomDirectionsTab from "./RoomDirectionsTab";

interface Props {
  roomId: number;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const RoomSettingsTabView: React.FC<Props> = ({ roomId, setVisible }) => {
  const roomPanels: Panel[] = [
    {
      header: "Details",
      icon: `${PrimeIcons.HOME} me-2`,
      panel: <RoomDetailsTab roomId={roomId} />,
    },
    {
      header: "Images",
      icon: `${PrimeIcons.IMAGE} me-2`,
      panel: <RoomImagesTab roomId={roomId} />,
    },
    {
      header: "Directions",
      icon: `${PrimeIcons.COMPASS} me-2`,
      panel: <RoomDirectionsTab roomId={roomId} />,
    },
    {
      header: "Canvas",
      icon: `${PrimeIcons.IMAGES} me-2`,
      panel: <RoomCanvasTab roomId={roomId} />,
    },
    {
      header: "Settings",
      icon: `${PrimeIcons.COG} me-2`,
      panel: <RoomSettingsTab roomId={roomId} setVisible={setVisible} />,
    },
  ];

  return (
    <TabView
      pt={{
        panelContainer: { className: "h-80 w-full bg-inherit" },
        nav: { className: "w-full bg-inherit" },
        tab: { className: "w-full bg-inherit" },
      }}
    >
      {roomPanels.map((roomPanel, index) => (
        <TabPanel
          header={roomPanel.header}
          key={index}
          leftIcon={roomPanel.icon}
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          {roomPanel.panel}
        </TabPanel>
      ))}
    </TabView>
  );
};

export default RoomSettingsTabView;
