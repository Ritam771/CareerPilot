import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT

// ... (keep your existing technicalTopics and filters data)

const Technical = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate(); // INITIALIZE NAVIGATE

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-900/40 text-emerald-400 border-emerald-800';
      case 'Medium': return 'bg-blue-900/40 text-blue-400 border-blue-800';
      case 'Hard': return 'bg-red-900/40 text-red-400 border-red-800';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans overflow-y-auto w-full">
      {/* Left Column: Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* ... (Keep Header and Filters exactly as they were) ... */}

        {/* Topics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-8">
          {technicalTopics.map((topic) => (
            <div 
              key={topic.id} 
              className="group relative bg-[#1e293b] rounded-xl p-5 border border-gray-700 hover:border-emerald-500 transition-all overflow-hidden flex flex-col"
            >
              {/* ... (Keep Card Header, Title, Stats, and Description exactly as they were) ... */}

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <button 
                  // ROUTE TO THE DYNAMIC BACKEND PRACTICE PAGE
                  onClick={() => navigate(`/practice?category=TECHNICAL&difficulty=${topic.difficulty.toUpperCase()}`)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/30 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Sidebar Stats */}
      {/* ... (Keep Sidebar Stats exactly as they were) ... */}
    </div>
  );
};

export default Technical;