import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { PrimeIcons } from "primereact/api";
import CustomToast from "../components/CustomToast";
import isServerRunning from "../@utils/functions/checkServerStatus";
import AppRoutes from "./AppRoutes"; // <== import the new component

const RouteProvider = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const checkServerStatus = async () => {
      const running = await isServerRunning();
      setIsLoading(false);
      if (!running) setVisible(true);
    };
    checkServerStatus();
  }, []);

  return (
    <Router>
      {isLoading && (
        <div className="absolute z-50 grid w-full h-screen bg-black/50 place-content-center">
          <i
            className={`${PrimeIcons.SPINNER} pi-spin text-[100px] text-slate-100`}
          />
        </div>
      )}
      <CustomToast ref={toastRef} />
      <Dialog
        visible={visible}
        onHide={async () => {
          setIsLoading(true);
          const running = await isServerRunning();
          setIsLoading(false);
          if (!running) {
            toastRef.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Server is still down",
            });
            return;
          }
          setVisible(false);
        }}
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
        header="Server Error"
      >
        Server is currently down at the moment
      </Dialog>
      <AppRoutes /> {/* ✅ Use your routes here */}
    </Router>
  );
};

export default RouteProvider;
