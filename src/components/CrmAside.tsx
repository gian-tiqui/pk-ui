import { useState } from "react";
import AddFloorDialog from "./AddFloorDialog";

import CrmSidebarFooter from "./CrmSidebarFooter";
import CrmSidebarHeader from "./CrmSidebarHeader";
import CrmSidebarSection from "./CrmSidebarSection";

const CrmAside = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <aside className="relative flex flex-col h-screen py-5 border-r rounded-e-3xl border-slate-700 w-80 bg-slate-900">
      <AddFloorDialog
        visible={visible}
        setVisible={setVisible}
        onHide={() => setVisible(false)}
      />
      <CrmSidebarHeader />
      <CrmSidebarSection setVisible={setVisible} />
      <hr className="mx-5 mb-3 border-b border-slate-700" />
      <CrmSidebarFooter />
    </aside>
  );
};

export default CrmAside;
