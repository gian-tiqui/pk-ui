import PageTemplate from "../templates/PageTemplate";
import { useNavigate } from "react-router-dom";
import HiddenLoginButton from "../components/HiddenLoginButton";
import useLoggedInStore from "../@utils/store/loggedIn";
import { useEffect } from "react";
import useUserDataStore from "../@utils/store/userDataStore";
import navigateUserByDeptId from "../@utils/functions/userNavigator";
import wmcLogo from "../assets/wmc-logo 1.png";
import wmcFacade from "../assets/Hospital Facade Edited 2 1.png";
import { Image } from "primereact/image";
import { Button } from "primereact/button";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useLoggedInStore();
  const { user } = useUserDataStore();

  useEffect(() => {
    if (isLoggedIn) navigateUserByDeptId(user, navigate);
  }, [isLoggedIn, navigate, user]);

  return (
    <PageTemplate>
      <HiddenLoginButton />
      <main className="flex items-center justify-between w-full h-screen p-6">
        <Image
          src={wmcLogo}
          className="absolute top-6 left-6"
          height="80"
          width="80"
        />
        <div>
          <h4 className="mb-3 text-4xl font-medium">Introducing ...</h4>
          <h2 className="mb-3 text-6xl font-semibold text-blue-700">
            WMC Patient Kiosk
          </h2>
          <h4 className="mb-6 text-4xl font-medium">
            Our <span className="font-semibold text-blue-700">care</span> at
            your <span className="font-semibold text-blue-700">fingertips</span>
          </h4>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/main")}
              className="justify-center px-10 text-xl font-bold bg-blue-700 shadow rounded-xl"
            >
              Get Started
            </Button>
            <Button
              onClick={() => {
                window.open("https://westlakemed.com.ph", "_blank");
              }}
              className="justify-center px-10 text-xl font-bold text-blue-700 bg-white border-none shadow rounded-xl"
            >
              Westlake Medical Center
            </Button>
          </div>
        </div>
        <Image src={wmcFacade} height="350" width="350" />
      </main>
    </PageTemplate>
  );
};

export default LandingPage;
