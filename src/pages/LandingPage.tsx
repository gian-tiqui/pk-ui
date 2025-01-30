import { Button } from "primereact/button";
import PageTemplate from "../templates/PageTemplate";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import HiddenLoginButton from "../components/HiddenLoginButton";

const LandingPage = () => {
  const navigate = useNavigate();

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
