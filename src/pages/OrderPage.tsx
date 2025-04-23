import PageTemplate from "../templates/PageTemplate";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg 1.png";
import { Image } from "primereact/image";
import customFacade from "../assets/Group 1 (1).png";
import { scrollbarTheme } from "../@utils/tw-classes/tw-classes";

const OrderPage = () => {
  return (
    <PageTemplate>
      <main className="p-6">
        <header className="flex items-center gap-4 mb-6">
          <Image
            src={wmcLogo}
            className="w-12 h-12"
            height="1000"
            width="1000"
          />
          <h4 className="text-2xl font-medium text-blue-700 ">
            WMC Patient Kiosk
          </h4>
        </header>
        <div className="w-full h-[70vh] grid grid-cols-7 gap-6">
          <div className="grid col-span-2 gap-6 shadow">
            <div className="p-6 bg-white shadow rounded-2xl h-[43vh]">
              <Image
                src={customFacade}
                alt="Custom Facade"
                imageClassName="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="p-3 py-6 bg-blue-700 shadow ps-6 rounded-s-2xl">
              <h4 className="w-48 mb-6 text-xl font-semibold text-white">
                Commonly bought services
              </h4>
              <div
                className={`${scrollbarTheme} grid w-full h-32 grid-cols-1 gap-3 overflow-auto`}
              >
                <div className="h-20 bg-white rounded-3xl"></div>
                <div className="h-20 bg-white rounded-3xl"></div>
                <div className="h-20 bg-white rounded-3xl"></div>
                <div className="h-20 bg-white rounded-3xl"></div>
              </div>
            </div>
          </div>
          <div className="col-span-3 p-6 bg-blue-700 shadow rounded-tl-2xl rounded-br-2xl">
            <h4 className="mb-1 text-xl font-semibold text-white w-52">
              Departments
            </h4>
            <p className="mb-6 text-white text-md">Choose one below</p>
            <div className="grid grid-cols-2 gap-2">
              {Array(16)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between w-full px-4 bg-white shadow rounded-2xl h-14"
                  >
                    <p className="font-medium">Department</p>
                    <div className="text-xs font-medium text-center">
                      <p>Items/Services</p>
                      <p>32</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="grid col-span-2 gap-6 shadow">
            <div className="p-6 bg-blue-700 shadow rounded-e-2xl">
              <h4 className="mb-6 text-xl font-semibold text-white w-52">
                Commonly bought items
              </h4>
              <div className="grid w-full grid-cols-2 gap-3">
                <div className="h-20 bg-white rounded-3xl"></div>
                <div className="h-20 bg-white rounded-3xl"></div>
                <div className="h-20 bg-white rounded-3xl"></div>
                <div className="h-20 bg-white rounded-3xl"></div>
              </div>
            </div>
            <div className="p-6 bg-white shadow rounded-2xl">
              <h4 className="w-32 mb-6 text-xl font-semibold text-blue-700">
                Your Cart Summary
              </h4>
              <div className="grid w-full grid-cols-2 gap-3">
                <div className="h-20 bg-blue-700 rounded-3xl"></div>
                <div className="h-20 bg-blue-700 rounded-3xl"></div>
                <div className="h-20 bg-blue-700 rounded-3xl"></div>
                <div className="h-20 bg-blue-700 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTemplate>
  );
};

export default OrderPage;
