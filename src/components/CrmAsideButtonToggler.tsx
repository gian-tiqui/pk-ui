import { PrimeIcons } from "primereact/api";
import useCrmSidebarStore from "../@utils/store/crmSidebar";

const CrmAsideButtonToggler = () => {
  const { isExpanded, setIsExpanded } = useCrmSidebarStore();

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="grid w-10 h-10 rounded-lg hover:cursor-pointer hover:bg-slate-700 place-content-center"
    >
      <i className={`${PrimeIcons.BARS} text-xl my-auto`}></i>
    </div>
  );
};

export default CrmAsideButtonToggler;
