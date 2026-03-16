/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";
import { motion } from "framer-motion";
import SuccessModal from "../components/SuccessModal"; 

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (!form.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    
    if (!form.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    
    if (!form.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending signup request with payload:", form);
      const response = await signup(form);
      console.log("Signup response:", response);
      
      
      setIsModalOpen(true); 
      
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        let errorMessage = `Server Error: ${err.response.status}`;
        if (err.response.data && err.response.data.message) {
          errorMessage += ` - ${err.response.data.message}`;
        }
        setError(errorMessage);
      } else if (err.request) {
        setError("Network Error: Unable to reach server.");
      } else {
        setError(`Error: ${err.message || "Something went wrong!"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Animations
  const fadeSlideUp = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.17, 0.55, 0.55, 1] },
    },
  };

  const fadeSlideRight = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 0.85, 0.45, 1] },
    },
  };

  const fadeSlideLeft = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.9, ease: [0.15, 0.85, 0.45, 1] },
    },
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      
      {/* LEFT FORM SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.9, ease: "easeOut" }
        }}
        className="flex flex-col justify-center px-10 md:px-20"
      >
        <motion.h1 variants={fadeSlideUp} initial="hidden" animate="visible" className="text-4xl font-semibold mb-2">
          Create account
        </motion.h1>

        <motion.p variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="text-gray-500 mb-6">
          Let's get started with your 30 days trial
        </motion.p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 font-medium">{error}</p>}

          <motion.input
            variants={fadeSlideRight} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Full Name" type="text"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <motion.input
            variants={fadeSlideRight} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Email" type="email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <motion.input
            variants={fadeSlideRight} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Password" type="password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <motion.button
            variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
            type="submit"
            className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition duration-300 font-bold"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </motion.button>

          <motion.p variants={fadeSlideUp} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="text-sm text-gray-500">
            Already have an account? <a href="/login" className="text-cyan-600 font-medium">Log in</a>
          </motion.p>
        </form>
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div variants={fadeSlideLeft} initial="hidden" animate="visible" className="hidden md:flex items-center justify-center bg-gray-50">
        <img src="/Frame2.png" className="w-4/5" />
      </motion.div>

      {/*  MODAL INTEGRATION */}
      <SuccessModal 
        isOpen={isModalOpen} 
        onDashboardGo={() => navigate("/login")} 
      />
    </div>
  );
}