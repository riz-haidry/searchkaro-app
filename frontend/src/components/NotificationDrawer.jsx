/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, BellOff, MapPin, Tag, Star } from "lucide-react";

import { useNotifications } from "../contexts/NotificationContext"; 

export default function NotificationDrawer({ isOpen, onClose }) {
  
  const notificationContext = useNotifications();
  
  if (!notificationContext) {
    return null; // 
  }

  const { notifications, markAsRead, clearAll } = notificationContext;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Helper function icon change karne ke liye title ke hisaab se
  const getIcon = (title) => {
    if (title.toLowerCase().includes('location')) return <MapPin size={14} className="text-blue-500" />;
    if (title.toLowerCase().includes('category')) return <Tag size={14} className="text-purple-500" />;
    return <Star size={14} className="text-teal-500" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[998]"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-80 bg-white shadow-2xl z-[999] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="font-bold text-gray-900 text-lg leading-tight font-sans">Notifications</h2>
                <p className="text-xs text-gray-500 font-medium">
                  {notifications.filter(n => !n.read).length} Unread messages
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Toolbar */}
            {notifications.length > 0 && (
              <div className="px-5 py-2.5 border-b bg-gray-50/50 flex justify-end">
                <button 
                  onClick={clearAll} 
                  className="text-xs font-bold text-red-500 flex items-center gap-1.5 hover:bg-red-50 px-2 py-1 rounded-lg transition-all active:scale-95"
                >
                  <Trash2 size={12}/> Clear All
                </button>
              </div>
            )}

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <BellOff className="w-8 h-8 text-gray-200"/>
                  </div>
                  <h3 className="font-bold text-gray-800">Sannata hai yahan!</h3>
                  <p className="text-sm text-gray-400 mt-1 font-sans">Abhi tak koi naya update nahi aaya hai.</p>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      variants={itemVariants}
                      layout
                      className={`relative p-4 rounded-2xl border transition-all cursor-default ${
                        n.read 
                          ? 'bg-white border-gray-100 opacity-70' 
                          : 'bg-teal-50/30 border-teal-100 shadow-sm'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.read ? 'bg-gray-200' : 'bg-teal-500 animate-pulse'}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getIcon(n.title)}
                            <h4 className={`text-sm font-bold ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</h4>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                          
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-[10px] font-medium text-gray-400 font-sans">{n.time}</span>
                            {!n.read && (
                              <button 
                                onClick={() => markAsRead(n.id)} 
                                className="text-[10px] font-bold text-teal-600 bg-teal-100/50 px-2 py-1 rounded-md hover:bg-teal-100 transition-colors"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}