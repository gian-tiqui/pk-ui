import { Image } from "primereact/image";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg 1.png";
import React from "react";

const KioskHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg">
          <Image src={wmcLogo} alt="Westlake Medical Center" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            WMC Patient Kiosk
          </h1>
          <p className="text-gray-600">Order Medical Services</p>
        </div>
      </div>

      <div className="flex items-center gap-4 font-medium">
        <div className="flex items-center">
          <div className="flex items-center gap-3 p-4 transition-all duration-300 border shadow-lg cursor-pointer border-gray-200/50 bg-white/80 backdrop-blur-md rounded-3xl hover:shadow-xl hover:bg-white/90">
            <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-500 rounded-full">
              1
            </div>
            <p className="text-sm text-gray-600">
              Select services from departments
            </p>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-3 p-4 transition-all duration-300 border shadow-lg cursor-pointer border-blue-300/30 bg-gradient-to-br from-blue-500 to-indigo-600 backdrop-blur-md rounded-3xl hover:shadow-xl">
            <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-white/20">
              2
            </div>
            <p className="text-sm font-medium text-white">Add to cart</p>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
        </div>

        <div className="flex items-center gap-3 p-4 transition-all duration-300 border shadow-lg cursor-pointer border-emerald-300/30 bg-gradient-to-r from-emerald-500 to-teal-600 backdrop-blur-md rounded-3xl hover:shadow-xl ">
          <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-white/20">
            3
          </div>
          <p className="text-sm font-medium text-white">Proceed to payment</p>
        </div>
      </div>
    </header>
  );
};

export default KioskHeader;
