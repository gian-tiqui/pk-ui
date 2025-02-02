import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Route as RouteType } from "../types/types";
import LandingPage from "../pages/LandingPage";
import MainPage from "../pages/MainPage";
import FindAmenityPage from "../pages/FindAmenityPage";
import QMEUP from "../pages/QMEUP";
import LoginPage from "../pages/LoginPage";
import CrmSidebar from "../components/CrmSidebar";
import AmenityManagementPage from "../pages/AmenityManagementPage";
import NotFoundPage from "../pages/NotFoundPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

const RouteProvider = () => {
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
      element: <QMEUP />,
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
  ];

  return (
    <Router>
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
