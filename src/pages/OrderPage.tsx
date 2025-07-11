import PageTemplate from "../templates/PageTemplate";
import { useState } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import {
  Building2,
  FlaskConical,
  Camera,
  Heart,
  Search,
  Waves,
  Circle,
  Image as ImageIcon,
  Droplets,
  Star,
  ShoppingCart,
  Plus,
  CreditCard,
  Stethoscope,
} from "lucide-react";

interface Department {
  id: number;
  name: string;
  services: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface Service {
  id: number;
  name: string;
  price: string;
  department: string;
}

interface CartItem extends Service {
  quantity: number;
}

const OrderPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const departments: Department[] = [
    { id: 1, name: "Laboratory", services: 24, icon: FlaskConical },
    { id: 2, name: "Radiology", services: 18, icon: Camera },
    { id: 3, name: "Cardiology", services: 15, icon: Heart },
    { id: 4, name: "What", services: 12, icon: Search },
    { id: 5, name: "Do", services: 20, icon: Waves },
    { id: 6, name: "I", services: 10, icon: Circle },
    { id: 7, name: "Put", services: 16, icon: ImageIcon },
    { id: 8, name: "Here", services: 22, icon: Droplets },
  ];

  const popularServices: Service[] = [
    {
      id: 1,
      name: "Complete Blood Count",
      price: "₱450",
      department: "Laboratory",
    },
    { id: 2, name: "Chest X-Ray", price: "₱380", department: "Radiology" },
    { id: 3, name: "ECG", price: "₱520", department: "Cardiology" },
    { id: 4, name: "Urinalysis", price: "₱180", department: "Laboratory" },
  ];

  const addToCart = (service: Service): void => {
    const existingItem = cartItems.find((item) => item.id === service.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...service, quantity: 1 }]);
    }
  };

  const getTotalItems = (): number =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = (): number =>
    cartItems.reduce(
      (sum, item) =>
        sum + parseInt(item.price.replace("₱", "")) * item.quantity,
      0
    );

  return (
    <PageTemplate>
      <main className="flex flex-col h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                WMC Patient Kiosk
              </h1>
              <p className="text-gray-600">Order Medical Services</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 border shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl border-white/20">
              <span className="text-sm text-gray-600">Cart Items: </span>
              <span className="font-bold text-blue-600">{getTotalItems()}</span>
            </div>
            <Button
              className="px-6 py-3 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl hover:from-emerald-600 hover:to-teal-700"
              disabled={cartItems.length === 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Checkout ₱{getTotalPrice().toLocaleString()}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid flex-1 grid-cols-4 gap-4">
          {/* Departments Section */}
          <div className="col-span-2 p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20">
            <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Medical Departments
            </h2>
            <div className="grid grid-cols-2 gap-3 h-[calc(100%-3rem)] overflow-hidden">
              {departments.map((dept) => {
                const IconComponent = dept.icon;
                return (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      selectedDepartment === dept.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent
                        className={`w-6 h-6 ${
                          selectedDepartment === dept.id
                            ? "text-white"
                            : "text-blue-600"
                        }`}
                      />
                      <Badge
                        value={dept.services}
                        className={`${
                          selectedDepartment === dept.id
                            ? "bg-white text-blue-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      />
                    </div>
                    <h3
                      className={`font-semibold text-sm ${
                        selectedDepartment === dept.id
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {dept.name}
                    </h3>
                    <p
                      className={`text-xs ${
                        selectedDepartment === dept.id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {dept.services} services
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Services */}
          <div className="p-6 text-white shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl">
            <h2 className="flex items-center mb-4 text-xl font-bold">
              <Star className="w-5 h-5 mr-2" />
              Popular Services
            </h2>
            <div className="space-y-3">
              {popularServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20"
                  onClick={() => addToCart(service)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{service.name}</h4>
                      <p className="text-xs text-blue-100">
                        {service.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{service.price}</p>
                      <Button
                        className="flex items-center justify-center w-8 h-8 p-2 text-blue-600 transition-all duration-300 bg-white border-none rounded-full hover:bg-blue-50"
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
          </div>

          {/* Cart Summary */}
          <div className="p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20">
            <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
              Cart Summary
            </h2>
            <div className="mb-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold">{item.name}</h4>
                        <p className="text-xs text-blue-100">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          ₱
                          {(
                            parseInt(item.price.replace("₱", "")) *
                            item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₱{getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <Button className="w-full py-3 text-white transition-all duration-300 transform border-none shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl hover:from-emerald-600 hover:to-teal-700 hover:scale-105">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Select services from departments • Add to cart • Proceed to payment
          </p>
        </div>
      </main>
    </PageTemplate>
  );
};

export default OrderPage;
