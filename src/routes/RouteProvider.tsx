import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Route as RouteType } from "../types/types";
import LandingPage from "../pages/LandingPage";
import MainPage from "../pages/MainPage";
import FindAmenityPage from "../pages/FindAmenityPage";
import LoginPage from "../pages/LoginPage";
import CrmSidebar from "../components/CrmSidebar";
import AmenityManagementPage from "../pages/AmenityManagementPage";
import NotFoundPage from "../pages/NotFoundPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import FloorPage from "../pages/FloorPage";
import QmeupPage from "../pages/QmeupPage";
import UserManagement from "../pages/UserManagement";
import { useEffect, useRef, useState } from "react";
import isServerRunning from "../@utils/functions/checkServerStatus";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import CustomToast from "../components/CustomToast";
import { PrimeIcons } from "primereact/api";
import OrderPage from "../pages/OrderPage";

const RouteProvider = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toastRef = useRef<Toast>(null);
  const routes: RouteType[] = [
    {
      name: "Not Found Page",
      hidden: false,
      path: "*",
      element: <NotFoundPage />,
    },
    {
      name: "Landing Page",
      hidden: false,
      path: "/",
      element: <LandingPage />,
    },
    {
      name: "Main Page",
      hidden: false,
      path: "/main",
      element: <MainPage />,
    },
    {
      name: "Find Amenity Page",
      hidden: false,
      path: "/find-amenity",
      element: <FindAmenityPage />,
    },
    {
      name: "QMEUP Page",
      hidden: false,
      path: "/qmeup",
      element: <QmeupPage />,
    },
    {
      name: "Login Page",
      hidden: true,
      path: "/login",
      element: <LoginPage />,
    },
    {
      name: "Amenity Management Page",
      hidden: true,
      path: "/amenity-management",
      element: <AmenityManagementPage />,
    },
    {
      name: "Forgot Password Page",
      hidden: true,
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      name: "Selected Floor",
      hidden: true,
      path: "amenity-management/:floorId",
      element: <FloorPage />,
    },
    {
      name: "User Management Page",
      hidden: true,
      path: "user-management",
      element: <UserManagement />,
    },
    {
      name: "Ordering Page",
      hidden: true,
      path: "order",
      element: <OrderPage />,
    },
  ];

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
          ></i>
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
      <CrmSidebar>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} element={route.element} path={route.path} />
          ))}
        </Routes>
      </CrmSidebar>
    </Router>
  );
};

export default RouteProvider;
