import { Package, X, Minus, Plus } from "lucide-react";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import React from "react";
import { doctors } from "../@utils/data/data";

interface Props {
  subCartDialogVisible: boolean;
  setSubCartDialogVisible: (visible: boolean) => void;
  selectedSubCart: {
    departmentId: number;
    departmentName: string;
    totalItems: number;
    totalAmount: number;
    items: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
      quantity: number;
      subtotal: number;
      requiresPreparation?: boolean;
      duration?: number;
    }>;
    selectedDoctorId?: number | null;
  } | null;
  updateSubCartDoctor: (
    departmentId: number,
    doctorId: number | null,
    doctorName?: string | null
  ) => void;
  removeAllFromDepartment: (departmentId: number) => void;
  removeFromCart: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number) => void;
}

const SubcartDialog: React.FC<Props> = ({
  decreaseQuantity,
  increaseQuantity,
  removeAllFromDepartment,
  removeFromCart,
  selectedSubCart,
  setSubCartDialogVisible,
  subCartDialogVisible,
  updateSubCartDoctor,
}) => {
  return (
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
                  (doc) => doc.specializationId === selectedSubCart.departmentId
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
  );
};

export default SubcartDialog;
