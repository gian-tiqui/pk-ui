import { PrimeIcons } from "primereact/api";
import { TabView, TabPanel } from "primereact/tabview";
import { Panel } from "../types/types";

const RoomSettingsTabView = () => {
  const roomPanels: Panel[] = [
    { header: "Details", icon: `${PrimeIcons.HOME} me-2`, panel: null },
    { header: "Image", icon: `${PrimeIcons.IMAGE} me-2`, panel: null },
    { header: "Images", icon: `${PrimeIcons.IMAGES} me-2`, panel: null },
    { header: "Settings", icon: `${PrimeIcons.COG} me-2`, panel: null },
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
