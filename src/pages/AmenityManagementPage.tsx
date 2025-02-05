import { useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useEffect, useState } from "react";
import isAuthenticated from "../@utils/functions/isAuthenticated";
import useUserDataStore from "../@utils/store/userDataStore";
import isSessionExpired from "../@utils/functions/isSessionExpired";
import { Dialog } from "primereact/dialog";
import { Namespace } from "../@utils/enums/enum";
import Cookies from "js-cookie";

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
              "bg-slate-900 text-slate-100 border-t border-x border-slate-700",
          },
          content: {
            className:
              "bg-slate-900 text-slate-100 pt-5 border-x border-slate-700",
          },
        }}
        visible={visible}
        onHide={() => setVisible(false)}
        header="Session expired"
        className="w-96"
      >
        <p className="text-center">
          Your session has expired. Going back to the main page in {counter}...
        </p>
      </Dialog>
      <main className="p-10 overflow-y-auto font-medium">
        <header className="mt-16 mb-14">
          <h4 className="text-3xl text-center">
            Welcome back,{" "}
            <span className="text-blue-400">{user?.firstName}</span>
          </h4>
        </header>
        <section className="flex flex-col mb-6">
          <small className="text-slate-300">Recently added floors</small>
          <small className="text-slate-300">Floors without rooms</small>
        </section>
      </main>
    </PageTemplate>
  );
};

export default AmenityManagementPage;
