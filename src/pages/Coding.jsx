import { useState, useEffect } from "react";
import { FiExternalLink } from "react-icons/fi";

function Coding() {
  const [problems, setProblems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch("http://localhost:8080/api/coding/get-all-codingquestions", {
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to load coding problems (${response.status})`);
        }

        const data = await response.json();
        const problemList = Array.isArray(data)
          ? data
          : Array.isArray(data.content)
          ? data.content
          : [];

        setProblems(
          problemList.map((p) => ({
            ...p,
            solved: Boolean(p.solved),
          }))
        );
      } catch (err) {
        setError(err.message || "Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const toggleSolved = (id) => {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.id === id ? { ...problem, solved: !problem.solved } : problem
      )
    );
  };

  const filteredProblems =
    selectedFilter === "All"
      ? problems
      : problems.filter(
          (p) => (p.difficultyLevel || "").toUpperCase() === selectedFilter.toUpperCase()
        );

  const solvedCount = problems.filter((problem) => problem.solved).length;
  const progressPercent =
    problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  const getDifficultyStyle = (difficulty) => {
    const level = (difficulty || "").toUpperCase();
    console.log("Difficulty level:", level); // Debugging line
    if (level === "EASY")
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    else if (level === "MEDIUM")
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    else if (level === "HARD")
    return "text-rose-400 bg-rose-400/10 border-rose-400/20";
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <h1 className="mb-2 text-2xl font-bold">Coding Practice</h1>
      <p className="mb-8 text-sm text-gray-400">
        Enhance your skills with handpicked coding problems.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex flex-wrap gap-3">
            {["All", "EASY", "MEDIUM", "HARD"].map((filter) => (
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

          {loading ? (
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center text-sm text-gray-400">
              Loading coding problems...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-6 text-sm text-red-400">
              {error}
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center text-sm text-gray-400">
              No coding problems found for the selected difficulty.
            </div>
          ) : (
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
                          #{problem.number ?? problem.id}
                        </span>
                        {problem.questionName || problem.title || "Untitled Problem"}
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

                  <div className="mt-4 flex items-center justify-between border-t border-slate-700/70 pt-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getDifficultyStyle(
                        problem.difficultyLevel
                      )}`}
                    >
                      {problem.difficultyLevel || "Medium"}
                    </span>

                    <a
                      href={problem.leetcodeUrl || problem.url || "#"}
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
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="font-semibold">Daily Progress</h2>
            <p className="mt-4 text-3xl font-bold text-indigo-400">
              {solvedCount} / {problems.length}
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Problems completed today ({progressPercent}%)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coding;