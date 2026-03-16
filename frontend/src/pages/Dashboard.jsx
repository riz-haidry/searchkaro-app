/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, getLocations, getRatings } from "../api"; 
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, MapPin, Tags, Star, CheckCircle, ArrowUpRight, TrendingUp, Users } from "lucide-react";
import SentimentChart from "../components/SentimentChart"; 

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Advanced Stats Logic
  const stats = {
    totalCategories: categories.length,
    totalLocations: locations.length,
    totalRatings: ratings.length,
    positiveReviews: ratings.filter(r => r.review === true).length,
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [catRes, locRes, ratRes] = await Promise.all([
          getCategories(),
          getLocations(),
          getRatings()
        ]);
        
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setLocations(Array.isArray(locRes.data) ? locRes.data : []);
        setRatings(Array.isArray(ratRes.data) ? ratRes.data : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        // Halka sa delay animation smoothly 
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6 animate-pulse">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-teal-500 animate-spin"></div>
          <LayoutDashboard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-500 w-8 h-8" />
        </div>
        <p className="text-gray-400 font-black uppercase text-xs tracking-[0.3em]">Synchronizing Cloud Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/*  GREETING SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-teal-600 to-teal-800 p-8 rounded-[2.5rem] shadow-2xl shadow-teal-900/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter mb-2">
            Salaam, {user?.name || "Rizwan"}! 👋
          </h1>
          <p className="text-teal-50/80 font-medium flex items-center gap-2">
            <TrendingUp size={16} /> Aapka Nagpur Store aaj <span className="text-white font-bold underline decoration-teal-300">Active</span> hai.
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
                <p className="text-[10px] font-black uppercase opacity-70">Project</p>
                <p className="text-sm font-bold tracking-tight">SearchKaro Admin</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-right">
                <p className="text-[10px] font-black uppercase opacity-70">Designation</p>
                <p className="text-sm font-bold tracking-tight">{user?.role || "Java Developer"}</p>
            </div>
        </div>
      </div>

      {/*  STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inventory" value={stats.totalCategories} icon={<Tags />} color="teal" />
        <StatCard title="Mapped Zones" value={stats.totalLocations} icon={<MapPin />} color="blue" />
        <StatCard title="Global Ratings" value={stats.totalRatings} icon={<Star />} color="yellow" />
        <StatCard title="Trust Factor" value={stats.positiveReviews} icon={<CheckCircle />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SENTIMENT CIRCLE GRAPH  */}
        <div className="lg:col-span-1">
          <SentimentChart positive={stats.positiveReviews} total={stats.totalRatings} />
        </div>

        {/*  RECENT CATEGORIES LIST */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-8 border-b border-gray-50">
            <h2 className="font-black text-gray-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <ArrowUpRight className="text-teal-500" size={18} /> Recent Inventory
            </h2>
            <button onClick={() => navigate('/categories')} className="group flex items-center gap-2 text-[10px] font-black text-teal-600 hover:text-teal-700 transition-all">
              EXPLORE ALL <div className="p-1.5 bg-teal-50 rounded-lg group-hover:translate-x-1 transition-transform"><ArrowUpRight size={12} /></div>
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-8 py-4">Vertical</th>
                  <th className="px-8 py-4">Listing Name</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.slice(0, 5).map((item) => (
                  <tr key={item._id} className="hover:bg-teal-50/20 transition-all cursor-default group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-tighter group-hover:text-teal-600 transition-colors">{item.categoryName || "-"}</span>
                    </td>
                    <td className="px-8 py-5 font-bold text-gray-800 text-sm">{item.product || "-"}</td>
                    <td className="px-8 py-5 text-right">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">Live</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*  RECENT LOCATIONS SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-gray-800 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <MapPin className="text-blue-500" size={18} /> Store Zones (Nagpur)
            </h2>
            <button onClick={() => navigate('/location')} className="text-[10px] font-black text-blue-600 hover:underline">MANAGE AREAS</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {locations.slice(0, 5).map((item) => (
                <div key={item._id} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-200 transition-all hover:bg-white">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{item.region}</p>
                    <p className="text-sm font-bold text-gray-800">{item.city || item.location}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

//  REFINED STATCARD COMPONENT
function StatCard({ title, value, icon, color }) {
  const colors = {
    teal: "text-teal-600 bg-teal-50 border-teal-500 shadow-teal-100",
    blue: "text-blue-600 bg-blue-50 border-blue-500 shadow-blue-100",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-500 shadow-yellow-100",
    green: "text-green-600 bg-green-50 border-green-500 shadow-green-100",
  };

  return (
    <div className={`bg-white p-6 rounded-[2rem] shadow-sm border-b-4 ${colors[color].split(' ')[2]} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
      <div className="flex justify-between items-center mb-6">
        <div className={`p-4 rounded-2xl transition-all group-hover:scale-110 duration-500 ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>
          {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
        </div>
        <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <div className="h-1 w-8 bg-gray-100 rounded-full mt-1"></div>
        </div>
      </div>
      <h3 className="text-4xl font-black text-gray-800 tracking-tighter">{value}</h3>
    </div>
  );
}