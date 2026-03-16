/* eslint-disable react/prop-types */
import React from "react";

export default function Card({ title, value, icon, children, className = "" }) {
  return (
    <div className={`bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-teal-100 transition-all duration-300 group ${className}`}>
      <div className="flex items-start gap-4">
        {/* Icon Section */}
        {icon && (
          <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500 shadow-sm">
            <div className="text-2xl">{icon}</div>
          </div>
        )}

        <div className="flex-1">
          {/* Title - CategoryName ya Product Name yahan aayega */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">
            {title || "SearchKaro Listing"}
          </p>

          {/* Value - Stats ke liye (e.g. Total counts) */}
          {value !== undefined && (
            <h2 className="text-3xl font-black text-gray-800 leading-none mt-1">
              {value}
            </h2>
          )}

          {/* Children -  (Role, Location) dikhega */}
          <div className="mt-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}