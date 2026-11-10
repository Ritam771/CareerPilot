import React, { useState } from "react";

// Mock data for the reasoning topics
const reasoningTopics = [
  {
    id: 1,
    title: "Syllogisms & Logic",
    icon: "🔗", 
    difficulty: "Medium",
    accuracy: 78,
    questions: 18,
    description: "Solve problems on logical deductions, statement-conclusions, and Venn diagrams.",
    theme: "purple"
  },
  {
    id: 2,
    title: "Blood Relations",
    icon: "👪",
    difficulty: "Easy",
    accuracy: 88,
    questions: 15,
    description: "Solve problems on logical deductions, statement-conclusions, and Venn diagrams.",
    theme: "green"
  },
  {
    id: 3,
    title: "Blood Relations",
    icon: "👪",
    difficulty: "Easy",
    accuracy: 88,
    questions: 15,
    description: "Solve problems on logical deductions, statement-conclusions, and Venn diagrams.",
    theme: "blue"
  },
  {
    id: 4,
    title: "Seating Arrangement",
    icon: "🪑",
    difficulty: "Hard",
    accuracy: 62,
    questions: 22,
    description: "Master circular, linear, and complex matrix seating arrangements.",
    theme: "red"
  },
  {
    id: 5,
    title: "Seating Arrangement",
    icon: "🪑",
    difficulty: "Easy",
    accuracy: 94,
    questions: 10,
    description: "Practice basic linear and circular seating puzzles.",
    theme: "green"
  }
];

const filters = [
  "All", "Logical Reasoning", "Analytical", "Verbal Reasoning", "Pattern Recognition", "Puzzles"
];

const Reasoning = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-900/40 text-emerald-400 border-emerald-800';
      case 'Medium': return 'bg-indigo-900/40 text-indigo-400 border-indigo-800';
      case 'Hard': return 'bg-red-900/40 text-red-400 border-red-800';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans overflow-y-auto w-full">
      
      {/* Left Column: Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Reasoning Practice</h1>
          <p className="text-gray-400 text-sm">
            Strengthen your logical, analytical, and critical thinking.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                activeFilter === filter
                  ? "bg-gray-800 border-gray-600 text-white"
                  : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-8">
          {reasoningTopics.map((topic) => (
            <div 
              key={topic.id} 
              className="group relative bg-[#1e293b] rounded-xl p-5 border border-gray-700 hover:border-indigo-500 transition-all overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-lg border border-gray-700">
                  {topic.icon}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              </div>

              {/* Card Title & Stats */}
              <h3 className="text-lg font-bold mb-3">{topic.title}</h3>
              
              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-lg font-bold text-white">{topic.accuracy}%</p>
                  <p className="text-xs text-gray-400">Accuracy</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{topic.questions}</p>
                  <p className="text-xs text-gray-400">Questions</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 border-t border-gray-700 pt-4 mt-auto">
                {topic.description}
              </p>

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Sidebar Stats */}
      <div className="w-80 flex flex-col gap-5 shrink-0">
        
        {/* Circular Progress */}
        <div className="bg-[#1e293b] p-5 rounded-xl border border-gray-700 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
             <h3 className="font-semibold text-sm">Progress</h3>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center mb-2">
            {/* SVG Circle for Progress (Mockup) */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" strokeWidth="8" strokeDasharray="283" strokeDashoffset="184" className="transition-all duration-1000" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold">210<span className="text-sm text-gray-400 font-normal">/600</span></span>
              <span className="text-[10px] text-gray-400 text-center leading-tight mt-1">Questions<br/>Solved</span>
            </div>
          </div>
        </div>

        {/* Analytical Skills Score */}
        <div className="bg-[#1e293b] p-5 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm">Analytical Skills Score</h3>
            <span className="text-xs text-indigo-400 font-bold">Lvl 4</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[65%] rounded-full shadow-[0_0_10px_#4f46e5]"></div>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-[#1e293b] p-5 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Daily Streak</h3>
            <span className="text-xs text-gray-400">Current week</span>
          </div>
          
          <div className="flex justify-between gap-1">
            {[
              { day: 'Mon', active: true, label: '1' },
              { day: 'Tue', active: true, label: '2' },
              { day: 'Wed', active: true, label: '3' },
              { day: 'Thu', active: true, label: '4' },
              { day: 'Fri', active: false, label: '5' }
            ].map((streak, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                  streak.active ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-800' : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}>
                  {streak.label}
                </div>
                <span className="text-[10px] text-gray-400">{streak.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reasoning;