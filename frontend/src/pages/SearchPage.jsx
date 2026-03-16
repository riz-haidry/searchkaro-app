import React, { useState } from "react";
import { searchAPI } from "../api";
import { Search, MapPin, Filter, AlertCircle, ShoppingBag, Star, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Quick Search Categories
  const popularCategories = ["Fashion", "Electronics", "Bakery", "Grocery"];

  //  handleSearch Function
  const handleSearch = async (e, quickQuery = null) => {
    if (e) e.preventDefault();
    
    // Agar item par click kiya hai toh wo query use hogi, warna state wali
    const searchQuery = quickQuery || query;
    
    if (!searchQuery.trim() && !location.trim()) {
      toast.error("Kuch toh type kijiye search karne ke liye!");
      return;
    }
    
    setLoading(true);
    try {
      
      const response = await searchAPI({ q: searchQuery, loc: location });
      console.log("📥 API Response:", response.data); 
      
      setResults(response.data);
      
      if (response.data.length === 0) {
         toast("Koi results nahi mile.", { icon: '🔍' });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed! Backend connection check karein.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/*  HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
            <Search className="text-teal-500 w-10 h-10" strokeWidth={3} /> Search Karo
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Nagpur ke best shops aur services dhoondein</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {popularCategories.map(cat => (
            <button 
              key={cat}
              onClick={() => { setQuery(cat); handleSearch(null, cat); }}
              className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold hover:bg-teal-500 hover:text-white transition-all active:scale-90"
            >
              #{cat}
            </button>
          ))}
        </div>
      </div>
      
      {/*  SEARCH BOX */}
      <form onSubmit={handleSearch} className="bg-white p-2.5 rounded-3xl shadow-2xl shadow-teal-900/5 border border-gray-100 flex flex-col md:flex-row gap-2 mb-12">
        <div className="flex-[1.5] flex items-center px-5 py-4 gap-4 border-b md:border-b-0 md:border-r border-gray-100 group">
          <Filter className="text-teal-500 w-6 h-6 group-focus-within:rotate-180 transition-transform duration-500" />
          <input 
            type="text" 
            placeholder="Shops, Products, Categories..." 
            className="w-full outline-none text-gray-800 font-bold placeholder:text-gray-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 flex items-center px-5 py-4 gap-4">
          <MapPin className="text-orange-500 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Location (e.g. Itwari)" 
            className="w-full outline-none text-gray-800 font-bold placeholder:text-gray-300"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-teal-500 text-white px-12 py-5 rounded-2xl font-black hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/20 active:scale-95 flex items-center justify-center gap-2 group"
        >
          {loading ? "SEARCHING..." : <><Search size={20} strokeWidth={3} className="group-hover:scale-125 transition-transform" /> SEARCH</>}
        </button>
      </form>
      
      {/* RESULTS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin"></div>
            <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-500 w-8 h-8 animate-pulse" />
          </div>
          <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">Finding Nagpur's Best...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((item) => (
            <div key={item._id} className="bg-white group rounded-[2.5rem] shadow-sm border border-gray-100 p-8 hover:shadow-2xl hover:border-teal-100 transition-all duration-500 relative overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:bg-teal-500 transition-colors duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 group-hover:bg-white transition-colors shadow-inner">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full uppercase tracking-tighter mb-2">
                      {item.role || "Verified"}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={12} fill="currentColor" /> <span className="text-xs font-bold text-gray-400">4.5</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-teal-600 transition-colors capitalize">
                  {item.product || item.categoryName}
                </h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                  Nagpur ki trusted service ab aapke area mein available hai.
                </p>
                
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-900 font-black text-xs">
                    <div className="p-1.5 bg-orange-50 rounded-lg"><MapPin size={14} className="text-orange-500" /></div>
                    {item.location || "Nagpur"}
                  </div>
                  <button className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
           <div className="p-6 bg-white rounded-full shadow-xl mb-6">
              <AlertCircle className="w-16 h-16 text-gray-200" strokeWidth={1} />
           </div>
           <h3 className="text-2xl font-black text-gray-700">No results found, Rizwan!</h3>
           <p className="text-gray-400 mt-2 font-medium max-w-xs mx-auto">Try Nagpur ke famous areas ya common categories search karke dekhein.</p>
        </div>
      )}
    </div>
  );
}