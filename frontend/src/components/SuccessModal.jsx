import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SuccessModal = ({ isOpen, onDashboardGo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 py-8 px-6 text-center border border-gray-100">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-sans">Mubarak Ho!</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Aapka account successfully create ho gaya hai. Ab aap dashboard access kar sakte hain.
        </p>

        <button
          onClick={onDashboardGo}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          Go to Dashboard <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;