import { TabView, TabPanel } from "primereact/tabview";
import { Panel } from "../types/types";
import FloorSettingsPanel from "./FloorSettingsPanel";
import RoomsPanel from "./RoomsPanel";
import DeletedRoomsPanel from "./DeletedRoomsPanel";
import FloorMapTab from "./FloorMapTab";
import { Home, Map, Trash2, Settings } from "lucide-react";

const FloorPageContent = () => {
  const roomPanels: Panel[] = [
    {
      header: "Rooms",
      icon: <Home className="w-4 h-4 mr-2" />,
      panel: <RoomsPanel />,
    },
    {
      header: "Floor Map",
      icon: <Map className="w-4 h-4 mr-2" />,
      panel: <FloorMapTab />,
    },
    {
      header: "Deleted Rooms",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      panel: <DeletedRoomsPanel />,
    },
    {
      header: "Floor Settings",
      icon: <Settings className="w-4 h-4 mr-2" />,
      panel: <FloorSettingsPanel />,
    },
  ];

  return (
    <div className="flex-1 p-6 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-slate-200/60">
      <TabView
        pt={{
          panelContainer: {
            className: "h-full w-full bg-transparent border-none",
          },
          nav: {
            className: "w-full bg-transparent border-none mb-4",
          },
          navContent: {
            className: "bg-transparent border-none",
          },
          tab: {
            className: "bg-transparent border-none",
          },
        }}
      >
        {roomPanels.map((roomPanel, index) => (
          <TabPanel
            header={
              <div className="flex items-center px-4 py-2 transition-all duration-300 text-slate-700 rounded-xl hover:bg-slate-100/60">
                {typeof roomPanel.icon === "function" ? null : roomPanel.icon}
                {roomPanel.header}
              </div>
            }
            key={index}
            pt={{
              headerAction: {
                className:
                  "bg-transparent border-none text-slate-700 hover:bg-slate-100/60 rounded-xl transition-all duration-300",
              },
              content: {
                className: "bg-transparent border-none p-0",
              },
            }}
          >
            <div className="h-full">{roomPanel.panel}</div>
          </TabPanel>
        ))}
      </TabView>
    </div>
  );
};

export default FloorPageContent;
