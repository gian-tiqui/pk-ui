import PageTemplate from "../templates/PageTemplate";
import mountGraceLogo from "../assets/MGHI-StandAlone-Colored 1.png";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg 1.png";
import customWmcFacade from "../assets/Group 1 (1).png";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const services = ["Laboratory", "X-ray", "CT-scan", "Cardio"];

  return (
    <PageTemplate>
      <main className="grid w-full h-full grid-cols-4 p-7">
        <div className="flex flex-col justify-between h-full">
          <h3 className="text-2xl font-semibold">Westlake Medical Center</h3>
          <div>
            <h3 className="mb-2 text-4xl text-blue-700">
              Need diagnostic exams?
            </h3>
            <p className="text-xl">
              We offer the following{" "}
              <span className="text-blue-700">services:</span>
            </p>
            <ul className="mb-3 text-lg font-medium list-disc ms-10">
              {services.map((service: string, index: number) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
            <Button
              onClick={() => navigate("/order")}
              icon={`${PrimeIcons.SHOPPING_CART} text-2xl`}
              className="justify-center gap-2 text-xl font-medium text-black bg-white border-none rounded-full shadow h-11 w-44"
            >
              Click here
            </Button>
          </div>
          <Image src={mountGraceLogo} height="190" width="190" />
        </div>
        <div className="relative flex justify-center h-full col-span-2">
          <Image
            src={wmcLogo}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            height="120"
            width="120"
          />

          <Image src={customWmcFacade} className="w-[82%] h-96" />
        </div>
        <div className="flex flex-col items-end w-full h-full">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="Search..."
              className="w-64 h-10 rounded-full"
            />
          </IconField>
          <div className="flex flex-col items-end justify-between w-full h-full gap-3 pt-10 cursor-pointer">
            <div
              onClick={() => navigate("/qmeup")}
              className="h-[30%] w-80 bg-blue-600 shadow rounded-2xl flex flex-col justify-between p-4"
            >
              <i className={`${PrimeIcons.TICKET} text-3xl`}></i>

              <p className="w-64 text-xl font-semibold text-white">
                Need a <span className="text-black">Queueing number?</span>{" "}
                Click me
              </p>
            </div>
            <div className="h-[30%] w-80 bg-white shadow rounded-2xl flex flex-col justify-between p-4">
              <i className={`${PrimeIcons.MAP_MARKER} text-3xl`}></i>

              <p className="w-64 text-xl font-semibold text-black">
                <span className="text-blue-700">Explore</span> our hospital
                using our <span className="text-blue-700">directory</span>
              </p>
            </div>
            <div
              onClick={() => navigate("/scheduler")}
              className="h-[30%] w-80 bg-white shadow rounded-2xl flex flex-col justify-between p-4"
            >
              <i className={`${PrimeIcons.CALENDAR} text-3xl`}></i>
              <p className="w-64 text-xl font-semibold text-black">
                <span className="text-blue-700">Schedule</span> an appointment
                from our <span className="text-blue-700">Doctors</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageTemplate>
  );
};

export default MainPage;
