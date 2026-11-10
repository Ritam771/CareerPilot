import React, { useState } from "react";

function Coding() {
  // State to track the list of problems and their solved status
  const [problems, setProblems] = useState([
    {
      id: 1,
      title: "Two Sum",
      description: "Find two numbers that add up to a target.",
      solved: false,
    },
    {
      id: 2,
      title: "Reverse Linked List",
      description: "Reverse a given linked list.",
      solved: false,
    },
  ]);

  // Function to toggle the checkbox
  const toggleSolved = (id) => {
    setProblems(
      problems.map((problem) =>
        problem.id === id ? { ...problem, solved: !problem.solved } : problem
      )
    );
  };

  // Dynamically calculate how many problems are solved
  const solvedCount = problems.filter((problem) => problem.solved).length;

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      {/* Page Heading */}
      <h1 className="mb-2 text-2xl font-bold">Coding Practice</h1>

      <p className="mb-8 text-sm text-gray-400">
        Enhance your skills with handpicked coding problems.
      </p>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Section */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            {["All", "Easy", "Medium", "Hard"].map((filter) => (
              <button
                key={filter}
                className="rounded-full border border-slate-600 px-4 py-2 text-sm hover:bg-indigo-600"
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className={`rounded-xl border p-5 transition-colors ${
                  problem.solved
                    ? "border-indigo-500 bg-slate-800/80"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <h2
                    className={`text-lg font-semibold ${
                      problem.solved ? "text-indigo-400 line-through" : ""
                    }`}
                  >
                    {problem.title}
                  </h2>
                  
                  {/* Checkbox Added Here */}
                  <input
                    type="checkbox"
                    checked={problem.solved}
                    onChange={() => toggleSolved(problem.id)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Daily Progress */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="font-semibold">Daily Progress</h2>

            {/* Counter now updates dynamically based on checked boxes */}
            <p className="mt-4 text-3xl font-bold text-indigo-400">
              {solvedCount} / 5
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Problems completed today
            </p>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="mt-4 text-sm text-gray-400">
              No recent activity yet.
            </p>
          </div>

          {/* Weekly Streak */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="font-semibold">Weekly Streak</h2>
            <p className="mt-4 text-3xl font-bold text-orange-400">0 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coding;