import { Button } from "primereact/button";
import PageTemplate from "../templates/PageTemplate";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import HiddenLoginButton from "../components/HiddenLoginButton";
import useLoggedInStore from "../@utils/store/loggedIn";
import { useEffect } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import navigateUserByDeptId from "../@utils/functions/userNavigator";
import { URI } from "../@utils/enums/enum";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useLoggedInStore();
  const { user } = useUserDataStore();

  useEffect(() => {
    if (isLoggedIn) navigateUserByDeptId(user, navigate);
  }, [isLoggedIn, navigate, user]);

  useEffect(() => {
    console.log("API BASE URI FROM enum.ts: ", URI.API_URI);
    console.log("API BASE FROM .env:", import.meta.env.VITE_API_URI);
  }, []);

  return (
    <PageTemplate>
      <HiddenLoginButton />
      <main className="grid h-full place-content-center">
        <section className="flex flex-col items-center gap-12">
          <p className="text-4xl font-medium">Welcome to the</p>

          <h4 className="text-5xl font-bold tracking-tighter text-blue-400">
            Westlake Medical Center{" "}
            <span className="text-slate-100">Patient Kiosk</span>
          </h4>
          <Button
            onClick={() => navigate("/main")}
            className="flex justify-center text-xl font-bold w-72"
            icon={`pi pi-ethereum me-2 text-xl`}
          >
            Get Started
          </Button>
        </section>
      </main>
      <Footer />
    </PageTemplate>
  );
};

export default LandingPage;
