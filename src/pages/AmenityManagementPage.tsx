import { useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useEffect } from "react";
import isAuthenticated from "../@utils/functions/isAuthenticated";
import useUserDataStore from "../@utils/store/userDataStore";

const AmenityManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useUserDataStore();

  useEffect(() => {
    if (isAuthenticated()) navigate("/amenity-management");
    else navigate("/");
  }, [navigate]);

  return (
    <PageTemplate>
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
          <small className="text-slate-300">Rooms without images</small>
        </section>
      </main>
    </PageTemplate>
  );
};

export default AmenityManagementPage;
