import { useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useEffect, useState } from "react";
import isAuthenticated from "../@utils/functions/isAuthenticated";
import useUserDataStore from "../@utils/store/userDataStore";
import isSessionExpired from "../@utils/functions/isSessionExpired";
import { Dialog } from "primereact/dialog";
import { Namespace } from "../@utils/enums/enum";
import Cookies from "js-cookie";
import AmenityManagementPageHeader from "../components/AmenityManagementPageHeader";
import AmenityManagementPageSection from "../components/AmenityManagementPageSection";

const AmenityManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useUserDataStore();
  const [counter, setCounter] = useState<number>(5);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated()) navigate("/amenity-management");
    else navigate("/");
  }, [navigate]);

  useEffect(() => {
    const checkSession = () => {
      if (isSessionExpired()) {
        setVisible(true);
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (visible) {
      setCounter(5);
      const timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setVisible(false);
            localStorage.removeItem(Namespace.BASE);
            Cookies.remove(Namespace.BASE);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [visible, navigate]);

  return (
    <PageTemplate>
      <Dialog
        pt={{
          header: {
            className:
              "bg-white/10 backdrop-blur-sm text-gray-800 border-t border-x border-white/20 rounded-t-2xl",
          },
          content: {
            className:
              "bg-white/10 backdrop-blur-sm text-gray-800 pt-5 border-x border-white/20 rounded-b-2xl",
          },
        }}
        visible={visible}
        onHide={() => setVisible(false)}
        header="Session expired"
        className="w-96"
      >
        <p className="font-medium text-center">
          Your session has expired. Going back to the main page in {counter}...
        </p>
      </Dialog>
      <main className="max-h-screen p-6 overflow-auto font-medium bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AmenityManagementPageHeader user={user} />
        <AmenityManagementPageSection />
      </main>
    </PageTemplate>
  );
};

export default AmenityManagementPage;
