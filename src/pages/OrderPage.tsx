import { useCallback, useEffect, useState } from "react";
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
  CreditCard,
  ArrowLeft,
  Minus,
  X,
  ChevronRight,
  Package,
} from "lucide-react";
import { scrollbarTheme } from "../@utils/tw-classes/tw-classes";
import { Doctor } from "../types/types";

interface Department {
  id: number;
  name: string;
  description?: string;
  icon: string;
  serviceCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
  isPopular: boolean;
  duration?: number;
  requiresPreparation: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CartItem extends Service {
  quantity: number;
  subtotal: number;
}

type SubCart = {
  departmentId: number;
  departmentName: string;
  departmentIcon: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  selectedDoctorId: number | null;
};

const OrderPage: React.FC = () => {
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

  const departments: Department[] = [
    {
      id: 1,
      name: "Laboratory",
      description: "Diagnostic testing and analysis",
      icon: "flask",
      serviceCount: 24,
      isActive: true,
    },
    {
      id: 2,
      name: "Radiology",
      description: "Medical imaging services",
      icon: "camera",
      serviceCount: 18,
      isActive: true,
    },
    {
      id: 3,
      name: "Cardiology",
      description: "Heart and cardiovascular care",
      icon: "heart",
      serviceCount: 15,
      isActive: true,
    },
    {
      id: 4,
      name: "Dermatology",
      description: "Skin and dermatological services",
      icon: "search",
      serviceCount: 12,
      isActive: true,
    },
    {
      id: 5,
      name: "Neurology",
      description: "Nervous system diagnostics",
      icon: "waves",
      serviceCount: 20,
      isActive: true,
    },
    {
      id: 6,
      name: "Orthopedics",
      description: "Bone and joint care",
      icon: "circle",
      serviceCount: 10,
      isActive: true,
    },
    {
      id: 7,
      name: "Ophthalmology",
      description: "Eye care and vision services",
      icon: "image",
      serviceCount: 16,
      isActive: true,
    },
    {
      id: 8,
      name: "Gastroenterology",
      description: "Digestive system care",
      icon: "droplets",
      serviceCount: 22,
      isActive: true,
    },
  ];

  const doctors: Doctor[] = [
    {
      id: 1,
      firstName: "John",
      middleName: "A.",
      lastName: "Smith",
      specializationId: 1,
    },
    {
      id: 2,
      firstName: "Sarah",
      middleName: "B.",
      lastName: "Johnson",
      specializationId: 2,
    },
    {
      id: 3,
      firstName: "Michael",
      middleName: "C.",
      lastName: "Williams",
      specializationId: 3,
    },
    {
      id: 4,
      firstName: "Emily",
      middleName: "D.",
      lastName: "Brown",
      specializationId: 4,
    },
    {
      id: 5,
      firstName: "David",
      middleName: "E.",
      lastName: "Jones",
      specializationId: 5,
    },
    {
      id: 6,
      firstName: "Olivia",
      middleName: "F.",
      lastName: "Garcia",
      specializationId: 1,
    },
    {
      id: 7,
      firstName: "James",
      middleName: "G.",
      lastName: "Miller",
      specializationId: 2,
    },
    {
      id: 8,
      firstName: "Sophia",
      middleName: "H.",
      lastName: "Davis",
      specializationId: 3,
    },
    {
      id: 9,
      firstName: "Liam",
      middleName: "I.",
      lastName: "Martinez",
      specializationId: 4,
    },
    {
      id: 10,
      firstName: "Isabella",
      middleName: "J.",
      lastName: "Hernandez",
      specializationId: 5,
    },
    {
      id: 11,
      firstName: "Noah",
      middleName: "K.",
      lastName: "Lopez",
      specializationId: 1,
    },
    {
      id: 12,
      firstName: "Ava",
      middleName: "L.",
      lastName: "Gonzalez",
      specializationId: 2,
    },
    {
      id: 13,
      firstName: "Lucas",
      middleName: "M.",
      lastName: "Wilson",
      specializationId: 3,
    },
    {
      id: 14,
      firstName: "Mia",
      middleName: "N.",
      lastName: "Anderson",
      specializationId: 4,
    },
    {
      id: 15,
      firstName: "Ethan",
      middleName: "O.",
      lastName: "Thomas",
      specializationId: 5,
    },
    {
      id: 16,
      firstName: "Charlotte",
      middleName: "P.",
      lastName: "Taylor",
      specializationId: 1,
    },
    {
      id: 17,
      firstName: "Logan",
      middleName: "Q.",
      lastName: "Moore",
      specializationId: 2,
    },
    {
      id: 18,
      firstName: "Amelia",
      middleName: "R.",
      lastName: "Jackson",
      specializationId: 3,
    },
    {
      id: 19,
      firstName: "Benjamin",
      middleName: "S.",
      lastName: "Martin",
      specializationId: 4,
    },
    {
      id: 20,
      firstName: "Harper",
      middleName: "T.",
      lastName: "Lee",
      specializationId: 5,
    },
  ];

  const allServices: Service[] = [
    // Laboratory Services
    {
      id: 1,
      name: "Complete Blood Count",
      description:
        "Full blood cell analysis including RBC, WBC, platelets, and hemoglobin levels",
      price: 450,
      currency: "₱",
      departmentId: 1,
      departmentName: "Laboratory",
      isActive: true,
      isPopular: true,
      duration: 15,
      requiresPreparation: false,
    },
    {
      id: 2,
      name: "Urinalysis",
      description:
        "Comprehensive urine test for kidney function and urinary tract health",
      price: 180,
      currency: "₱",
      departmentId: 1,
      departmentName: "Laboratory",
      isActive: true,
      isPopular: true,
      duration: 10,
      requiresPreparation: false,
    },
    {
      id: 3,
      name: "Blood Sugar Test",
      description: "Glucose level measurement for diabetes screening",
      price: 120,
      currency: "₱",
      departmentId: 1,
      departmentName: "Laboratory",
      isActive: true,
      isPopular: false,
      duration: 5,
      requiresPreparation: true,
    },
    {
      id: 4,
      name: "Lipid Profile",
      description:
        "Cholesterol and triglycerides analysis for cardiovascular risk assessment",
      price: 680,
      currency: "₱",
      departmentId: 1,
      departmentName: "Laboratory",
      isActive: true,
      isPopular: false,
      duration: 20,
      requiresPreparation: true,
    },
    {
      id: 5,
      name: "Liver Function Test",
      description: "Liver enzyme analysis to assess liver health and function",
      price: 520,
      currency: "₱",
      departmentId: 1,
      departmentName: "Laboratory",
      isActive: true,
      isPopular: false,
      duration: 15,
      requiresPreparation: false,
    },
    {
      id: 6,
      name: "Thyroid Function Test",
      description: "TSH, T3, T4 levels to evaluate thyroid gland function",
      price: 890,
      currency: "₱",
      departmentId: 1,
      departmentName: "Laboratory",
      isActive: true,
      isPopular: false,
      duration: 20,
      requiresPreparation: false,
    },
    // Radiology Services
    {
      id: 7,
      name: "Chest X-Ray",
      description: "Chest imaging to evaluate lungs, heart, and chest wall",
      price: 380,
      currency: "₱",
      departmentId: 2,
      departmentName: "Radiology",
      isActive: true,
      isPopular: true,
      duration: 10,
      requiresPreparation: false,
    },
    {
      id: 8,
      name: "CT Scan - Head",
      description: "Brain computed tomography for detailed brain imaging",
      price: 3500,
      currency: "₱",
      departmentId: 2,
      departmentName: "Radiology",
      isActive: true,
      isPopular: false,
      duration: 30,
      requiresPreparation: false,
    },
    {
      id: 9,
      name: "MRI - Spine",
      description:
        "Spinal magnetic resonance imaging for detailed spine evaluation",
      price: 8500,
      currency: "₱",
      departmentId: 2,
      departmentName: "Radiology",
      isActive: true,
      isPopular: false,
      duration: 45,
      requiresPreparation: true,
    },
    {
      id: 10,
      name: "Ultrasound - Abdomen",
      description: "Abdominal ultrasound scan for organ evaluation",
      price: 1200,
      currency: "₱",
      departmentId: 2,
      departmentName: "Radiology",
      isActive: true,
      isPopular: false,
      duration: 20,
      requiresPreparation: true,
    },
    {
      id: 11,
      name: "Mammography",
      description: "Breast cancer screening and diagnostic imaging",
      price: 2100,
      currency: "₱",
      departmentId: 2,
      departmentName: "Radiology",
      isActive: true,
      isPopular: false,
      duration: 15,
      requiresPreparation: false,
    },
    // Cardiology Services
    {
      id: 12,
      name: "ECG",
      description:
        "Electrocardiogram to evaluate heart rhythm and electrical activity",
      price: 520,
      currency: "₱",
      departmentId: 3,
      departmentName: "Cardiology",
      isActive: true,
      isPopular: true,
      duration: 10,
      requiresPreparation: false,
    },
    {
      id: 13,
      name: "Echocardiogram",
      description: "Heart ultrasound to assess heart structure and function",
      price: 2800,
      currency: "₱",
      departmentId: 3,
      departmentName: "Cardiology",
      isActive: true,
      isPopular: false,
      duration: 30,
      requiresPreparation: false,
    },
    {
      id: 14,
      name: "Stress Test",
      description:
        "Exercise stress testing to evaluate heart function under stress",
      price: 3200,
      currency: "₱",
      departmentId: 3,
      departmentName: "Cardiology",
      isActive: true,
      isPopular: false,
      duration: 60,
      requiresPreparation: true,
    },
    {
      id: 15,
      name: "Holter Monitor",
      description: "24-hour continuous heart monitoring for rhythm analysis",
      price: 2500,
      currency: "₱",
      departmentId: 3,
      departmentName: "Cardiology",
      isActive: true,
      isPopular: false,
      duration: 1440,
      requiresPreparation: false,
    },
    // Dermatology Services
    {
      id: 16,
      name: "Skin Biopsy",
      description: "Skin tissue examination for diagnostic purposes",
      price: 1800,
      currency: "₱",
      departmentId: 4,
      departmentName: "Dermatology",
      isActive: true,
      isPopular: false,
      duration: 30,
      requiresPreparation: false,
    },
    {
      id: 17,
      name: "Dermatoscopy",
      description: "Mole and lesion analysis using specialized imaging",
      price: 950,
      currency: "₱",
      departmentId: 4,
      departmentName: "Dermatology",
      isActive: true,
      isPopular: false,
      duration: 20,
      requiresPreparation: false,
    },
    {
      id: 18,
      name: "Patch Test",
      description: "Allergy testing to identify contact allergens",
      price: 1200,
      currency: "₱",
      departmentId: 4,
      departmentName: "Dermatology",
      isActive: true,
      isPopular: false,
      duration: 15,
      requiresPreparation: false,
    },
    // Neurology Services
    {
      id: 19,
      name: "EEG",
      description: "Brain wave analysis to evaluate neurological function",
      price: 1500,
      currency: "₱",
      departmentId: 5,
      departmentName: "Neurology",
      isActive: true,
      isPopular: false,
      duration: 60,
      requiresPreparation: true,
    },
    {
      id: 20,
      name: "Nerve Conduction Study",
      description: "Nerve function testing to diagnose nerve disorders",
      price: 2200,
      currency: "₱",
      departmentId: 5,
      departmentName: "Neurology",
      isActive: true,
      isPopular: false,
      duration: 45,
      requiresPreparation: false,
    },
    {
      id: 21,
      name: "EMG",
      description:
        "Muscle activity measurement to evaluate muscle and nerve function",
      price: 1800,
      currency: "₱",
      departmentId: 5,
      departmentName: "Neurology",
      isActive: true,
      isPopular: false,
      duration: 45,
      requiresPreparation: false,
    },
    // Orthopedics Services
    {
      id: 22,
      name: "Bone Density Scan",
      description: "Osteoporosis screening and bone health assessment",
      price: 1600,
      currency: "₱",
      departmentId: 6,
      departmentName: "Orthopedics",
      isActive: true,
      isPopular: false,
      duration: 20,
      requiresPreparation: false,
    },
    {
      id: 23,
      name: "Joint Injection",
      description:
        "Therapeutic joint injection for pain relief and inflammation",
      price: 2500,
      currency: "₱",
      departmentId: 6,
      departmentName: "Orthopedics",
      isActive: true,
      isPopular: false,
      duration: 30,
      requiresPreparation: false,
    },
    // Ophthalmology Services
    {
      id: 24,
      name: "Eye Exam",
      description: "Comprehensive eye examination for vision and eye health",
      price: 800,
      currency: "₱",
      departmentId: 7,
      departmentName: "Ophthalmology",
      isActive: true,
      isPopular: false,
      duration: 30,
      requiresPreparation: false,
    },
    {
      id: 25,
      name: "Retinal Screening",
      description: "Retinal health assessment for early disease detection",
      price: 1200,
      currency: "₱",
      departmentId: 7,
      departmentName: "Ophthalmology",
      isActive: true,
      isPopular: false,
      duration: 20,
      requiresPreparation: false,
    },
    {
      id: 26,
      name: "Glaucoma Test",
      description: "Intraocular pressure testing for glaucoma screening",
      price: 900,
      currency: "₱",
      departmentId: 7,
      departmentName: "Ophthalmology",
      isActive: true,
      isPopular: false,
      duration: 15,
      requiresPreparation: false,
    },
    // Gastroenterology Services
    {
      id: 27,
      name: "Colonoscopy",
      description: "Colon examination for cancer screening and diagnosis",
      price: 8500,
      currency: "₱",
      departmentId: 8,
      departmentName: "Gastroenterology",
      isActive: true,
      isPopular: false,
      duration: 60,
      requiresPreparation: true,
    },
    {
      id: 28,
      name: "Endoscopy",
      description: "Upper GI tract examination for diagnostic purposes",
      price: 6500,
      currency: "₱",
      departmentId: 8,
      departmentName: "Gastroenterology",
      isActive: true,
      isPopular: false,
      duration: 45,
      requiresPreparation: true,
    },
    {
      id: 29,
      name: "H. Pylori Test",
      description: "Bacterial infection testing for stomach ulcers",
      price: 650,
      currency: "₱",
      departmentId: 8,
      departmentName: "Gastroenterology",
      isActive: true,
      isPopular: false,
      duration: 10,
      requiresPreparation: false,
    },
  ];

  const popularServices = allServices.filter((service) => service.isPopular);

  const updateSubCartDoctor = (
    departmentId: number,
    doctorId: number | null
  ) => {
    // Update the currently selected subcart if it's the one being modified
    if (selectedSubCart && selectedSubCart.departmentId === departmentId) {
      setSelectedSubCart({
        ...selectedSubCart,
        selectedDoctorId: doctorId,
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
    const incompleteSubCarts = getSubCarts().filter(
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
      doctorsPerDepartment: getSubCarts().map((subCart) => ({
        departmentId: subCart.departmentId,
        doctorId: subCart.selectedDoctorId,
      })),
    };

    console.log("Proceeding to checkout with data:", checkoutData);
    alert(
      `Checkout initiated for ${getTotalItems()} items totaling ₱${getTotalPrice().toLocaleString()}`
    );
  };

  const handleSubCartClick = (subCart: SubCart) => {
    const currentSubCarts = getSubCarts();
    const currentSubCart = currentSubCarts.find(
      (sc) => sc.departmentId === subCart.departmentId
    );
    setSelectedSubCart(currentSubCart || null);
    setSubCartDialogVisible(true);
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
        selectedDoctorId:
          selectedSubCart?.departmentId === departmentId
            ? selectedSubCart.selectedDoctorId
            : null,
      };
    });
  }, [cartItems, departments, selectedSubCart]);

  const subCarts = getSubCarts();

  useEffect(() => {
    if (selectedSubCart && subCartDialogVisible) {
      const updatedSubCarts = getSubCarts();
      const updatedSelectedSubCart = updatedSubCarts.find(
        (subCart) => subCart.departmentId === selectedSubCart.departmentId
      );

      // Only update if the subcart actually changed
      if (
        updatedSelectedSubCart &&
        JSON.stringify(updatedSelectedSubCart) !==
          JSON.stringify(selectedSubCart)
      ) {
        setSelectedSubCart(updatedSelectedSubCart);
      } else if (!updatedSelectedSubCart) {
        // If no items left in this department, close the dialog
        setSubCartDialogVisible(false);
        setSelectedSubCart(null);
      }
    }
  }, [cartItems, selectedSubCart, subCartDialogVisible, getSubCarts]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
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
            onClick={handleCheckout}
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
        {/* Departments or Services Section */}
        <div className="col-span-2 p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20 h-[calc(100vh-150px)] flex flex-col">
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
        </div>

        {/* Popular Services */}
        <div className="p-6 text-white shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl h-[calc(100vh-150px)] flex flex-col">
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
                  <div className="text-right">
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
        <div className="p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20 h-[calc(100vh-150px)] flex flex-col">
          <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
            Cart Summary
          </h2>
          <div
            className={`flex-1 pr-1 mb-4 space-y-3 overflow-y-auto overflow-x-hidden ${scrollbarTheme}`}
          >
            {subCarts.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              subCarts.map((subCart) => {
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
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">
                            ₱{subCart.totalAmount.toLocaleString()}
                          </p>
                          {hasDoctorSelected && (
                            <p className="text-xs text-gray-500">
                              Doctor selected
                            </p>
                          )}
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
              <Button className="w-full py-3 text-white transition-all duration-300 transform border-none shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl hover:from-emerald-600 hover:to-teal-700 hover:scale-105">
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          )}
        </div>
      </div>

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
                onChange={(e) =>
                  updateSubCartDoctor(
                    selectedSubCart.departmentId,
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
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
                    removeAllFromDepartment(selectedSubCart.departmentId);
                    setSubCartDialogVisible(false);
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
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Select services from departments • Add to cart • Proceed to payment
        </p>
      </div>
    </div>
  );
};

export default OrderPage;
