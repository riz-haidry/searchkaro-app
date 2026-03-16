/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Plus, X, Star, Trash2, Search, MessageSquare, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import toast from "react-hot-toast"; 
import { getRatings, addRating, deleteRating } from "../api"; 
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext"; 
import ConfirmModal from "../components/ConfirmModal"; 

export default function Rating() {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications(); 
  
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [hover, setHover] = useState(0); 
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    categories: "",
    shop: "",
    rating: 5,
    review: true 
  });

  const shopCategories = ["Electronics", "Fashion", "Bakery", "Grocery", "Pharmacy"];

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await getRatings();
      setRatings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("Database error! Ratings load nahi hui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchRatings();
  }, [isAuthenticated]);

  const handleConfirmDelete = async () => {
    const idToUse = itemToDelete._id || itemToDelete.id;
    const loadingToast = toast.loading("Removing review...");
    try {
      await deleteRating(idToUse);
      setRatings(ratings.filter(item => (item._id || item.id) !== idToUse));
      toast.success("Review deleted!", { id: loadingToast });
      addNotification("Rating Deleted", `${itemToDelete.shop} ka feedback hata diya gaya.`);
      setIsConfirmModalOpen(false);
    } catch (err) {
      toast.error("Delete failed!", { id: loadingToast });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savingToast = toast.loading("Submitting feedback...");
    try {
      const response = await addRating(formData);
      if (response.status === 201 || response.status === 200) {
        setShowDialog(false);
        addNotification("New Review Received", `${formData.shop} got a ${formData.rating} star review.`);
        setFormData({ categories: "", shop: "", rating: 5, review: true });
        fetchRatings();
        toast.success("Thank you for the review!", { id: savingToast });
      }
    } catch (err) {
      toast.error("Error saving review.", { id: savingToast });
    }
  };

  const renderStars = (rating, size = "w-3.5 h-3.5") => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`${size} ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
        />
      ))}
    </div>
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <Star className="text-yellow-400 fill-yellow-400 w-8 h-8 sm:w-9 sm:h-9" /> Customer Voice
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base font-medium">Monitoring shop performance across Nagpur</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-600 shadow-xl shadow-gray-200 font-black uppercase text-xs tracking-widest transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Write A Review
        </button>
      </div>

      {/* SEARCH SECTION */}
      <div className="mb-8 relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Filter by shop or category..."
          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm font-bold text-gray-700 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/*  LIST/TABLE SECTION */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 hidden sm:table-header-group">
              <tr>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-center">No.</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Business Unit</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Customer Rating</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] text-center">Sentiment</th>
                <th className="px-6 py-6 text-right font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 block sm:table-row-group">
              {ratings.length > 0 ? ratings.map((item, index) => (
                <tr key={item._id || item.id} className="hover:bg-teal-50/30 transition-colors group block sm:table-row p-5 sm:p-0">
                  <td className="px-6 py-5 text-gray-400 font-bold text-center text-xs hidden sm:table-cell">{index + 1}</td>
                  
                  {/* Business Unit */}
                  <td className="px-0 sm:px-6 py-1 sm:py-5 block sm:table-cell">
                    <div className="font-black text-gray-900 text-base">{item.shop}</div>
                    <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{item.categories}</div>
                  </td>

                  {/* Rating */}
                  <td className="px-0 sm:px-6 py-3 sm:py-5 block sm:table-cell">
                    {renderStars(item.rating, "w-4 h-4")}
                  </td>

                  {/* Sentiment */}
                  <td className="px-0 sm:px-6 py-2 sm:py-5 block sm:table-cell sm:text-center">
                    <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black border-2 ${item.review ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                      {item.review ? <ThumbsUp size={10} strokeWidth={3} /> : <ThumbsDown size={10} strokeWidth={3} />}
                      {item.review ? "POSITIVE" : "NEGATIVE"}
                    </div>
                  </td>

                  {/* Actions  */}
                  <td className="px-0 sm:px-6 py-3 sm:py-5 text-right block sm:table-cell border-t sm:border-none mt-4 sm:mt-0 pt-4 sm:pt-0">
                    <button onClick={() => {setItemToDelete(item); setIsConfirmModalOpen(true);}} className="text-gray-300 hover:text-red-600 p-3 rounded-2xl hover:bg-red-50 transition-all active:scale-75 ml-auto sm:inline-block">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold italic">No feedback entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*  REVIEW MODAL */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-white/20 max-h-[95vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">New Experience</h3>
              <button onClick={() => setShowDialog(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors group">
                <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Category</label>
                <select 
                   required
                   className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-gray-700 text-sm"
                   value={formData.categories}
                   onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                >
                  <option value="">Select Category...</option>
                  {shopCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-gray-700 text-sm"
                  placeholder="e.g. Nagpur Electronics"
                  value={formData.shop}
                  onChange={(e) => setFormData({ ...formData, shop: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                  Quality Score <span>{formData.rating}/5</span>
                </label>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${star <= (hover || formData.rating) ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-200"}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col xs:flex-row bg-gray-50 p-2 rounded-[2rem] gap-2 shadow-inner border border-gray-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, review: true })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs transition-all ${formData.review ? "bg-white text-green-600 shadow-xl" : "text-gray-400"}`}
                  >
                    <ThumbsUp size={16} /> POSITIVE
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, review: false })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs transition-all ${!formData.review ? "bg-white text-red-600 shadow-xl" : "text-gray-400"}`}
                  >
                    <ThumbsDown size={16} /> NEGATIVE
                  </button>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => setShowDialog(false)} className="order-2 sm:order-1 flex-1 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Discard</button>
                <button type="submit" className="order-1 sm:order-2 flex-[1.5] py-4 bg-gray-900 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                  <CheckCircle size={14} /> Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete ? `${itemToDelete.shop} ka review` : ""}
      />
    </div>
  );
}