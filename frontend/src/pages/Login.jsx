/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import SuccessModal from "../components/SuccessModal"; 

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(form);
      if (res.success) {
        console.log("Login Successful:", res);
        setIsModalOpen(true); 
      } else {
        setError(res.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = import.meta.env.DEV ? "http://localhost:3000" : "https://searchkaro-backend.onrender.com";
    window.location.href = `${baseUrl}/googlelogin`;
  };

  // Animations
  const fadeSlideUp = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { duration: 0.7, ease: [0.17, 0.55, 0.55, 1] },
    },
  };

  const fadeSlideRight = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0, opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 0.85, 0.45, 1] },
    },
  };

  const fadeSlideLeft = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0, opacity: 1,
      transition: { duration: 0.9, ease: [0.15, 0.85, 0.45, 1] },
    },
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-white font-sans">
      
      {/* LEFT IMAGE */}
      <motion.div
        variants={fadeSlideLeft} initial="hidden" animate="visible"
        className="hidden md:flex items-center justify-center bg-gray-50 border-r border-gray-100"
      >
        <img src="/Frame.png" alt="Login Visual" className="w-4/5 h-auto drop-shadow-sm" />
      </motion.div>

      {/* RIGHT FORM SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.9, ease: "easeOut" } }}
        className="flex flex-col justify-center px-10 md:px-24"
      >
        <div className="max-w-md w-full mx-auto">
          <motion.h1 variants={fadeSlideUp} initial="hidden" animate="visible" className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Welcome back
          </motion.h1>
          <motion.p variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-gray-500 mb-8">
            Welcome back! Please enter your details.
          </motion.p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </motion.div>
            )}

            <motion.div variants={fadeSlideRight} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                placeholder="Enter your email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required
              />
            </motion.div>

            <motion.div variants={fadeSlideRight} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                placeholder="••••••••" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required
              />
            </motion.div>

            <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="flex justify-end">
              <Link to="/forgot-password" size="sm" className="text-sm font-semibold text-cyan-600 hover:text-cyan-700">
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.45 }} type="submit"
              className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 font-bold shadow-lg shadow-cyan-200 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </motion.button>

            <motion.div variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </motion.div>

            <motion.button
              variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.55 }}
              type="button" onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-all font-semibold text-gray-700 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </motion.button>

            <motion.p variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="text-center text-sm text-gray-500 mt-6">
              Don't have an account? <Link to="/signup" className="text-cyan-600 font-bold hover:underline">Sign up</Link>
            </motion.p>
          </form>
        </div>
      </motion.div>

      {/* SUCCESS MODAL*/}
      <SuccessModal 
        isOpen={isModalOpen} 
        onDashboardGo={() => navigate("/dashboard")} 
      />
    </div>
  );
}