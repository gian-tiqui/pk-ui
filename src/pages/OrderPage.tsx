import PageTemplate from "../templates/PageTemplate";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg 1.png";
import { Image } from "primereact/image";

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
        <div className="w-full h-[84vh] grid grid-cols-7 gap-6">
          <div className="grid col-span-2 gap-6 shadow">
            <div className="p-6 bg-white shadow rounded-2xl"></div>
            <div className="p-6 bg-blue-700 shadow rounded-s-2xl">
              <h4 className="w-48 text-xl font-semibold text-white">
                Commonly bought services
              </h4>
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
                    className="flex items-center justify-between w-full px-4 bg-white rounded-lg shadow h-14"
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
              <h4 className="text-xl font-semibold text-white w-52">
                Commonly bought items
              </h4>
            </div>
            <div className="p-6 bg-white shadow rounded-2xl">
              <h4 className="w-32 mb-6 text-xl font-semibold text-blue-700">
                Your Cart Summary
              </h4>
              <div className="grid w-full grid-cols-2 gap-3">
                <div className="h-20 bg-blue-700 rounded-lg"></div>
                <div className="h-20 bg-blue-700 rounded-lg"></div>
                <div className="h-20 bg-blue-700 rounded-lg"></div>
                <div className="h-20 bg-blue-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTemplate>
  );
};

export default OrderPage;
