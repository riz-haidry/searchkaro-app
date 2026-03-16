/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Folder, FileText, Lock, MapPin,
  Star, LogOut, ChevronLeft, ChevronRight, X, Search, Sparkles
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Categories", path: "/categories", icon: Folder },
  { name: "Search Karo", path: "/search", icon: Search },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Legal Policy", path: "/legal-policy", icon: Lock },
  { name: "Location", path: "/location", icon: MapPin },
  { name: "Rating", path: "/rating", icon: Star },
];

export default function Sidebar({ isOpen, toggle }) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef(null);

  const confirmLogout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    navigate("/login");
  };

  const closeModal = () => {
    setShowDialog(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (showDialog) {
      setCountdown(3);
      timerRef.current = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timerRef.current);
            confirmLogout();
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showDialog]);

  const sidebarWidth = isOpen ? "w-72" : "w-20";
  const justify = isOpen ? "justify-start" : "justify-center";

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden" onClick={toggle} />
      )}


<aside className={`bg-gray-950 fixed top-0 left-0 z-[100] h-screen ${sidebarWidth} 
  transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-r border-white/5 
  ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
  overflow-hidden md:overflow-visible`}
>
        
        <div className="flex items-center justify-between px-6 h-24 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center">
                <div className="p-2 bg-teal-500 rounded-xl text-white">
                    <Sparkles size={18} />
                </div>
                <span className={`ml-3 text-white text-xl font-black tracking-tighter transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0 invisible absolute"}`}>
                    Search<span className="text-teal-400">Karo</span>
                </span>
            </div>

            <button 
                onClick={toggle} 
                className="md:hidden p-2 bg-white/10 text-white rounded-xl hover:bg-teal-500 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto no-scrollbar py-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all duration-300 ${isActive ? "bg-teal-500 text-white shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"} ${justify}`}
            >
              <item.icon size={20} className="shrink-0" />
              <span className={`font-bold uppercase text-[10px] tracking-widest ${isOpen ? "opacity-100" : "opacity-0 absolute invisible"}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => setShowDialog(true)} className={`w-full flex items-center ${justify} gap-3 py-3 px-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-black text-[10px] tracking-widest`}>
            <LogOut size={18} />
            <span className={isOpen ? "block" : "hidden"}>LOGOUT</span>
          </button>
        </div>

        <button 
            onClick={toggle} 
            className="hidden md:flex absolute top-24 -right-4 w-9 h-9 rounded-full bg-teal-500 text-white items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-[110] border-4 border-gray-950"
        >
          {isOpen ? <ChevronLeft size={18} strokeWidth={3} /> : <ChevronRight size={18} strokeWidth={3} />}
        </button>
      </aside>

      
      {showDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <LogOut className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight uppercase">Logout?</h2>
            <p className="text-gray-500 mb-6 text-sm font-medium leading-relaxed">Closing session in {countdown}s</p>
            <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-500" onClick={closeModal}>CANCEL</button>
                <button className="flex-1 py-3 rounded-xl bg-red-500 font-black text-white" onClick={confirmLogout}>EXIT</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}