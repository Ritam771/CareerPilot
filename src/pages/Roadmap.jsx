import React, { useState } from "react";

// ==========================================
// HARDCODED DEPLOYMENT DATA 
// ==========================================
const technicalRoadmap = [
  {
    id: 1,
    title: "Module 1",
    heading: "Foundations",
    subtitle: "Basic Logic, Algebra & Core Coding Principles - Completed",
    status: "Completed",
    progress: 100,
    skills: "Data Structures, Logic Gate",
    time: "3 Weeks",
    isLocked: false,
    buttonText: "Continue Journey"
  },
  {
    id: 2,
    title: "Module 2",
    heading: "Core Aptitude & Reasoning",
    subtitle: "Intermediate Coding, Mock Series I, and Logical Reasoning - In Progress",
    status: "In Progress",
    progress: 65,
    skills: "Data Structures, Logic Gate",
    time: "3 Weeks",
    isLocked: false,
    buttonText: "Continue Journey"
  },
  {
    id: 3,
    title: "Module 3",
    heading: "Advanced Interview & Case Studies",
    subtitle: "Full-length mock test practice - Locked",
    status: "Locked",
    progress: 0,
    skills: "Data Structures, Logic Gate",
    time: "3 Weeks",
    isLocked: true,
    buttonText: "Explore Sub-Topics"
  }
];

const managementRoadmap = [
  {
    id: 1,
    title: "Module 1",
    heading: "Business Fundamentals",
    subtitle: "Aptitude, Business Communication & Economics - Completed",
    status: "Completed",
    progress: 100,
    skills: "Quantitative Aptitude, Reading Comp.",
    time: "2 Weeks",
    isLocked: false,
    buttonText: "Continue Journey"
  },
  {
    id: 2,
    title: "Module 2",
    heading: "Core Management Concepts",
    subtitle: "Marketing, Finance Basics, and Data Interpretation - In Progress",
    status: "In Progress",
    progress: 40,
    skills: "Data Interpretation, Financial Ratios",
    time: "4 Weeks",
    isLocked: false,
    buttonText: "Continue Journey"
  },
  {
    id: 3,
    title: "Module 3",
    heading: "Case Studies & Guesstimates",
    subtitle: "Business Case Solving and Managerial Interviews - Locked",
    status: "Locked",
    progress: 0,
    skills: "Guesstimates, Strategy, Leadership",
    time: "3 Weeks",
    isLocked: true,
    buttonText: "Explore Sub-Topics"
  }
];

const phases = ["Complete Pathway", "Phase 1: Foundations", "Phase 2: Core Topics", "Phase 3: Interview Prep"];

// ==========================================
// MAIN COMPONENT
// ==========================================
const Roadmap = () => {
  const [activeTrack, setActiveTrack] = useState("Technical");
  const [activePhase, setActivePhase] = useState("Complete Pathway");

  const currentData = activeTrack === "Technical" ? technicalRoadmap : managementRoadmap;

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans w-full overflow-hidden">
      
      {/* LEFT COLUMN: Main Roadmap Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pr-2 pb-10">
        
        {/* Header & Track Selector */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-100">Your Preparation Roadmap</h1>
            <p className="text-gray-400 text-sm">
              Your step-by-step path to master {activeTrack === "Technical" ? "coding, aptitude, reasoning, and technical concepts." : "business, aptitude, reasoning, and management concepts."}
            </p>
          </div>
          
          {/* Tech vs Management Track Toggle */}
          <div className="flex bg-[#1e293b] rounded-lg p-1 border border-gray-700 shrink-0">
            <button 
              onClick={() => setActiveTrack("Technical")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTrack === "Technical" ? "bg-blue-600/20 text-blue-400 border border-blue-500/50" : "text-gray-400 hover:text-white"
              }`}
            >
              Technical Track
            </button>
            <button 
              onClick={() => setActiveTrack("Management")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTrack === "Management" ? "bg-purple-600/20 text-purple-400 border border-purple-500/50" : "text-gray-400 hover:text-white"
              }`}
            >
              Management Track
            </button>
          </div>
        </div>

        {/* Phase Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activePhase === phase
                  ? "bg-[#1e293b] border-gray-500 text-white"
                  : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
              }`}
            >
              {phase}
            </button>
          ))}
        </div>

        {/* Roadmap Cards (Horizontal Flex Layout) */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch overflow-x-auto pb-6">
          {currentData.map((module, index) => (
            <React.Fragment key={module.id}>
              
              {/* Individual Module Card */}
              <div 
                className={`flex-shrink-0 w-72 lg:w-80 bg-[#141e30] rounded-2xl p-5 border flex flex-col relative ${
                  module.status === "Completed" ? "border-emerald-500/40" : 
                  module.status === "In Progress" ? "border-blue-500/50" : "border-gray-700/60"
                }`}
              >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-medium text-sm ${module.isLocked ? "text-gray-500" : "text-emerald-400"}`}>
                      {module.title}
                    </h3>
                    <h4 className={`font-semibold text-lg mt-0.5 leading-tight ${module.isLocked ? "text-gray-400" : "text-white"}`}>
                      {module.heading}
                    </h4>
                  </div>
                  {/* Status Icons */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    module.status === "Completed" ? "bg-emerald-500 text-white" : 
                    module.status === "In Progress" ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}>
                    {module.isLocked ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-5 leading-relaxed">{module.subtitle}</p>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={
                      module.status === "Completed" ? "text-emerald-400" :
                      module.status === "In Progress" ? "text-blue-400" : "text-gray-500"
                    }>Progress Status</span>
                    <span className={module.isLocked ? "text-gray-500" : "text-gray-300"}>
                      {module.status === "Locked" ? "Locked" : `${module.progress}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${module.status === "Completed" ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Module Details */}
                <div className="space-y-4 mb-8 flex-1">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Skills Gained</p>
                    <p className={`text-sm ${module.isLocked ? "text-gray-500" : "text-gray-300"}`}>{module.skills}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time required</p>
                    <p className={`text-sm ${module.isLocked ? "text-gray-500" : "text-gray-300"}`}>{module.time}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto">
                  {!module.isLocked ? (
                     <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                       module.status === "In Progress" 
                         ? "bg-[#2563eb]/20 text-blue-400 border border-blue-600 hover:bg-[#2563eb]/30" 
                         : "bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600"
                     }`}>
                       {module.buttonText}
                     </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-gray-700 text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-colors">
                        {module.buttonText}
                      </button>
                      <button className="w-full py-2.5 rounded-lg text-sm font-medium border border-gray-700 text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-colors">
                        {module.buttonText}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Dotted Connecting Arrow (Rendered between cards on large screens) */}
              {index < currentData.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-8 shrink-0 text-gray-600">
                  <svg className="w-6 h-6 transform translate-y-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeDasharray="2 2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar Stats */}
      <div className="hidden md:flex w-72 bg-[#141e30] rounded-xl border border-gray-800 p-6 flex-col shrink-0 h-fit">
        <h3 className="font-semibold text-sm mb-6 text-gray-200">Milestones</h3>
        
        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-1">Step 3 of 6</p>
          <p className="text-xs text-blue-400 mb-2 font-medium">Ongoing</p>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#3b82f6] h-full w-[50%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-800/50">
          <p className="text-xs text-gray-500 mb-1">Estimated Timeline:</p>
          <p className="text-sm text-gray-300">4 Weeks to completion</p>
        </div>
      </div>

    </div>
  );
};

export default Roadmap;