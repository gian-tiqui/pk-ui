import { PrimeIcons } from "primereact/api";
import { TabView, TabPanel } from "primereact/tabview";
import { Panel } from "../types/types";
import FloorSettingsPanel from "./FloorSettingsPanel";
import RoomsPanel from "./RoomsPanel";
import DeletedRoomsPanel from "./DeletedRoomsPanel";

const FloorPageContent = () => {
  const roomPanels: Panel[] = [
    { header: "Rooms", icon: `${PrimeIcons.HOME} me-2`, panel: <RoomsPanel /> },

    {
      header: "Deleted Rooms",
      icon: `${PrimeIcons.TRASH} me-2`,
      panel: <DeletedRoomsPanel />,
    },
    {
      header: "Floor Settings",
      icon: `${PrimeIcons.COG} me-2`,
      panel: <FloorSettingsPanel />,
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

export default FloorPageContent;
