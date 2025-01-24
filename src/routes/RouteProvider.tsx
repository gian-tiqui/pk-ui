import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Route as RouteType } from "../types/types";
import LandingPage from "../pages/LandingPage";
import MainPage from "../pages/MainPage";
import FindAmenityPage from "../pages/FindAmenityPage";
import QMEUP from "../pages/QMEUP";

const RouteProvider = () => {
  const routes: RouteType[] = [
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
      name: "Find Amenity",
      hidden: false,
      path: "/find-amenity",
      element: <FindAmenityPage />,
    },
    {
      name: "QMEUP",
      hidden: false,
      path: "/qmeup",
      element: <QMEUP />,
    },
  ];

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} element={route.element} path={route.path} />
        ))}
      </Routes>
    </Router>
  );
};

export default RouteProvider;
