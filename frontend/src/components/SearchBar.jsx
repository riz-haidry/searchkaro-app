import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative group w-full">
      {/* Search Icon - Left Side */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300">
        <Search size={20} strokeWidth={2.5} />
      </div>

      {/* Modern Input Field */}
      <input
        type="text"
        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm 
                   focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none 
                   transition-all duration-300 text-gray-700 font-semibold placeholder:text-gray-300"
        value={value}
        onChange={onChange}
        placeholder="Shops, Products, or Services in Nagpur..."
      />

      {/* Focus Ring (Optional UI touch) */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent group-focus-within:border-teal-500/20 transition-all duration-300"></div>
    </div>
  );
}