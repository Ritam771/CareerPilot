import React, { useState } from "react";

// --- MOCK DATA (Ready for Backend Integration) ---
const savedItems = [
  {
    id: 1,
    category: "Examples",
    title: "Hard - Reverse Linked List",
    difficulty: "Hard",
    source: "LeetCode",
    date: "2 days ago",
    description: "Learn Reverse Linked List and using Hard - Reverse Linked List...",
    buttonText: "View Challenge"
  },
  {
    id: 2,
    category: "Aptitude",
    title: "Aptitude - Time & Work Questions",
    difficulty: "Hard",
    source: "Prep Material",
    date: "2 days ago",
    description: "Time & Work Questions - topic notes and practice formulas. Aptitude...",
    buttonText: "Open Resource"
  },
  {
    id: 3,
    category: "Reasoning",
    title: "Reasoning - Blood Relations",
    difficulty: "Hard",
    source: "Prep Material",
    date: "2 days ago",
    description: "Reasoning is base of over visited relations and variations in the latest Word topic...",
    buttonText: "Open Resource"
  }
];

const recentActivities = [
  { id: 1, text: "Recent activity Hard questions and Mock List", time: "2 days ago" },
  { id: 2, text: "Recent activity Time & Work questions and Mock", time: "2 days ago" },
  { id: 3, text: "Recent activity Reasoning Blood", time: "1 days ago" }
];

const tags = ["Mock Tests", "Technical Theory", "Reasoning Analyst", "Aptitude"];
const filters = ["All Saved", "Coding", "Mock Tests", "Technical Theory", "Aptitude"];

// --- MAIN COMPONENT ---
const Bookmarks = () => {
  // State to track which filter tab is currently selected
  const [activeFilter, setActiveFilter] = useState("All Saved");

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans overflow-y-auto w-full">
      
      {/* ================= LEFT COLUMN (Main Content) ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Bookmarks & Saved Resources</h1>
          <p className="text-gray-400 text-sm">
            Quickly access your saved questions, resources, and Mock Tests.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors flex items-center gap-2 ${
                activeFilter === filter
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Saved Items List */}
        <div className="flex flex-col gap-4 pb-8">
          {savedItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#1e293b] rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors relative"
            >
              {/* Bookmark Icon Top Right */}
              <div className="absolute top-5 right-5 flex items-center gap-1 text-gray-300">
                <span className="text-sm">Saved</span>
                <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>

              <span className="text-xs text-gray-400 block mb-1">{item.category}</span>
              <h3 className="text-lg font-bold mb-4 pr-20">{item.title}</h3>
              
              {/* Stats Row */}
              <div className="flex gap-8 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                  <p className="text-sm font-medium">{item.difficulty}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Source</p>
                  <p className="text-sm font-medium">{item.source}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Date Saved</p>
                  <p className="text-sm font-medium">{item.date}</p>
                </div>
                
                {/* Action Button (Pushed to the right) */}
                <div className="ml-auto flex items-end">
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    {item.buttonText}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 border-t border-gray-700 pt-3">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT COLUMN (Sidebar) ================= */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
        
        {/* Recent Activity Panel */}
        <div className="bg-[#1e293b] p-5 rounded-xl border border-gray-700">
          <h3 className="font-semibold text-sm mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                {/* Small Clock Icon */}
                <div className="mt-0.5 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300 leading-tight mb-1">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags & Categories Panel */}
        <div className="bg-[#1e293b] p-5 rounded-xl border border-gray-700">
          <h3 className="font-semibold text-sm mb-1">Tags & Categories</h3>
          <p className="text-xs text-gray-400 mb-4">Create customized folders or browse bookmarked topics.</p>
          
          {/* Input Field */}
          <input 
            type="text" 
            placeholder="Create categories..." 
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white mb-4 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />

          {/* Tags Pills */}
          <div className="flex flex-col gap-2">
            {tags.map((tag, index) => (
              <button 
                key={index}
                className="bg-[#2a3a50] hover:bg-[#344863] text-teal-300 text-sm font-medium py-1.5 px-4 rounded-full w-fit transition-colors text-left"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Bookmarks;