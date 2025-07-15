import { Building2, Badge, ArrowLeft, Plus } from "lucide-react";
import { Button } from "primereact/button";
import React from "react";
import { scrollbarTheme } from "../@utils/tw-classes/tw-classes";
import { Department } from "../types/types";

interface Props {
  selectedDepartment?: Department;
  departments: Department[];
  setSelectedDepartment: (id: string | null) => void;
  getSelectedDepartmentName: () => string;
}

const DepartmentServices: React.FC<Props> = ({
  selectedDepartment,
  departments,
  getSelectedDepartmentName,
  setSelectedDepartment,
}) => {
  return (
    <section className="col-span-2 p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20 h-[calc(100vh-105px)] flex flex-col">
      {!selectedDepartment ? (
        <>
          <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Medical Departments
          </h2>
          <div
            className={`${scrollbarTheme} grid grid-cols-2 gap-3 h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden pr-2`}
          >
            {departments
              .filter((dept) => dept.isActive)
              .map((dept) => {
                const IconComponent = departmentIcons[dept.icon];
                return (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className="p-4 transition-all duration-300 transform bg-white shadow-lg cursor-pointer rounded-2xl hover:scale-105 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                      <Badge
                        value={dept.serviceCount}
                        className="text-blue-600 bg-blue-100"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {dept.serviceCount} services
                    </p>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center text-xl font-bold text-gray-800">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              {getSelectedDepartmentName()} Services
            </h2>
            <Button
              onClick={() => setSelectedDepartment(null)}
              className="px-4 py-2 text-gray-600 transition-all duration-300 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div
            className={`${scrollbarTheme} grid grid-cols-1 gap-3 h-[calc(100%-4rem)] overflow-y-auto pr-2`}
          >
            {getServicesForDepartment(selectedDepartment).map((service) => (
              <div
                key={service.id}
                className="p-4 transition-all duration-300 transform bg-white shadow-lg cursor-pointer rounded-2xl hover:scale-[1.02] hover:shadow-xl"
                onClick={() => addToCart(service)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {service.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {service.description}
                    </p>
                    {service.duration && (
                      <p className="mt-1 text-xs text-gray-400">
                        Duration: {service.duration} min
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <p className="mb-2 text-lg font-bold text-blue-600">
                      {service.currency}
                      {service.price.toLocaleString()}
                    </p>
                    <Button
                      className="flex items-center justify-center w-8 h-8 p-2 text-white transition-all duration-300 border-none rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(service);
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default DepartmentServices;
