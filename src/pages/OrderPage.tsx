import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import {
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
  ChevronRight,
} from "lucide-react";
import { scrollbarTheme } from "../@utils/tw-classes/tw-classes";
import { CartItem, Service, SubCart } from "../types/types";
import KioskHeader from "../components/KioskHeader";
import { allServices, departments } from "../@utils/data/data";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import SubcartDialog from "../components/SubcartDialog";
import DepartmentServices from "../components/DepartmentServices";

const OrderPage: React.FC = () => {
  const toastRef = useRef<Toast>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedSubCart, setSelectedSubCart] = useState<SubCart | null>(null);
  const [subCartDialogVisible, setSubCartDialogVisible] = useState(false);
  const [doctorSelections, setDoctorSelections] = useState<{
    [departmentId: number]: { doctorId: number; doctorName: string };
  }>({});

  // Icon mapping for departments
  const departmentIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    flask: FlaskConical,
    camera: Camera,
    heart: Heart,
    search: Search,
    waves: Waves,
    circle: Circle,
    image: ImageIcon,
    droplets: Droplets,
  };

  const popularServices = allServices.filter((service) => service.isPopular);

  const updateSubCartDoctor = (
    departmentId: number,
    doctorId: number | null,
    doctorName?: string | null
  ) => {
    // Update the persistent doctor selections
    setDoctorSelections((prev) => {
      if (doctorId === null) {
        const newSelections = { ...prev };
        delete newSelections[departmentId];
        return newSelections;
      }

      return {
        ...prev,
        [departmentId]: { doctorId, doctorName: doctorName || "" },
      };
    });

    // Also update the selected subcart if it matches
    if (selectedSubCart && selectedSubCart.departmentId === departmentId) {
      setSelectedSubCart({
        ...selectedSubCart,
        selectedDoctorId: doctorId,
        selectedDoctorName: doctorName || null,
      });
    }
  };

  const addToCart = (service: Service): void => {
    const existingItem = cartItems.find((item) => item.id === service.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      const newSubtotal = service.price * newQuantity;

      setCartItems(
        cartItems.map((item) =>
          item.id === service.id
            ? { ...item, quantity: newQuantity, subtotal: newSubtotal }
            : item
        )
      );
      toastRef.current?.show({
        severity: "info",
        summary: "Item Updated",
        detail: `${service.name} quantity updated to ${newQuantity}`,
        life: 3000,
      });
    } else {
      setCartItems([
        ...cartItems,
        { ...service, quantity: 1, subtotal: service.price },
      ]);
    }
  };

  const decreaseQuantity = (serviceId: number): void => {
    setCartItems((prevItems) => {
      const newItems = prevItems
        .map((item) => {
          if (item.id === serviceId) {
            const newQuantity = item.quantity - 1;
            const newSubtotal = item.price * newQuantity;
            return { ...item, quantity: newQuantity, subtotal: newSubtotal };
          }

          return item;
        })
        .filter((item) => item.quantity > 0);

      return newItems;
    });
  };

  const increaseQuantity = (serviceId: number): void => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === serviceId) {
          const newQuantity = item.quantity + 1;
          const newSubtotal = item.price * newQuantity;
          return { ...item, quantity: newQuantity, subtotal: newSubtotal };
        }
        return item;
      })
    );
  };

  const removeFromCart = (serviceId: number): void => {
    const itemToRemove = cartItems.find((item) => item.id === serviceId);
    const newCartItems = cartItems.filter((item) => item.id !== serviceId);
    setCartItems(newCartItems);

    if (selectedSubCart && itemToRemove) {
      const remainingItemsInDept = newCartItems.filter(
        (item) => item.departmentId === selectedSubCart.departmentId
      );
      if (remainingItemsInDept.length === 0) {
        setSubCartDialogVisible(false);
        setSelectedSubCart(null);
      }
    }
  };

  const removeAllFromDepartment = (departmentId: number): void => {
    setCartItems(
      cartItems.filter((item) => item.departmentId !== departmentId)
    );

    // Clear doctor selection for this department
    setDoctorSelections((prev) => {
      const newSelections = { ...prev };
      delete newSelections[departmentId];
      return newSelections;
    });

    if (selectedSubCart && selectedSubCart.departmentId === departmentId) {
      setSubCartDialogVisible(false);
      setSelectedSubCart(null);
    }
  };

  const getTotalItems = (): number =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = (): number =>
    cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const getServicesForDepartment = (departmentId: number): Service[] =>
    allServices.filter(
      (service) => service.departmentId === departmentId && service.isActive
    );

  const getSelectedDepartmentName = (): string => {
    const dept = departments.find((d) => d.id === selectedDepartment);
    return dept ? dept.name : "";
  };

  const handleCheckout = () => {
    const currentSubCarts = getSubCarts();
    const incompleteSubCarts = currentSubCarts.filter(
      (subCart) => !subCart.selectedDoctorId
    );

    if (incompleteSubCarts.length > 0) {
      alert("Please select a doctor for all departments in your cart.");
      return;
    }

    const checkoutData = {
      items: cartItems,
      total: getTotalPrice(),
      currency: "₱",
      itemCount: getTotalItems(),
      timestamp: new Date().toISOString(),
      doctorsPerDepartment: currentSubCarts.map((subCart) => ({
        departmentId: subCart.departmentId,
        departmentName: subCart.departmentName,
        doctorId: subCart.selectedDoctorId,
        doctorName: subCart.selectedDoctorName,
      })),
    };

    console.log("Proceeding to checkout with data:", checkoutData);
    alert(
      `Checkout initiated for ${getTotalItems()} items totaling ₱${getTotalPrice().toLocaleString()}\n\n` +
        currentSubCarts
          .map(
            (sc) =>
              `${sc.departmentName}: ${
                sc.selectedDoctorName || "No doctor selected"
              }`
          )
          .join("\n")
    );
  };

  const handleSubCartClick = (subCart: SubCart) => {
    const currentSubCarts = getSubCarts();
    const currentSubCart = currentSubCarts.find(
      (sc) => sc.departmentId === subCart.departmentId
    );
    if (currentSubCart) {
      setSelectedSubCart(currentSubCart);
      setSubCartDialogVisible(true);
    }
  };

  const getSubCarts = useCallback((): SubCart[] => {
    const departmentGroups: { [key: number]: CartItem[] } = {};

    // Group cart items by department
    cartItems.forEach((item) => {
      if (!departmentGroups[item.departmentId]) {
        departmentGroups[item.departmentId] = [];
      }
      departmentGroups[item.departmentId].push(item);
    });

    // Convert to SubCart objects
    return Object.keys(departmentGroups).map((deptId) => {
      const departmentId = parseInt(deptId);
      const items = departmentGroups[departmentId];
      const department = departments.find((d) => d.id === departmentId);

      // Get the doctor selection for this department
      const doctorSelection = doctorSelections[departmentId];

      return {
        departmentId,
        departmentName: department?.name || "",
        departmentIcon: department?.icon || "circle",
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
        selectedDoctorId: doctorSelection?.doctorId || null,
        selectedDoctorName: doctorSelection?.doctorName || null,
      };
    });
  }, [cartItems, doctorSelections]);

  useEffect(() => {
    if (selectedSubCart && subCartDialogVisible) {
      const currentSubCarts = getSubCarts();
      const updatedSelectedSubCart = currentSubCarts.find(
        (subCart) => subCart.departmentId === selectedSubCart.departmentId
      );

      if (updatedSelectedSubCart) {
        // Only update if there are actual changes to prevent infinite loop
        if (
          updatedSelectedSubCart.totalItems !== selectedSubCart.totalItems ||
          updatedSelectedSubCart.totalAmount !== selectedSubCart.totalAmount ||
          updatedSelectedSubCart.items.length !== selectedSubCart.items.length
        ) {
          setSelectedSubCart(updatedSelectedSubCart);
        }
      } else {
        setSubCartDialogVisible(false);
        setSelectedSubCart(null);
      }
    }
  }, [
    cartItems,
    selectedSubCart?.departmentId,
    subCartDialogVisible,
    getSubCarts,
    // Remove selectedSubCart from dependencies to prevent infinite loop
    selectedSubCart?.totalItems,
    selectedSubCart?.totalAmount,
    selectedSubCart?.items.length,
  ]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gradient-to-br ice from-slate-50 via-blue-50 to-indigo-100">
      <ConfirmDialog />
      <Toast ref={toastRef} />
      {/* Header */}
      <KioskHeader />

      {/* Main Content */}
      <main className="grid flex-1 grid-cols-4 gap-4">
        {/* Departments or Services Section */}
        <DepartmentServices
          addToCart={addToCart}
          departmentIcons={departmentIcons}
          departments={departments}
          getSelectedDepartmentIcon={getSelectedDepartmentName}
          getSelectedDepartmentName={getSelectedDepartmentName}
          getServicesForDepartment={getServicesForDepartment}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
        {/* Popular Services */}
        <div className="p-6 text-white shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl h-[calc(100vh-105px)] flex flex-col">
          <h2 className="flex items-center mb-4 text-xl font-bold">
            <Star className="w-5 h-5 mr-2" />
            Popular Services
          </h2>
          <div
            className={`flex-1 pr-2 space-y-3 overflow-y-auto ${scrollbarTheme}`}
          >
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
                      {service.departmentName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <p className="text-lg font-bold">
                      {service.currency}
                      {service.price.toLocaleString()}
                    </p>
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

        {/* Cart Summary with SubCarts */}
        <div className="p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20 h-[calc(100vh-105px)] flex flex-col">
          <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
            Cart Summary
          </h2>
          <div
            className={`flex-1 pr-1 mb-4 space-y-3 overflow-y-auto overflow-x-hidden ${scrollbarTheme}`}
          >
            {getSubCarts().length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              getSubCarts().map((subCart) => {
                const IconComponent = departmentIcons[subCart.departmentIcon];
                const hasDoctorSelected = subCart.selectedDoctorId !== null;

                return (
                  <div
                    key={subCart.departmentId}
                    className={`p-4 transition-all duration-300 transform bg-white shadow-lg cursor-pointer rounded-2xl hover:scale-105 hover:shadow-xl ${
                      !hasDoctorSelected ? "border-l-4 border-orange-500" : ""
                    }`}
                    onClick={() => handleSubCartClick(subCart)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800">
                            {subCart.departmentName}
                            {!hasDoctorSelected && (
                              <span className="ml-2 text-xs font-normal text-orange-600">
                                (No doctor selected)
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {subCart.totalItems} items
                            {hasDoctorSelected && (
                              <>
                                <br />
                                <span className="text-green-600">
                                  Dr. {subCart.selectedDoctorName}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">
                            ₱{subCart.totalAmount.toLocaleString()}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Total Items: {getTotalItems()}
                </span>
                <span className="text-sm text-gray-600">
                  Services: {cartItems.length}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-800">
                  Total Amount:
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ₱{getTotalPrice().toLocaleString()}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="justify-center w-full px-6 py-3 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl hover:from-emerald-600 hover:to-teal-700"
                disabled={cartItems.length === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Checkout ₱{getTotalPrice().toLocaleString()}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* SubCart Detail Dialog */}
      <SubcartDialog
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        removeAllFromDepartment={removeAllFromDepartment}
        removeFromCart={removeFromCart}
        selectedSubCart={selectedSubCart}
        setSubCartDialogVisible={setSubCartDialogVisible}
        subCartDialogVisible={subCartDialogVisible}
        updateSubCartDoctor={updateSubCartDoctor}
      />

      {/* Footer */}
    </div>
  );
};

export default OrderPage;
