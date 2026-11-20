import React, { useState } from "react";
import { FiExternalLink } from "react-icons/fi";


const INITIAL_PROBLEMS = [
  {
    id: 1,
    number: 1,
    title: "Two Sum",
    description: "Find two numbers that add up to a target.",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    solved: false,
  },
  {
    id: 2,
    number: 206,
    title: "Reverse Linked List",
    description: "Reverse a given singly linked list.",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    solved: false,
  },
  {
    id: 3,
    number: 20,
    title: "Valid Parentheses",
    description: "Determine if the input string of brackets is valid.",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    solved: false,
  },
  {
    id: 4,
    number: 53,
    title: "Maximum Subarray",
    description: "Find the contiguous subarray with the largest sum.",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    solved: false,
  },
  {
    id: 5,
    number: 3,
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without duplicate characters.",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    solved: false,
  },
  {
    id: 6,
    number: 23,
    title: "Merge k Sorted Lists",
    description: "Merge k sorted linked lists into one sorted linked list.",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
    solved: false,
  },
];

function Coding() {
  const [problems, setProblems] = useState(INITIAL_PROBLEMS);
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Toggle the solved checkbox
  const toggleSolved = (id) => {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.id === id ? { ...problem, solved: !problem.solved } : problem
      )
    );
  };

  // Filter problems by difficulty
  const filteredProblems =
    selectedFilter === "All"
      ? problems
      : problems.filter((p) => p.difficulty === selectedFilter);

  const solvedCount = problems.filter((problem) => problem.solved).length;

  const getDifficultyStyle = (difficulty) => {
    if (difficulty === "Easy") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (difficulty === "Medium") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-rose-400 bg-rose-400/10 border-rose-400/20";
  };

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
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  selectedFilter === filter
                    ? "border-indigo-500 bg-indigo-600 text-white"
                    : "border-slate-600 hover:bg-indigo-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Problem Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
                className={`flex flex-col justify-between rounded-xl border p-5 transition-colors ${
                  problem.solved
                    ? "border-indigo-500 bg-slate-800/80"
                    : "border-slate-700 bg-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className={`text-lg font-semibold ${
                        problem.solved ? "text-indigo-400 line-through" : ""
                      }`}
                    >
                      <span className="mr-2 text-indigo-400">
                        #{problem.number}
                      </span>
                      {problem.title}
                    </h2>

                    <input
                      type="checkbox"
                      checked={problem.solved}
                      onChange={() => toggleSolved(problem.id)}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-800"
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    {problem.description}
                  </p>
                </div>

                {/* Difficulty Badge + LeetCode Redirect Link */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-700/70 pt-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getDifficultyStyle(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>

                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                  >
                    Solve on LeetCode <FiExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Daily Progress */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="font-semibold">Daily Progress</h2>
            <p className="mt-4 text-3xl font-bold text-indigo-400">
              {solvedCount} / {problems.length}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Problems completed today
            </p>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="mt-4 text-sm text-gray-400">
              {solvedCount > 0
                ? `Completed ${solvedCount} problem${solvedCount > 1 ? "s" : ""} today.`
                : "No recent activity yet."}
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