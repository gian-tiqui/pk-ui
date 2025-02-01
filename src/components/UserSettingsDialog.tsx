import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import React, { Dispatch, SetStateAction } from "react";
import { SettingsPanel } from "../types/types";
import SettingsDetail from "./YourProfile";
import ChangePassword from "./ChangePassword";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const SettingsDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const settingsPanels: SettingsPanel[] = [
    {
      header: "Your Profile",
      panel: <SettingsDetail />,
    },
    {
      header: "Change Password",
      panel: <ChangePassword />,
    },
    {
      header: "Recovery Method",
      panel: null,
    },
  ];

  return (
    <Dialog
      className="w-80 md:w-[80%] h-[85vh]"
      pt={{
        header: {
          className:
            "bg-slate-900 text-slate-100 border-x border-t border-slate-700",
        },
        content: {
          className:
            "bg-slate-900 text-slate-100 border-x border-b border-slate-700",
        },
      }}
      visible={visible}
      onHide={() => {
        if (visible === true) setVisible(false);
      }}
      header="User Settings"
    >
      <TabView
        pt={{
          panelContainer: { className: "h-80 w-full bg-inherit" },
          nav: { className: "w-full bg-inherit" },
          tab: { className: "w-full bg-inherit" },
        }}
      >
        {settingsPanels.map((settingsPanel, index) => (
          <TabPanel
            key={index}
            header={settingsPanel.header}
            className="text-slate-100"
            pt={{ headerAction: { className: "bg-inherit" } }}
          >
            {settingsPanel.panel}
          </TabPanel>
        ))}
      </TabView>
    </Dialog>
  );
};

export default SettingsDialog;
