/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Plus, X, Trash2, Search, ChevronDown, PackageCheck } from "lucide-react"; 
import { getCategories, addCategory, deleteCategory } from "../api"; 
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import toast from 'react-hot-toast';
import ConfirmModal from "../components/ConfirmModal"; 

export default function Categories() {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); 

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    role: "",
    categoryName: "", 
    product: "",    
  });

  const categoryData = {
    "Electronics & Gadgets": ["Smartphones", "Laptops", "Audio & Headphones", "Cameras", "Wearable Tech", "Home Appliances"],
    "Mens Fashion": ["T-Shirts", "Formal Shirts", "Denim & Jeans", "Footwear", "Watches", "Accessories"],
    "Womens Fashion": ["Sarees & Ethnic", "Western Wear", "Jewellery", "Handbags", "Footwear", "Beauty & Care"],
    "Home & Kitchen": ["Cookware", "Kitchen Appliances", "Furniture", "Home Decor", "Bedding", "Tools & Utility"],
    "Grocery & Essentials": ["Daily Staples", "Beverages", "Snacks & Foods", "Personal Care", "Cleaning Supplies"],
    "Pharmacy & Wellness": ["Prescription Meds", "Health Supplements", "Personal Hygiene", "First Aid", "Fitness Gear"],
    "Books & Stationery": ["Academic Books", "Fiction/Non-Fiction", "Office Supplies", "Art Materials", "School Stationery"]
  };

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setFormData({
      ...formData,
      categoryName: selectedCat,
      product: "" 
    });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchCategories();
  }, [isAuthenticated]);

  const handleOpenModal = (item) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
  };

  const handleFinalDelete = async () => {
    const loadingToast = toast.loading("Deleting...");
    try {
      await deleteCategory(itemToDelete._id);
      setCategories(categories.filter(item => item._id !== itemToDelete._id));
      addNotification("Category Removed", `${itemToDelete.product || itemToDelete.categoryName} delete kar diya gaya.`);
      toast.success("Deleted successfully!", { id: loadingToast });
    } catch (err) {
      toast.error("Delete failed!", { id: loadingToast });
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role || !formData.categoryName || !formData.product) {
        toast.error("Pehle saare options select karein!");
        return;
    }
    const savingToast = toast.loading("Saving to Database...");
    try {
      const response = await addCategory(formData);
      if (response.status === 201 || response.status === 200) {
        setShowDialog(false);
        addNotification(
          "New Entry Published", 
          `${formData.product} has been successfully added to ${formData.categoryName}.`
        );
        setFormData({ role: "", categoryName: "", product: "" });
        fetchCategories();
        toast.success("Successfully Published!", { id: savingToast });
      }
    } catch (err) {
      toast.error("Backend Error! Please check terminal.", { id: savingToast });
    }
  };

  const filteredData = categories.filter(item => {
    const cat = (item.categoryName || "").toString().toLowerCase();
    const prod = (item.product || "").toString().toLowerCase();
    const role = (item.role || "").toString().toLowerCase();
    return cat.includes(searchTerm.toLowerCase()) || 
           prod.includes(searchTerm.toLowerCase()) ||
           role.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <PackageCheck className="text-teal-500 w-7 h-7 sm:w-8 sm:h-8" /> Inventory Dashboard
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm sm:text-base">Manage professional listings for Nagpur Store</p>
        </div>
        <button 
          onClick={() => setShowDialog(true)} 
          className="w-full md:w-auto bg-teal-500 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-600 transition-all shadow-xl shadow-teal-100 font-black uppercase text-xs tracking-widest active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New Listing
        </button>
      </div>

      {/* SEARCH SECTION */}
      <div className="mb-8 relative max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by category..."
          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all shadow-sm font-bold text-gray-700 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100 hidden sm:table-header-group">
              <tr>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Rank</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Listing Type</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Parent Category</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Sub-Category / Brand</th>
                <th className="px-6 py-6 text-right font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 block sm:table-row-group">
              {loading ? (
                <tr><td colSpan="5" className="p-16 text-center text-teal-500 font-black uppercase text-xs tracking-widest animate-pulse">Synchronizing Data...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item._id} className="hover:bg-teal-50/30 transition-colors group block sm:table-row p-4 sm:p-0">
                    <td className="px-6 py-5 text-gray-400 font-bold text-sm hidden sm:table-cell">{index + 1}</td>
                    
                    
                    <td className="px-0 sm:px-6 py-2 sm:py-5 block sm:table-cell">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${item.role === 'Seller' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {item.role}
                      </span>
                    </td>

                    
                    <td className="px-0 sm:px-6 py-1 sm:py-5 text-sm font-black text-gray-800 block sm:table-cell mt-2 sm:mt-0">
                      {item.categoryName || "-"}
                    </td>

                    
                    <td className="px-0 sm:px-6 py-2 sm:py-5 block sm:table-cell">
                      <span className="text-sm text-gray-600 font-bold bg-gray-50 sm:bg-gray-50/50 rounded-xl px-3 py-1 inline-block">
                        {item.product || "-"}
                      </span>
                    </td>

                    
                    <td className="px-0 sm:px-6 py-3 sm:py-5 text-right block sm:table-cell border-t sm:border-none mt-4 sm:mt-0 pt-4 sm:pt-0">
                      <button 
                        onClick={() => handleOpenModal(item)} 
                        className="text-gray-300 hover:text-red-600 p-3 rounded-2xl hover:bg-red-50 transition-all active:scale-75 flex ml-auto sm:inline-block items-center gap-2"
                      >
                        <span className="sm:hidden text-[10px] font-black uppercase">Delete Item</span>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold italic">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {showDialog && (
        <div className="fixed inset-0 bg-gray-950/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl w-full max-w-lg p-8 sm:p-10 transform transition-all border border-white/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Add Listing</h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Flipkart Professional Interface</p>
              </div>
              <button onClick={() => setShowDialog(false)} className="bg-gray-50 hover:bg-red-50 p-3 rounded-full transition-all">
                <X className="text-gray-300 w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-6 sm:pb-0">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Merchant Type</label>
                <select 
                  className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-teal-500 outline-none bg-gray-50/50 font-black text-gray-700 text-sm" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="">Select Business Type</option>
                  <option value="Buyer">Standard Customer</option>
                  <option value="Seller">Verified Merchant</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Parent Category</label>
                <div className="relative">
                  <select 
                    className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-teal-500 outline-none bg-gray-50/50 font-black text-gray-700 text-sm appearance-none" 
                    value={formData.categoryName}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Choose Category...</option>
                    {Object.keys(categoryData).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                </div>
              </div>

              <div className={!formData.categoryName ? "opacity-30" : ""}>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Sub-Category</label>
                <div className="relative">
                  <select 
                    disabled={!formData.categoryName}
                    className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-teal-500 outline-none bg-gray-50/50 font-black text-gray-700 text-sm appearance-none" 
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                  >
                    <option value="">Select Sub-Category...</option>
                    {formData.categoryName && categoryData[formData.categoryName].map(prod => (
                      <option key={prod} value={prod}>{prod}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button type="button" onClick={() => setShowDialog(false)} className="order-2 sm:order-1 flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest">Dismiss</button>
                <button type="submit" className="order-1 sm:order-2 flex-[1.5] bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-teal-500 transition-all uppercase text-[10px] tracking-widest">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleFinalDelete} 
        itemName={itemToDelete?.product || itemToDelete?.categoryName || "this item"} 
      />
    </div>
  );
}

