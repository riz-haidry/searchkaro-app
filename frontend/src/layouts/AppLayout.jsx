import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
  // Mobile par default closed (false)
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />

      {/* 2. Main Content Wrapper  */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? "md:ml-72 ml-0" 
            : "md:ml-20 ml-0" 
        }`}
      >
        {/* 3. Navbar - Toggle function ke saath */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* 4. Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}