/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import NotificationDrawer from "./NotificationDrawer";
import { RxBell, RxPencil1 } from "react-icons/rx";
import { X, Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // AuthContext se user mangwaya
  const { notifications } = useNotifications();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  
  // Profile data ko user object se link kiya
  const [profileData, setProfileData] = useState({
    name: user?.name || "Rizwan",
    email: user?.email || "rizwan@example.com",
    role: user?.role || "Java Developer",
  });

  const dropdownRef = useRef(null);
  const userButtonRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    const titleMap = {
      '/dashboard': 'Dashboard',
      '/categories': 'Categories',
      '/reports': 'Reports',
      '/legal-policy': 'Legal Policy',
      '/location': 'Location',
      '/rating': 'Rating',
    };
    return titleMap[location.pathname] || 'Dashboard';
  };

  // User ke naam ke initials nikaalne ke liye logic
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "R";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name || "Rizwan");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          userButtonRef.current && !userButtonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setLogoutDialog(false);
    navigate("/login");
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm px-3 sm:px-6 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-lg sm:text-xl font-semibold text-gray-900">
            <span>{getPageTitle()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-all relative"
            >
              <RxBell className="h-6 w-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Avatar - Initials show honge */}
          <button
            ref={userButtonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-center h-10 w-10 rounded-full bg-teal-600 text-white font-bold shadow-md cursor-pointer transition-all ${
              isDropdownOpen ? "ring-4 ring-teal-100 scale-110" : "hover:scale-105"
            }`}
          >
            {initials}
          </button>

          {/* Dynamic User Dropdown */}
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 top-14 mt-2 w-72 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center pb-4 border-b border-gray-100">
                <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-inner">
                  {initials}
                </div>
                <div className="flex-grow overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900 truncate">
                      {user?.name || "Rizwan"}
                    </span>
                    <button onClick={() => { setShowProfileEdit(true); setIsDropdownOpen(false); }} className="text-gray-400 hover:text-teal-600 transition-colors">
                      <RxPencil1 />
                    </button>
                  </div>
                  <div className="text-[10px] text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full inline-block font-black uppercase tracking-tighter">
                    {user?.role || "Java Developer"}
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                 <p className="text-[10px] text-gray-400 font-bold uppercase mb-2 mt-1">Account Info</p>
                 <p className="text-xs text-gray-600 truncate">{user?.email || "rizwan@example.com"}</p>
              </div>

              <button onClick={() => setLogoutDialog(true)} className="mt-2 w-full bg-red-50 text-red-600 py-2.5 rounded-xl hover:bg-red-100 transition-colors font-bold text-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Logout Confirmation Dialog */}
      {logoutDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-90 duration-200">
            <h2 className="text-xl font-black text-gray-900 mb-2">Confirm Logout</h2>
            <p className="text-gray-500 text-sm mb-6">Rizwan, kya aap sach mein apne session ko end karna chahte hain?</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutDialog(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 flex-1 font-bold text-gray-600 transition-all">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 flex-1 font-bold transition-all">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}