/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { X, Plus, ShieldCheck, HelpCircle, AlertCircle } from "lucide-react";
import { getLegalPolicies } from "../api";

export default function LegalPolicy() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLegalPolicies = async () => {
      try {
        setLoading(true);
        const response = await getLegalPolicies();
        
        
        const rawData = response.data;
        
        if (rawData && rawData.success && Array.isArray(rawData.legalPolicies)) {
          const transformedFaqs = rawData.legalPolicies.map((policy) => ({
            id: policy._id || policy.id,
            question: policy.question,
            answer: policy.answer
          }));
          setFaqs(transformedFaqs);
          setError(null);
        } else if (Array.isArray(rawData)) {
          // Fallback agar backend direct array bhej de
          setFaqs(rawData.map(p => ({ id: p._id || p.id, question: p.question, answer: p.answer })));
          setError(null);
        } else {
          setError("Backend se sahi format mein data nahi mila.");
        }
      } catch (err) {
        console.error("Error fetching legal policies:", err);
        setError("Policies load nahi ho payi. Server check karein.");
      } finally {
        setLoading(false);
      }
    };

    fetchLegalPolicies();
  }, []);

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="text-gray-500 animate-pulse font-medium">Fetching Policies...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-teal-50 rounded-2xl mb-4">
          <ShieldCheck className="text-teal-600 w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Legal Policy & FAQ
        </h1>
        <p className="text-gray-500 mt-3 text-lg font-medium">
          Humare application ke rules, privacy guidelines aur safety standards yahan dekhein.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-[30px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold">{error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-all active:scale-95"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
                  expandedIndex === index
                    ? "bg-gray-900 border-gray-800 shadow-2xl shadow-teal-900/10 scale-[1.01]"
                    : "bg-white border-gray-100 hover:border-teal-500/30 hover:shadow-xl shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left outline-none group"
                >
                  <div className="flex items-start gap-4">
                    <HelpCircle className={`w-6 h-6 mt-0.5 flex-shrink-0 transition-colors ${expandedIndex === index ? "text-teal-400" : "text-gray-300 group-hover:text-teal-500"}`} />
                    <span className={`text-lg sm:text-xl font-bold pr-4 transition-colors ${expandedIndex === index ? "text-white" : "text-gray-800"}`}>
                      {faq.question}
                    </span>
                  </div>
                  
                  <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                    expandedIndex === index 
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/40 rotate-0" 
                      : "bg-gray-50 text-gray-400 rotate-90"
                  }`}>
                    {expandedIndex === index ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <div className={`transition-all duration-500 ease-in-out ${expandedIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                  <div className="px-8 pb-8 pt-0">
                    <div className="h-px bg-gray-800 mb-6 opacity-30"></div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-teal-400/60 text-sm font-bold uppercase tracking-wider">
                      <div className="w-2 h-2 rounded-full bg-teal-500/40 animate-pulse"></div>
                      Verified Policy
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <Plus className="text-gray-200 w-16 h-16 mx-auto mb-4 rotate-45" />
              <p className="text-gray-400 text-xl font-bold italic">
                Filhaal koi policies upload nahi ki gayi hain.
              </p>
              <p className="text-gray-400 text-sm mt-2">Admin console se seed command run karein.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-16 text-center border-t border-gray-100 pt-8">
        <p className="text-gray-400 text-sm font-medium">
          Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}