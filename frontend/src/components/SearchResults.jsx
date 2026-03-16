import React from "react";
import Card from "./Card";
import { ShoppingBag, MapPin, AlertCircle } from "lucide-react";

export default function SearchResults({ results, loading, error }) {
  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Searching Nagpur's Best...</p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-medium">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  // 3. Empty State
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
        <ShoppingBag className="mx-auto w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-700">Koi results nahi mile</h3>
        <p className="text-gray-400 text-sm mt-1">Alag keyword ya location try karein.</p>
      </div>
    );
  }

  // 4. Professional Results Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {results.map((item) => (
        <Card 
          key={item._id} 
          title={item.categoryName || item.product || "Business Name"} 
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black bg-teal-50 text-teal-600 px-2 py-1 rounded-md uppercase w-fit">
              {item.role || "Verified Listing"}
            </div>
            
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
              Nagpur ki premium service ab aapke area mein. Genuine products aur best rates ke saath.
            </p>

            <div className="pt-3 border-t border-gray-50 flex items-center gap-2 text-orange-600 font-bold text-xs">
              <MapPin size={14} strokeWidth={3} />
              {item.location || "Nagpur, MH"}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}