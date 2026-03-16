import React from "react";
import { X, AlertCircle } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">Confirm Delete</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-gray-600">
            Kya aap sach mein <span className="font-bold text-gray-800">"{itemName}"</span> ko delete karna chahte hain?
          </p>
        </div>

        {/* Footer  */}
        <div className="flex gap-3 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 shadow-lg shadow-teal-200 transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}