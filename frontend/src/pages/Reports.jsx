/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BarChart3, Download, TrendingUp, MapPin, Star, CheckCircle, AlertCircle } from "lucide-react";
import { getReports } from "../api"; 
import toast from "react-hot-toast";

// PDF Libraries
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  //  PDF Download Logic 
  const handleDownloadPDF = () => {
    if (!reportData) {
      toast.error("Data load hone ka intezar karein.");
      return;
    }

    const doc = new jsPDF();
    const tealColor = [20, 184, 166]; 

    doc.setFillColor(248, 250, 252); 
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(tealColor[0], tealColor[1], tealColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("SEARCHKARO BUSINESS REPORT", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Report ID: SK-${Date.now().toString().slice(-6)}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleString()}`, 140, 30);

    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text("1. Overall Business Statistics", 14, 52);

    doc.autoTable({
      startY: 58,
      head: [['Metric Description', 'Count']],
      body: [
        ['Total Business Categories', reportData.stats.totalCategories],
        ['Active Service Locations', reportData.stats.totalLocations],
        ['Total Customer Reviews', reportData.stats.totalRatings],
        ['Positive Feedback Count', reportData.stats.positiveRatings],
      ],
      theme: 'striped',
      headStyles: { fillColor: tealColor, fontStyle: 'bold' },
      styles: { cellPadding: 5, fontSize: 11 }
    });

    const nextY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("2. Recent Customer Feedback Activity", 14, nextY);

    const tableRows = reportData.latestRatings.map(item => [
      item.shop,
      item.categories,
      item.review ? "POSITIVE" : "NEGATIVE"
    ]);

    doc.autoTable({
      startY: nextY + 6,
      head: [['Shop Name', 'Business Category', 'Status']],
      body: tableRows.length > 0 ? tableRows : [['No recent data', '-', '-']],
      headStyles: { fillColor: [71, 85, 105] },
      styles: { fontSize: 9 },
      columnStyles: {
        2: { fontStyle: 'bold', textColor: [0, 150, 0] }
      },
      didParseCell: function(data) {
        if (data.column.index === 2 && data.cell.section === 'body') {
          if (data.cell.raw === 'NEGATIVE') {
            data.cell.styles.textColor = [220, 0, 0];
          }
        }
      }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`SearchKaro Admin Dashboard - Confidential | Page ${i} of ${pageCount}`, 14, 285);
    }

    doc.save(`SearchKaro_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    toast.success("PDF Report download ho gayi!");
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await getReports();
      if (res.data) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error("Report Fetch Error:", err);
      toast.error("Database se report load nahi ho saki.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 shadow-sm"></div>
        <p className="text-gray-500 font-medium animate-pulse">Generating Business Report...</p>
      </div>
    );
  }

  if (!reportData || !reportData.stats) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-700">No report data available</h3>
        <button onClick={fetchReport} className="mt-6 px-6 py-2 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* RESPONSIVE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-3">
            <BarChart3 className="text-teal-500 w-7 h-7 sm:w-8 sm:h-8" /> Business Reports
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base font-medium">Real-time performance metrics and insights</p>
        </div>
        <button 
          onClick={handleDownloadPDF} 
          className="w-full md:w-auto bg-teal-500 text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-600 shadow-xl shadow-teal-100 transition-all font-black uppercase text-xs tracking-widest active:scale-95"
        >
          <Download className="w-4 h-4" /> Export PDF Report
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Categories" value={reportData.stats.totalCategories} icon={<TrendingUp className="text-blue-500" />} />
        <StatCard title="Active Locations" value={reportData.stats.totalLocations} icon={<MapPin className="text-orange-500" />} />
        <StatCard title="Total Reviews" value={reportData.stats.totalRatings} icon={<Star className="text-yellow-500" />} />
        <StatCard title="Positive Feedback" value={reportData.stats.positiveRatings} icon={<CheckCircle className="text-green-500" />} isSuccess />
      </div>

      {/*  ACTIVITY TABLE */}
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="font-black text-gray-700 uppercase text-[10px] tracking-[0.2em]">Recent Ratings Activity</h3>
          <span className="bg-white border border-gray-200 text-gray-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">LATEST 5 ENTRIES</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/30 text-[10px] uppercase text-gray-400 font-black hidden sm:table-header-group">
              <tr>
                <th className="px-8 py-5">Shop Name</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm block sm:table-row-group">
              {reportData.latestRatings.length > 0 ? (
                reportData.latestRatings.map((item) => (
                  <tr key={item._id} className="hover:bg-teal-50/30 transition-colors block sm:table-row p-6 sm:p-0">
                    {/* Shop Name */}
                    <td className="px-0 sm:px-8 py-1 sm:py-5 block sm:table-cell font-black text-gray-800 text-base sm:text-sm">
                      {item.shop}
                    </td>
                    
                    {/* Category */}
                    <td className="px-0 sm:px-8 py-1 sm:py-5 block sm:table-cell text-gray-500 font-medium italic sm:not-italic">
                      {item.categories}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="px-0 sm:px-8 py-3 sm:py-5 text-left sm:text-center block sm:table-cell">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border tracking-widest inline-block ${item.review ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                        {item.review ? "POSITIVE" : "NEGATIVE"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-8 py-16 text-center text-gray-400 font-bold italic">Abhi tak koi activity record nahi hui hai.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, isSuccess }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-teal-50 transition-colors duration-300">
          {React.cloneElement(icon, { size: 22, strokeWidth: 2.5 })}
        </div>
      </div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      <h2 className={`text-3xl sm:text-4xl font-black mt-2 tracking-tighter ${isSuccess ? "text-teal-500" : "text-gray-800"}`}>{value || 0}</h2>
    </div>
  );
}