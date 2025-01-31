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
        <section className="mb-6">
          <small className="text-slate-300">Recently added floors</small>
          <div className="flex gap-2 overflow-auto">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div className="aspect-[19/12]" key={index}>
                  <img
                    className="w-full h-full"
                    alt="random image"
                    src="data:image/jpeg;base64,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"
                  />
                </div>
              ))}
          </div>
        </section>
      </main>
    </PageTemplate>
  );
};

export default AmenityManagementPage;
