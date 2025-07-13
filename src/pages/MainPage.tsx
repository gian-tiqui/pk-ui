import PageTemplate from "../templates/PageTemplate";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const services = ["Laboratory", "X-ray", "CT-scan", "Cardio"];

  return (
    <PageTemplate>
      <main className="flex flex-col h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">
            Westlake Medical Center
          </h1>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        </div>

        {/* Main Content - Fixed Height Grid */}
        <div className="grid flex-1 w-full grid-cols-3 gap-6 mx-auto max-w-7xl">
          {/* Services Section */}
          <div className="flex flex-col col-span-2">
            <div className="flex flex-col flex-1 p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20">
              <h2 className="mb-3 text-2xl font-bold text-gray-800">
                <span className="text-blue-600">Diagnostic</span> Services
              </h2>
              <p className="mb-4 text-lg text-gray-600">
                We offer comprehensive medical services for your health needs
              </p>

              <div className="grid flex-1 grid-cols-2 gap-3 mb-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-4 text-lg font-semibold text-center text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl hover:scale-105"
                  >
                    {service}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => navigate("/order")}
                icon={`${PrimeIcons.SHOPPING_CART}`}
                className="justify-center w-full gap-3 text-xl font-semibold text-white transition-all duration-300 transform border-none shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl h-14 hover:from-emerald-600 hover:to-teal-700 hover:scale-105"
              >
                Order Services
              </Button>
            </div>
          </div>

          {/* Action Cards */}
          <div className="flex flex-col gap-4">
            <div
              onClick={() => navigate("/qmeup")}
              className="flex flex-col justify-between flex-1 p-6 text-white transition-all duration-300 transform shadow-xl cursor-pointer bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <i className={`${PrimeIcons.TICKET} text-3xl`}></i>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                  <i className={`${PrimeIcons.ARROW_RIGHT} text-lg`}></i>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">Queue Number</h3>
                <p className="text-base text-blue-100">
                  Get your waiting number instantly
                </p>
              </div>
            </div>

            <div
              onClick={() => navigate("find-amenity")}
              className="flex flex-col justify-between flex-1 p-6 transition-all duration-300 transform border shadow-xl cursor-pointer bg-white/70 backdrop-blur-sm rounded-3xl border-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <i
                  className={`${PrimeIcons.MAP_MARKER} text-3xl text-blue-600`}
                ></i>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <i
                    className={`${PrimeIcons.ARROW_RIGHT} text-lg text-blue-600`}
                  ></i>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  Directory
                </h3>
                <p className="text-base text-gray-600">
                  Navigate our hospital easily
                </p>
              </div>
            </div>

            <div
              onClick={() => navigate("/scheduler")}
              className="flex flex-col justify-between flex-1 p-6 transition-all duration-300 transform border shadow-xl cursor-pointer bg-white/70 backdrop-blur-sm rounded-3xl border-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <i
                  className={`${PrimeIcons.CALENDAR} text-3xl text-blue-600`}
                ></i>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <i
                    className={`${PrimeIcons.ARROW_RIGHT} text-lg text-blue-600`}
                  ></i>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-gray-800">
                  Appointments
                </h3>
                <p className="text-base text-gray-600">
                  Schedule with our doctors
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-base text-gray-500">
            Your health is our priority • Touch any option to get started
          </p>
        </div>
      </main>
    </PageTemplate>
  );
};

export default MainPage;
