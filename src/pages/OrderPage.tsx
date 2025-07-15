import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Dialog } from "primereact/dialog";
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
  ArrowLeft,
  Minus,
  X,
  ChevronRight,
  Package,
} from "lucide-react";
import { scrollbarTheme } from "../@utils/tw-classes/tw-classes";
import { CartItem, Service, SubCart } from "../types/types";
import KioskHeader from "../components/KioskHeader";
import { allServices, departments, doctors } from "../@utils/data/data";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

const OrderPage: React.FC = () => {
  const toastRef = useRef<Toast>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedSubCart, setSelectedSubCart] = useState<SubCart | null>(null);
  const [subCartDialogVisible, setSubCartDialogVisible] = useState(false);

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

      return {
        departmentId,
        departmentName: department?.name || "",
        departmentIcon: department?.icon || "circle",
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
        selectedDoctorId: null,
        selectedDoctorName: null,
      };
    });
  }, [cartItems]);

  useEffect(() => {
    if (selectedSubCart && subCartDialogVisible) {
      const currentSubCarts = getSubCarts();
      const updatedSelectedSubCart = currentSubCarts.find(
        (subCart) => subCart.departmentId === selectedSubCart.departmentId
      );

      if (updatedSelectedSubCart) {
        setSelectedSubCart(updatedSelectedSubCart);
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
    selectedSubCart,
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
                        className="flex flex-col justify-between p-4 transition-all duration-300 transform bg-white shadow-lg cursor-pointer rounded-2xl hover:scale-105 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                          <Badge
                            value={dept.serviceCount}
                            className="text-blue-600 bg-blue-100"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800">
                            {dept.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {dept.serviceCount} services
                          </p>
                        </div>
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
                      <div className="flex flex-col items-end justify-between h-full ml-4 text-right">
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
      <Dialog
        visible={subCartDialogVisible}
        onHide={() => setSubCartDialogVisible(false)}
        header={
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>{selectedSubCart?.departmentName} Cart</span>
          </div>
        }
        className="w-full max-w-2xl"
        maskClassName="backdrop-blur-sm bg-gray-900/50"
        modal
      >
        {selectedSubCart && (
          <div className="space-y-4">
            {/* Doctor Selector */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <label className="font-medium text-gray-700">
                Attending Doctor:
              </label>
              <select
                className="p-2 text-sm border rounded-md"
                value={selectedSubCart?.selectedDoctorId || ""}
                onChange={(e) => {
                  const selectedId = e.target.value
                    ? parseInt(e.target.value)
                    : null;
                  const selectedDoctor = selectedId
                    ? doctors.find((doc) => doc.id === selectedId)
                    : null;
                  updateSubCartDoctor(
                    selectedSubCart.departmentId,
                    selectedId,
                    selectedDoctor
                      ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`
                      : null
                  );
                }}
              >
                <option value="">Select a doctor...</option>
                {doctors
                  .filter(
                    (doc) =>
                      doc.specializationId === selectedSubCart.departmentId
                  )
                  .map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.firstName} {doc.lastName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedSubCart.departmentName}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedSubCart.totalItems} items
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">
                  ₱{selectedSubCart.totalAmount.toLocaleString()}
                </p>
                <Button
                  onClick={() => {
                    confirmDialog({
                      message: `Are you sure you want to remove all items from ${selectedSubCart.departmentName}?`,
                      header: "Confirm Removal",
                      icon: "pi pi-exclamation-triangle",
                      accept: () => {
                        removeAllFromDepartment(selectedSubCart.departmentId);
                        setSubCartDialogVisible(false);
                      },
                    });
                  }}
                  className="px-3 py-1 mt-2 text-xs text-red-600 border border-red-200 rounded-lg bg-red-50 hover:bg-red-100"
                >
                  Remove All
                </Button>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-96">
              {selectedSubCart.items.map((item) => (
                <div
                  key={item.id}
                  className="relative p-4 bg-white border shadow-sm rounded-xl"
                >
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute p-1 text-gray-400 transition-all duration-200 bg-gray-100 rounded-full top-2 right-2 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="pr-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-800">
                          {item.name}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          ₱{item.subtotal.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₱{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center overflow-hidden bg-gray-100 rounded-lg">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium text-gray-800 bg-white min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.requiresPreparation && (
                          <span className="px-2 py-1 text-xs text-orange-600 bg-orange-100 rounded-full">
                            Prep required
                          </span>
                        )}
                        {item.duration && (
                          <span className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                            {item.duration} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>

      {/* Footer */}
    </div>
  );
};

export default OrderPage;
