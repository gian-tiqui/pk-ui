import { ScrollPanel } from "primereact/scrollpanel";
import { useQuery } from "@tanstack/react-query";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { getFloors } from "../@utils/services/floorService";
import { Query } from "../types/types";
import useCrmSidebarSignalStore from "../@utils/store/crmSidebarSectionSignal";
import { useNavigate } from "react-router-dom";
import useUserDataStore from "../@utils/store/userDataStore";
import { Department } from "../@utils/enums/enum";
import CrmMarketingSidebarSection from "./CrmMarketingSidebarSection";
import ITSidebarSection from "./ITSidebarSection";

interface Props {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const CrmSidebarSection: React.FC<Props> = ({ setVisible }) => {
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [query, setQuery] = useState<Query>({});
  const { refresh, setRefresh } = useCrmSidebarSignalStore();
  const scrollPanelRef = useRef<ScrollPanel>(null);
  const navigate = useNavigate();
  const { user } = useUserDataStore();

  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: [`floors-${JSON.stringify(query)}`],
    queryFn: () => getFloors(query),
  });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollPanelRef.current) {
        const content = scrollPanelRef.current.getContent();
        if (data?.floors && data?.floors.length < 10) return;
        if (content) {
          const { scrollTop, scrollHeight, clientHeight } = content;
          if (scrollTop + clientHeight >= scrollHeight - 1) {
            setQuery((prevQuery) => {
              if (prevQuery.limit) {
                return {
                  ...prevQuery,
                  limit: prevQuery.limit + 10,
                };
              }

              return {
                ...prevQuery,
                limit: 20,
              };
            });
          }
        }
      }
    };

    const content = scrollPanelRef.current?.getContent();
    if (content) {
      content.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (content) {
        content.removeEventListener("scroll", handleScroll);
      }
    };
  }, [data]);

  useEffect(() => {
    if (refresh === true) {
      refetch();
    }

    return () => setRefresh(false);
  }, [refresh, setRefresh, refetch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({ search: searchTerm });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  const sectionProps = {
    data,
    isError,
    isLoading,
    navigate,
    scrollPanelRef,
    selectedId,
    setSearchTerm,
    setSelectedId,
    setVisible,
  };

  return (
    <div className="h-full p-4">
      {(() => {
        switch (user?.deptId) {
          case Department.IT:
            return <ITSidebarSection />;
          case Department.MRKT:
            return <CrmMarketingSidebarSection {...sectionProps} />;
          case Department.SSD:
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                    <span className="text-lg font-bold text-white">SSD</span>
                  </div>
                  <p className="text-sm text-gray-600">SSD Department</p>
                </div>
              </div>
            );
          default:
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-600">
                    <span className="text-lg font-bold text-white">?</span>
                  </div>
                  <p className="text-sm text-gray-600">Unknown Department</p>
                </div>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default CrmSidebarSection;
