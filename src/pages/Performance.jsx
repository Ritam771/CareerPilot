import React from 'react';

const Performance = () => {
  return (
    <div className="flex h-screen bg-[#131b26] text-white p-6 gap-6 font-sans overflow-y-auto">
      
      {/* Main Left Content */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Progress & Analytics</h1>
          <p className="text-gray-400 text-sm">Detailed breakdown of your practice and test performances.</p>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Time Spent', value: '42 hrs' },
            { label: 'Questions Completed', value: '340' },
            { label: 'Average Score', value: '78%' },
            { label: 'Test Completed', value: '12' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#1a2332] p-4 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-xs mb-2">{stat.label}</p>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Main Chart Area */}
        <div className="bg-[#1a2332] p-5 rounded-xl border border-gray-800 h-64 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Quiz Score</h3>
            <select className="bg-[#131b26] border border-gray-700 text-xs px-2 py-1 rounded text-gray-300">
              <option>Past month</option>
            </select>
          </div>
          {/* Mock Line Chart */}
          <div className="flex-1 w-full relative bg-[#131b26]/50 rounded border-b border-l border-gray-700">
             <svg className="w-full h-full text-[#7dd3fc]" viewBox="0 0 100 30" preserveAspectRatio="none">
               <path d="M0,25 C10,20 15,15 20,18 C25,21 30,10 40,8 C50,6 55,15 60,12 C70,6 80,18 90,10 L100,8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
               <circle cx="20" cy="18" r="1.5" fill="currentColor" />
               <circle cx="40" cy="8" r="1.5" fill="currentColor" />
               <circle cx="60" cy="12" r="1.5" fill="currentColor" />
               <circle cx="90" cy="10" r="1.5" fill="currentColor" />
             </svg>
          </div>
        </div>

        {/* Bottom Row: Topic Performance & Recent Activity */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#1a2332] p-5 rounded-xl border border-gray-800">
            <h3 className="font-semibold text-sm mb-4">Performance by Topic</h3>
            <div className="space-y-4">
              {[
                { name: 'Aptitude', score: '75%', color: 'bg-blue-400' },
                { name: 'Reasoning', score: '60%', color: 'bg-teal-400' },
                { name: 'Technical', score: '60%', color: 'bg-teal-400' }
              ].map((topic, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{topic.name}</span>
                    <span className="text-gray-400">{topic.score}</span>
                  </div>
                  <div className="w-full bg-gray-700 h-1.5 rounded-full">
                    <div className={`${topic.color} h-full rounded-full`} style={{ width: topic.score }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a2332] p-5 rounded-xl border border-gray-800">
            <h3 className="font-semibold text-sm mb-4">Recent Activity</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-0.5">●</span>
                <div>
                  <p>Completed Data Structures Test</p>
                  <p className="text-xs text-gray-400">Completed Milestones</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-400 mt-0.5">●</span>
                <div>
                  <p>Achieved 80% in Quantitative Aptitude</p>
                  <p className="text-xs text-gray-400">Completed Milestones</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Right Sidebar - Strengths & Weaknesses */}
      <div className="w-72 bg-[#1a2332] border border-gray-800 p-6 rounded-xl h-fit">
        <h3 className="font-semibold text-sm mb-1">Strengths & Weaknesses</h3>
        <p className="text-xs text-gray-400 mb-6">Key skills to Improve</p>
        
        {/* Mock Radar Chart */}
        <div className="aspect-square bg-[#131b26] rounded-full mb-6 border border-gray-700 flex items-center justify-center relative">
           {/* SVG placeholder for radar chart */}
           <svg className="w-4/5 h-4/5 text-[#7dd3fc]" viewBox="0 0 100 100">
              <polygon points="50,10 90,40 75,90 25,90 10,40" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
           </svg>
           <span className="absolute top-2 text-[10px] text-gray-400">Logical Reasoning</span>
           <span className="absolute right-0 text-[10px] text-gray-400">Aptitude</span>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400">Top Area:</p>
            <p className="text-sm font-medium">Logical Reasoning</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Needs Improvement:</p>
            <p className="text-sm font-medium">Data Structures</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Performance;