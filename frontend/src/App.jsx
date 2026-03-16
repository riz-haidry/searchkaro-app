import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Toaster } from 'react-hot-toast';

// Layout & Pages
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import ForgotPassword from "./pages/ForgotPassword";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import LegalPolicy from "./pages/LegalPolicy";
import Location from "./pages/Location";
import Rating from "./pages/Rating";

// --- PrivateRoute Wrapper ---
function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a]">
        <div className="relative">
          {/*  Loader with Glow */}
          <div className="h-24 w-24 rounded-full border-4 border-teal-500/10 border-t-teal-500 animate-spin shadow-[0_0_15px_rgba(20,184,166,0.2)]"></div>
          <div className="absolute inset-0 flex items-center justify-center text-teal-400 font-black text-xs animate-pulse">SK</div>
        </div>
        <p className="mt-6 text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] ml-1">
          Authenticating Node...
        </p>
      </div>
    );
  }
  
  //  Nesting Logic: AppLayout wraps the Outlet (Children)
  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          {/* Toaster configuration for consistent UI */}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'rounded-2xl font-bold text-sm shadow-2xl border border-white/10 backdrop-blur-md',
              style: { background: 'rgba(15, 23, 42, 0.9)', color: '#fff', padding: '16px 24px' },
              success: { iconTheme: { primary: '#14b8a6', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
            }} 
          />
          
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* --- PROTECTED ROUTES  --- */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/legal-policy" element={<LegalPolicy />} />
              <Route path="/location" element={<Location />} />
              <Route path="/rating" element={<Rating />} />
            </Route>

            {/* --- FALLBACKS --- */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* 404 Handler */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}