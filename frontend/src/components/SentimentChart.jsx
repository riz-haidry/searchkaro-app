import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function SentimentChart({ positive, total }) {
  // Logic: Kitna percent green hoga
  const positivePercentage = total > 0 ? Math.round((positive / total) * 100) : 0;
  const negativeCount = total - positive;

  // SVG Circle calculation ke liye circle
  const strokeDasharray = `${positivePercentage} 100`;

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Ratings Sentiment</h3>
      
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 transition-transform duration-1000">
          {/* 🔴 RED CIRCLE (Negative/Background) */}
          <circle
            cx="18" cy="18" r="15.915"
            fill="transparent"
            stroke="#f10a0a" 
            strokeWidth="4"
          />
          {/* 🟢 GREEN CIRCLE (Positive Progress) */}
          <circle
            cx="18" cy="18" r="15.915"
            fill="transparent"
            stroke="#14b8a6" 
            strokeWidth="4"
            strokeDasharray={strokeDasharray}
            strokeDashoffset="0"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-gray-800">{positivePercentage}%</span>
          <span className="text-[8px] font-bold text-teal-600 uppercase tracking-tighter">Positive</span>
        </div>
      </div>

      {/* Stats Below Circle */}
      <div className="flex gap-6 mt-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><ThumbsUp size={14} /></div>
          <div>
            <p className="text-sm font-black text-gray-800">{positive}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase">Good</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-l pl-6 border-gray-100">
          <div className="p-2 bg-red-50 rounded-lg text-red-500"><ThumbsDown size={14} /></div>
          <div>
            <p className="text-sm font-black text-gray-800">{negativeCount}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase">Bad</p>
          </div>
        </div>
      </div>
    </div>
  );
}