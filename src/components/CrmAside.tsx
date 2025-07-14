import { useState } from "react";
import AddFloorDialog from "./AddFloorDialog";
import CrmSidebarFooter from "./CrmSidebarFooter";
import CrmSidebarHeader from "./CrmSidebarHeader";
import CrmSidebarSection from "./CrmSidebarSection";

const CrmAside = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <>
      <AddFloorDialog
        visible={visible}
        setVisible={setVisible}
        onHide={() => setVisible(false)}
      />
      <aside className="relative flex flex-col h-screen border border-r shadow-2xl border-gray-300/50 s w-80 bg-white/30 backdrop-blur-md">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <CrmSidebarHeader />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <CrmSidebarSection setVisible={setVisible} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/10">
          <CrmSidebarFooter />
        </div>
      </aside>
    </>
  );
};

export default CrmAside;
