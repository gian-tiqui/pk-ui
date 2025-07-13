import React, { ReactNode } from "react";
import useLoggedInStore from "../@utils/store/loggedIn";
import PageTemplate from "../templates/PageTemplate";
import CrmAside from "./CrmAside";
import useCrmSidebarStore from "../@utils/store/crmSidebar";
import CrmAsideButtonToggler from "./CrmAsideButtonToggler";

interface Props {
  children?: ReactNode;
}

const CrmSidebar: React.FC<Props> = ({ children }) => {
  const { isLoggedIn } = useLoggedInStore();
  const { isExpanded } = useCrmSidebarStore();

  if (!isLoggedIn) return children;

  return (
    <PageTemplate>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {isExpanded === false && (
          <div className="absolute z-10 top-6 left-6">
            <CrmAsideButtonToggler />
          </div>
        )}
        {isExpanded && <CrmAside />}
        <main className="flex-1 transition-all duration-300">{children}</main>
      </div>
    </PageTemplate>
  );
};

export default CrmSidebar;
