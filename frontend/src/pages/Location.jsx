/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Plus, X, Trash2, Search, MapPin, ChevronDown } from "lucide-react"; 
import { getLocations, addLocation, deleteLocation } from "../api"; 
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext"; 
import toast from 'react-hot-toast';
import ConfirmModal from "../components/ConfirmModal"; 

export default function Location() {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotifications(); 
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    role: "",
    city: "Nagpur",
    region: "",   
  });

  const nagpurMapping = {
    "Central Nagpur": ["Sitabuldi", "Itwari", "Gandhibagh", "Mahal", "Dhantoli"],
    "West Nagpur": ["Dharampeth", "Ramdaspeth", "Gokulpeth", "Shankar Nagar", "Ambazari"],
    "South Nagpur": ["Manish Nagar", "Somalwada", "Narendra Nagar", "Besas", "Ayodhya Nagar"],
    "East Nagpur": ["Lakadganj", "Kalamna", "Wardhaman Nagar", "Pardi"],
    "North Nagpur": ["Jaripatka", "Koradi Road", "Mankapur", "Kamptee Road"]
  };

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await getLocations();
      setLocations(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("Failed to load locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchLocations();
  }, [isAuthenticated]);

  const handleRegionChange = (e) => {
    setFormData({ ...formData, region: e.target.value, city: "" });
  };

  const handleOpenModal = (item) => {
    setItemToDelete(item);
    setIsConfirmOpen(true);
  };

  const handleFinalDelete = async () => {
    const loadingToast = toast.loading("Deleting location...");
    try {
      await deleteLocation(itemToDelete._id || itemToDelete.id);
      setLocations(locations.filter(item => (item._id || item.id) !== (itemToDelete._id || itemToDelete.id)));
      addNotification("Location Removed", `${itemToDelete.city} (${itemToDelete.region}) delete kar diya gaya.`);
      toast.success("Location deleted!", { id: loadingToast });
    } catch (err) {
      toast.error("Delete failed!", { id: loadingToast });
    } finally {
      setIsConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role || !formData.city || !formData.region) {
        toast.error("Please fill all Nagpur locality details!");
        return;
    }
    const savingToast = toast.loading("Saving Nagpur location...");
    try {
      const response = await addLocation(formData);
      if (response.status === 201 || response.status === 200) {
        setShowDialog(false);
        addNotification(
          "New Nagpur Area Added", 
          `${formData.city} in ${formData.region} added for ${formData.role}.`
        );
        setFormData({ role: "", city: "", region: "" });
        fetchLocations();
        toast.success("Nagpur location saved!", { id: savingToast });
      }
    } catch (err) {
      toast.error("Failed to add location.", { id: savingToast });
    }
  };

  const filteredLocations = locations.filter(item => {
    const city = (item.city || "").toLowerCase();
    const region = (item.region || "").toLowerCase();
    const role = (item.role || "").toLowerCase();
    return city.includes(searchTerm.toLowerCase()) || 
           region.includes(searchTerm.toLowerCase()) ||
           role.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* RESPONSIVE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <MapPin className="text-orange-500 w-7 h-7 sm:w-8 sm:h-8" /> Nagpur Service Areas
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm sm:text-base">Manage local delivery zones and business regions</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="w-full md:w-auto bg-orange-500 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 font-black uppercase text-xs tracking-widest active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New Area
        </button>
      </div>

      {/*  SEARCH SECTION */}
      <div className="mb-8 relative max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search Sitabuldi, Dharampeth..."
          className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm font-bold text-gray-700 text-sm"
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
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Index</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Profile Type</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Locality (Area)</th>
                <th className="px-6 py-6 font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Nagpur Zone</th>
                <th className="px-6 py-6 text-right font-black text-gray-400 text-[10px] uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 block sm:table-row-group">
              {loading ? (
                <tr><td colSpan="5" className="p-16 text-center text-orange-500 font-black animate-pulse uppercase text-xs tracking-widest">Syncing Nagpur Map...</td></tr>
              ) : filteredLocations.length > 0 ? (
                filteredLocations.map((item, index) => (
                  <tr key={item._id || item.id} className="hover:bg-orange-50/30 transition-colors group block sm:table-row p-4 sm:p-0">
                    <td className="px-6 py-5 text-gray-400 font-bold text-sm hidden sm:table-cell">{index + 1}</td>
                    
                    {/* Role Badge */}
                    <td className="px-0 sm:px-6 py-2 sm:py-5 block sm:table-cell">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-sm ${item.role === 'Seller' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {item.role}
                      </span>
                    </td>

                    {/* Area Name  */}
                    <td className="px-0 sm:px-6 py-1 sm:py-5 text-base sm:text-sm font-black text-gray-800 block sm:table-cell mt-2 sm:mt-0">
                      {item.city || "-"}
                    </td>

                    {/* Zone  */}
                    <td className="px-0 sm:px-6 py-1 sm:py-5 text-sm text-gray-500 font-bold block sm:table-cell">
                      <span className="sm:bg-transparent bg-gray-50 px-2 py-0.5 rounded-lg sm:p-0">
                        {item.region || "-"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-0 sm:px-6 py-3 sm:py-5 text-right block sm:table-cell border-t sm:border-none mt-4 sm:pt-0 pt-4">
                      <button 
                        onClick={() => handleOpenModal(item)} 
                        className="text-gray-300 hover:text-red-600 p-3 rounded-2xl hover:bg-red-50 transition-all active:scale-75 flex ml-auto sm:inline-block items-center gap-2"
                      >
                        <span className="sm:hidden text-[10px] font-black uppercase">Remove Zone</span>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold italic">No Nagpur locations mapped yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/*  NAGPUR LOCALITY DIALOG */}
      {showDialog && (
        <div className="fixed inset-0 bg-gray-950/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl w-full max-w-md p-8 sm:p-10 transform transition-all border border-white/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Add Locality</h2>
              <button onClick={() => setShowDialog(false)} className="bg-gray-50 hover:bg-red-50 p-3 rounded-full transition-all group">
                <X className="text-gray-300 group-hover:text-red-500 w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 pb-6 sm:pb-0">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Service Role</label>
                <select 
                  className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-orange-500 outline-none bg-gray-50/50 font-bold text-gray-700 text-sm cursor-pointer transition-all" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="">Select Role</option>
                  <option value="Buyer">Standard Service Area</option>
                  <option value="Seller">Merchant Hub (Nagpur)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nagpur Zone (Region)</label>
                <div className="relative">
                  <select 
                    className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-orange-500 outline-none bg-gray-50/50 font-bold text-gray-700 text-sm cursor-pointer appearance-none" 
                    value={formData.region}
                    onChange={handleRegionChange}
                  >
                    <option value="">Select Zone...</option>
                    {Object.keys(nagpurMapping).map(reg => <option key={reg} value={reg}>{reg}</option>)}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                </div>
              </div>

              <div className={!formData.region ? "opacity-40" : ""}>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Specific Locality</label>
                <div className="relative">
                  <select 
                    disabled={!formData.region}
                    className="w-full border-2 border-gray-50 p-4 rounded-2xl focus:border-orange-500 outline-none bg-gray-50/50 font-bold text-gray-700 text-sm cursor-pointer appearance-none disabled:cursor-not-allowed" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  >
                    <option value="">{formData.region ? `Select Area in ${formData.region}...` : "Select Zone First"}</option>
                    {formData.region && nagpurMapping[formData.region].map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setShowDialog(false)} className="order-2 sm:order-1 flex-1 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" className="order-1 sm:order-2 flex-[1.5] bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-orange-500 shadow-2xl shadow-orange-100 transition-all uppercase text-[10px] tracking-widest active:scale-95">Map Locality</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={handleFinalDelete} 
        itemName={itemToDelete?.city ? `${itemToDelete.city} (${itemToDelete.region})` : "this location"} 
      />
    </div>
  );
}