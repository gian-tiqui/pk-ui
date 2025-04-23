// AppRoutes.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import CrmSidebar from "../components/CrmSidebar";
import NotFoundPage from "../pages/NotFoundPage";
import LandingPage from "../pages/LandingPage";
import MainPage from "../pages/MainPage";
import FindAmenityPage from "../pages/FindAmenityPage";
import LoginPage from "../pages/LoginPage";
import AmenityManagementPage from "../pages/AmenityManagementPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import FloorPage from "../pages/FloorPage";
import QmeupPage from "../pages/QmeupPage";
import UserManagement from "../pages/UserManagement";
import OrderPage from "../pages/OrderPage";
import SchedulerPage from "../pages/SchedulerScreen";
import { Route as RouteType } from "../types/types";

const AppRoutes = () => {
  const location = useLocation();
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
    { name: "Main Page", hidden: false, path: "/main", element: <MainPage /> },
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
    {
      name: "Scheduler Screen",
      hidden: true,
      path: "scheduler",
      element: <SchedulerPage />,
    },
  ];

  return (
    <CrmSidebar>
      <Routes location={location} key={location.pathname}>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </CrmSidebar>
  );
};

export default AppRoutes;
