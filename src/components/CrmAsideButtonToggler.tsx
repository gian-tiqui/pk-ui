import useCrmSidebarStore from "../@utils/store/crmSidebar";
import { Menu } from "lucide-react";

const CrmAsideButtonToggler = () => {
  const { isExpanded, setIsExpanded } = useCrmSidebarStore();

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="flex items-center justify-center w-12 h-12 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/80 hover:shadow-xl hover:scale-105"
    >
      <Menu className="w-5 h-5 text-gray-700" />
    </button>
  );
};

export default CrmAsideButtonToggler;
