import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Mock Data for Technical Topics
const technicalTopics = [
  { id: 1, title: "Object Oriented Programming", difficulty: "Easy", completed: 40, totalQuestions: 50, description: "Core concepts: Inheritance, Polymorphism, Encapsulation, and Abstraction.", type: "Core CS" },
  { id: 2, title: "Database Management Systems", difficulty: "Medium", completed: 25, totalQuestions: 60, description: "SQL queries, Normalization, ACID properties, and Transactions.", type: "Databases" },
  { id: 3, title: "Operating Systems", difficulty: "Medium", completed: 15, totalQuestions: 40, description: "Process scheduling, Deadlocks, Memory management, and Concurrency.", type: "Core CS" },
  { id: 4, title: "Computer Networks", difficulty: "Hard", completed: 10, totalQuestions: 30, description: "OSI model, TCP/IP, Routing algorithms, and Network security.", type: "Networking" },
  { id: 5, title: "Data Structures", difficulty: "Medium", completed: 45, totalQuestions: 80, description: "Arrays, Linked Lists, Trees, Graphs, and Hash Tables.", type: "DSA" },
  { id: 6, title: "System Design Basics", difficulty: "Hard", completed: 5, totalQuestions: 20, description: "Load balancing, Caching, Microservices, and Scalability.", type: "Architecture" },
];

const filters = ["All", "Easy", "Medium", "Hard"];

const Technical = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  // Helper for difficulty badge styling
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-900/40 text-emerald-400 border-emerald-800';
      case 'Medium': return 'bg-blue-900/40 text-blue-400 border-blue-800';
      case 'Hard': return 'bg-red-900/40 text-red-400 border-red-800';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  // Filter topics based on active selection
  const filteredTopics = activeFilter === "All" 
    ? technicalTopics 
    : technicalTopics.filter(t => t.difficulty === activeFilter);

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans overflow-y-auto w-full custom-scrollbar">
      
      {/* Left Column: Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Technical MCQ Practice</h1>
          <p className="text-gray-400">Master core computer science subjects and fundamental concepts for technical rounds.</p>
        </div>

        {/* Filters Section */}
        <div className="flex gap-3 mb-8 border-b border-gray-800 pb-4">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${
                activeFilter === filter 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-8">
          {filteredTopics.map((topic) => (
            <div 
              key={topic.id} 
              className="group relative bg-[#1e293b] rounded-xl p-6 border border-gray-700 hover:border-emerald-500 transition-all overflow-hidden flex flex-col shadow-sm"
            >
              {/* Card Header (Type & Difficulty) */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 mb-1 block uppercase tracking-wider">{topic.type}</span>
                  <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-md border ${getDifficultyColor(topic.difficulty)} font-medium`}>
                  {topic.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 flex-1">{topic.description}</p>

              {/* Progress Bar */}
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                  <span>Progress</span>
                  <span>{topic.completed} / {topic.totalQuestions} Solved</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${(topic.completed / topic.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Hover Overlay Button (Navigates to PracticeSession) */}
              <div className="absolute inset-0 bg-[#0f172a]/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 rounded-xl">
                <button 
                  onClick={() => navigate(`/practice?category=TECHNICAL&difficulty=${topic.difficulty.toUpperCase()}`)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/40 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
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
      <div className="w-80 hidden lg:flex flex-col gap-6 shrink-0">
        
        {/* Progress Widget */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-gray-700 shadow-sm">
          <h3 className="font-bold text-lg mb-6 border-b border-gray-800 pb-3">Your Progress</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Overall Accuracy</span>
                <span className="text-white font-bold">82%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Questions Solved</span>
                <span className="text-white font-bold">140 / 280</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Widget */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-gray-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4 border-b border-gray-800 pb-3">Technical Tips</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5 font-bold">1.</span>
              Always review the ACID properties and normal forms for DBMS interviews.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5 font-bold">2.</span>
              For OOPs, be prepared to explain real-world examples of Polymorphism and Encapsulation.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5 font-bold">3.</span>
              In OS, focus heavily on deadlocks, virtual memory, and process scheduling algorithms.
            </li>
          </ul>
        </div>

      </div>

      {/* Basic Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Technical;