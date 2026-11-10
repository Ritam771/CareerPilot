
import React, { useState } from "react";

const mockTests = [
  {
    id: 1,
    title: "Aptitude Mock Test",
    category: "Aptitude",
    questions: 30,
    duration: "30 min",
    difficulty: "Easy",
    score: 75,
    progress: 75,
    saved: true,
  },
  {
    id: 2,
    title: "Logical Reasoning Test",
    category: "Reasoning",
    questions: 25,
    duration: "25 min",
    difficulty: "Medium",
    score: 60,
    progress: 60,
    saved: false,
  },
  {
    id: 3,
    title: "Technical Assessment",
    category: "Technical",
    questions: 40,
    duration: "45 min",
    difficulty: "Hard",
    score: 85,
    progress: 85,
    saved: true,
  },
  {
    id: 4,
    title: "Quantitative Aptitude",
    category: "Aptitude",
    questions: 20,
    duration: "20 min",
    difficulty: "Medium",
    score: 0,
    progress: 0,
    saved: false,
  },
];

const filters = [
  "All Tests",
  "Aptitude",
  "Reasoning",
  "Technical",
  "Saved",
];

const MockTest = () => {
  const [activeFilter, setActiveFilter] = useState("All Tests");

  const filteredTests = mockTests.filter((test) => {
    if (activeFilter === "All Tests") return true;
    if (activeFilter === "Saved") return test.saved;
    return test.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">

      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mock Tests</h1>
        <p className="mt-2 text-gray-400">
          Test your preparation before the real assessment.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Left Section */}
        <div className="xl:col-span-2">

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-cyan-500 text-slate-950"
                    : "border border-slate-700 bg-slate-900 text-gray-300 hover:bg-slate-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Test Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="rounded-xl border border-slate-700 bg-slate-900 p-5 transition hover:border-cyan-500"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-md bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
                    {test.category}
                  </span>

                  <span className="text-sm text-gray-400">
                    {test.difficulty}
                  </span>
                </div>

                <h2 className="mb-4 text-xl font-semibold">
                  {test.title}
                </h2>

                <div className="mb-4 grid grid-cols-2 gap-3 text-sm text-gray-400">
                  <p>📝 {test.questions} Questions</p>
                  <p>⏱️ {test.duration}</p>
                </div>

                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Previous Score</span>
                  <span className="font-semibold text-cyan-400">
                    {test.score === 0 ? "Not attempted" : `${test.score}%`}
                  </span>
                </div>

                <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${test.progress}%` }}
                  />
                </div>

                <button
                  onClick={() => alert("We will build the test screen next!")}
                  className="w-full rounded-lg bg-cyan-500 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Start Mock Test
                </button>
              </div>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <p className="mt-8 text-center text-gray-400">
              No tests found in this category.
            </p>
          )}
        </div>

        {/* Right Section */}
        <div className="space-y-6">

          {/* Test Schedule */}
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="mb-5 text-xl font-semibold">
              Test Schedule
            </h2>

            <div className="space-y-4">
              <div className="rounded-lg bg-slate-800 p-4">
                <p className="text-sm text-cyan-400">Upcoming</p>
                <h3 className="mt-1 font-semibold">
                  Aptitude Practice
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Tomorrow • 10:00 AM
                </p>
              </div>

              <div className="rounded-lg bg-slate-800 p-4">
                <p className="text-sm text-purple-400">Practice</p>
                <h3 className="mt-1 font-semibold">
                  Technical Assessment
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Friday • 2:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Latest Results */}
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h2 className="mb-5 text-xl font-semibold">
              Latest Results
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Aptitude Test</h3>
                  <p className="text-xs text-gray-400">
                    18 / 25 Questions
                  </p>
                </div>
                <span className="font-bold text-green-400">
                  72%
                </span>
              </div>

              <div className="h-px bg-slate-700" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Reasoning Test</h3>
                  <p className="text-xs text-gray-400">
                    15 / 25 Questions
                  </p>
                </div>
                <span className="font-bold text-cyan-400">
                  60%
                </span>
              </div>

              <div className="h-px bg-slate-700" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Technical Test</h3>
                  <p className="text-xs text-gray-400">
                    17 / 20 Questions
                  </p>
                </div>
                <span className="font-bold text-green-400">
                  85%
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MockTest;
