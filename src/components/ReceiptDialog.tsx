import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Printer, FileText, Hash } from "lucide-react";
import { CartItem, SubCart } from "../types/types";

interface ReceiptDialogProps {
  visible: boolean;
  onHide: () => void;
  cartItems: CartItem[];
  subCarts: SubCart[];
  totalAmount: number;
  totalItems: number;
  receiptType: "single" | "separated";
  onReceiptTypeChange: (type: "single" | "separated") => void;
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  visible,
  onHide,
  subCarts,
  totalAmount,
  totalItems,
  receiptType,
  onReceiptTypeChange,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      // Create print styles
      const printStyles = `
        <style>
          @media print {
            body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
            .receipt { max-width: 300px; margin: 0 auto; }
            .receipt-header { text-align: center; margin-bottom: 20px; }
            .receipt-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .receipt-info { font-size: 12px; margin-bottom: 5px; }
            .receipt-divider { border-top: 1px dashed #333; margin: 10px 0; }
            .receipt-section { margin-bottom: 15px; }
            .receipt-department { font-weight: bold; font-size: 14px; margin-bottom: 10px; }
            .receipt-item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; }
            .receipt-item-name { flex: 1; }
            .receipt-item-qty { margin: 0 10px; }
            .receipt-item-price { text-align: right; min-width: 60px; }
            .receipt-subtotal { display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; }
            .receipt-total { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #333; }
            .receipt-footer { text-align: center; margin-top: 20px; font-size: 10px; }
            .page-break { page-break-before: always; }
          }
        </style>
      `;

      document.body.innerHTML = printStyles + printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };
  };

  const generateReceiptNumber = () => {
    return `RCP-${Date.now().toString().slice(-8)}`;
  };

  const renderSingleReceipt = () => {
    const { date, time } = getCurrentDateTime();
    const receiptNumber = generateReceiptNumber();

    return (
      <div className="receipt">
        <div className="receipt-header">
          <div className="receipt-title">MEDICAL CENTER</div>
          <div className="receipt-info">Kiosk Service Receipt</div>
          <div className="receipt-divider"></div>
          <div className="receipt-info">Receipt #: {receiptNumber}</div>
          <div className="receipt-info">Date: {date}</div>
          <div className="receipt-info">Time: {time}</div>
        </div>

        <div className="receipt-divider"></div>

        {subCarts.map((subCart) => (
          <div key={subCart.departmentId} className="receipt-section">
            <div className="receipt-department">{subCart.departmentName}</div>
            <div className="receipt-info" style={{ marginBottom: "10px" }}>
              Doctor: {subCart.selectedDoctorName || "Not Selected"}
            </div>

            {subCart.items.map((item) => (
              <div key={item.id} className="receipt-item">
                <div className="receipt-item-name">{item.name}</div>
                <div className="receipt-item-qty">x{item.quantity}</div>
                <div className="receipt-item-price">
                  ₱{item.subtotal.toLocaleString()}
                </div>
              </div>
            ))}

            <div className="receipt-subtotal">
              <span>Subtotal:</span>
              <span>₱{subCart.totalAmount.toLocaleString()}</span>
            </div>

            <div className="receipt-divider"></div>
          </div>
        ))}

        <div className="receipt-total">
          <span>TOTAL ({totalItems} items):</span>
          <span>₱{totalAmount.toLocaleString()}</span>
        </div>

        <div className="receipt-footer">
          <div style={{ marginTop: "20px" }}>
            Thank you for using our kiosk service!
          </div>
          <div>Please present this receipt at the respective departments.</div>
        </div>
      </div>
    );
  };

  const renderSeparatedReceipts = () => {
    const { date, time } = getCurrentDateTime();

    return (
      <>
        {subCarts.map((subCart, index) => {
          const receiptNumber = `${generateReceiptNumber()}-${index + 1}`;

          return (
            <div
              key={subCart.departmentId}
              className={`receipt ${index > 0 ? "page-break" : ""}`}
            >
              <div className="receipt-header">
                <div className="receipt-title">MEDICAL CENTER</div>
                <div className="receipt-info">
                  {subCart.departmentName} Department
                </div>
                <div className="receipt-divider"></div>
                <div className="receipt-info">Receipt #: {receiptNumber}</div>
                <div className="receipt-info">Date: {date}</div>
                <div className="receipt-info">Time: {time}</div>
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-section">
                <div className="receipt-info" style={{ marginBottom: "10px" }}>
                  Doctor: {subCart.selectedDoctorName || "Not Selected"}
                </div>

                {subCart.items.map((item) => (
                  <div key={item.id} className="receipt-item">
                    <div className="receipt-item-name">{item.name}</div>
                    <div className="receipt-item-qty">x{item.quantity}</div>
                    <div className="receipt-item-price">
                      ₱{item.subtotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="receipt-divider"></div>

              <div className="receipt-total">
                <span>TOTAL ({subCart.totalItems} items):</span>
                <span>₱{subCart.totalAmount.toLocaleString()}</span>
              </div>

              <div className="receipt-footer">
                <div style={{ marginTop: "20px" }}>
                  Thank you for using our kiosk service!
                </div>
                <div>
                  Please present this receipt at {subCart.departmentName}{" "}
                  Department.
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const dialogFooter = (
    <div className="flex justify-between w-full gap-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <RadioButton
            inputId="single"
            name="receiptType"
            value="single"
            onChange={(e) => onReceiptTypeChange(e.value)}
            checked={receiptType === "single"}
          />
          <label htmlFor="single" className="text-sm font-medium">
            Single Receipt
          </label>
        </div>
        <div className="flex items-center gap-2">
          <RadioButton
            inputId="separated"
            name="receiptType"
            value="separated"
            onChange={(e) => onReceiptTypeChange(e.value)}
            checked={receiptType === "separated"}
          />
          <label htmlFor="separated" className="text-sm font-medium">
            Separate by Department
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handlePrint}
          className="px-4 py-2 text-white transition-all duration-300 border-none shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button
          onClick={onHide}
          className="px-4 py-2 text-gray-700 transition-all duration-300 border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-bold text-gray-800">Receipt</span>
        </div>
      }
      visible={visible}
      onHide={onHide}
      footer={dialogFooter}
      style={{ width: "600px" }}
      modal
      draggable={false}
      resizable={false}
      pt={{
        root: {
          className:
            "rounded-3xl border border-white/20 backdrop-blur-sm bg-white/95 shadow-2xl overflow-hidden",
        },
        header: {
          className:
            "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-6 rounded-t-3xl",
        },
        content: {
          className: "p-6 bg-white max-h-[70vh] overflow-y-auto",
        },
        footer: {
          className: "p-6 bg-slate-50 border-t border-slate-200 rounded-b-3xl",
        },
      }}
    >
      <div ref={printRef} className="space-y-4">
        {/* Receipt Type Info */}
        <div className="p-4 rounded-lg bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              Receipt Type:{" "}
              {receiptType === "single"
                ? "Single Receipt"
                : "Separated by Department"}
            </span>
          </div>
          <p className="text-xs text-blue-600">
            {receiptType === "single"
              ? "All services will be combined in one receipt"
              : "Each department will have its own receipt"}
          </p>
        </div>

        {/* Receipt Preview */}
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg bg-gray-50">
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold text-gray-600">
              Receipt Preview
            </span>
          </div>
          <div
            style={{ fontFamily: "'Courier New', monospace", fontSize: "12px" }}
          >
            {receiptType === "single"
              ? renderSingleReceipt()
              : renderSeparatedReceipts()}
          </div>
        </div>

        {/* Summary Info */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalItems}
            </div>
            <div className="text-sm text-green-700">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₱{totalAmount.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Total Amount</div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ReceiptDialog;
