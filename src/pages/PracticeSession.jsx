import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookOpen,
  FiEdit3,
  FiAlertTriangle,
} from "react-icons/fi";

const PracticeSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract parameters from URL
  const category = searchParams.get("category") || "REASONING";
  const difficulty = searchParams.get("difficulty") || "MEDIUM";
  const topicId = searchParams.get("topicId") || "";
  const company = searchParams.get("company") || "";

  // Data & pagination state
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Per-question interactive state
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openExplanations, setOpenExplanations] = useState({});
  const [openWorkspaces, setOpenWorkspaces] = useState({});
  const [workspaceNotes, setWorkspaceNotes] = useState({});

  const pageSize = 10;

  useEffect(() => {
    const fetchPracticeQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        const queryParams = new URLSearchParams({
          difficulty: difficulty.toUpperCase(),
          category: category.toUpperCase(),
          page,
          pageSize,
        });

        if (topicId) queryParams.append("topicId", topicId);
        if (company) queryParams.append("company", company);

        const apiUrl = `http://localhost:8080/api/question/get-questionbycategoryanddifficulty?${queryParams.toString()}`;

        const response = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch questions (${response.status})`);
        }

        const data = await response.json();

        // Supports both Spring Boot Page object (data.content) and raw arrays
        if (Array.isArray(data)) {
          setQuestions(data);
          setTotalPages(1);
        } else {
          setQuestions(Array.isArray(data.content) ? data.content : []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPracticeQuestions();
  }, [category, difficulty, topicId, company, page]);

  const handleSelectOption = (qId, label) => {
    setSelectedOptions((prev) => ({ ...prev, [qId]: label }));
  };

  const toggleExplanation = (qId) => {
    setOpenExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleWorkspace = (qId) => {
    setOpenWorkspaces((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0f172a] p-6 font-sans text-white">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
        {/* Header Section */}
        <div className="mb-6 flex shrink-0 items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-800 transition-colors hover:bg-gray-700"
              title="Go Back"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold capitalize">
                {category.toLowerCase()} Practice
              </h1>
              <p className="text-sm text-gray-400">
                Difficulty:{" "}
                <span className="font-medium text-emerald-400">{difficulty}</span>
                {company && (
                  <>
                    {" "}
                    | Company:{" "}
                    <span className="font-medium text-cyan-400">{company}</span>
                  </>
                )}{" "}
                | Page: {page + 1}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-[#1e293b] px-4 py-2 text-sm">
            Questions:{" "}
            <span className="font-bold text-white">{questions.length}</span>
          </div>
        </div>

        {/* Questions Scroll Area */}
        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2 pb-10">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-500"></div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/50 bg-red-900/20 p-4 text-sm text-red-400">
              {error}
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-xl border border-gray-700 bg-[#1e293b] py-10 text-center text-gray-400">
              No questions found for {category} ({difficulty}). Check back later!
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => {
                const qId = q.id ?? `${page}-${index}`;
                const questionNumber = page * pageSize + index + 1;

                // Supports either an options array or separate optionA/B/C/D fields
                const optionsList = Array.isArray(q.options)
                  ? q.options
                  : [
                      { label: "A", text: q.optionA },
                      { label: "B", text: q.optionB },
                      { label: "C", text: q.optionC },
                      { label: "D", text: q.optionD },
                    ].filter((o) => o.text !== undefined && o.text !== null && o.text !== "");

                const correctOpt = (q.correctOption || q.answer || "").toUpperCase();
                const userSelected = selectedOptions[qId];

                return (
                  <div
                    key={qId}
                    className="space-y-4 rounded-xl border border-gray-700/80 bg-[#1e293b] p-6 shadow-lg"
                  >
                    {/* Question Number & Text (IndiaBIX Style) */}
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-base leading-relaxed font-medium text-gray-100 whitespace-pre-wrap">
                        <span className="mr-2 font-bold text-emerald-400">
                          {questionNumber}.
                        </span>
                        {q.questionText || q.question || "Question text unavailable."}
                      </p>

                      {q.company && (
                        <span className="shrink-0 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                          {q.company}
                        </span>
                      )}
                    </div>

                    {/* Circular A, B, C, D Options */}
                    {optionsList.length > 0 && (
                      <div className="space-y-2 pl-2">
                        {optionsList.map((opt, i) => {
                          const label = (
                            opt.label || String.fromCharCode(65 + i)
                          ).toUpperCase();
                          const text = typeof opt === "string" ? opt : opt.text;
                          const isSelected = userSelected === label;
                          const isCorrect = correctOpt && label === correctOpt;

                          let circleClass =
                            "border-emerald-500/70 text-emerald-400 bg-transparent";
                          let rowClass =
                            "border-transparent hover:bg-slate-800/70";

                          if (isSelected) {
                            if (correctOpt) {
                              circleClass = isCorrect
                                ? "border-emerald-400 bg-emerald-500 text-slate-950"
                                : "border-red-400 bg-red-500 text-white";
                              rowClass = isCorrect
                                ? "border-emerald-500/40 bg-emerald-500/10"
                                : "border-red-500/40 bg-red-500/10";
                            } else {
                              circleClass =
                                "border-teal-400 bg-teal-500 text-slate-950";
                              rowClass = "border-teal-500/40 bg-teal-500/10";
                            }
                          }

                          return (
                            <div
                              key={label}
                              onClick={() => handleSelectOption(qId, label)}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2 transition ${rowClass}`}
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${circleClass}`}
                              >
                                {label}
                              </span>
                              <span className="text-sm text-gray-200">
                                {text}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Collapsible Answer & Explanation Block (Matches IndiaBIX Video) */}
                    {openExplanations[qId] && (
                      <div className="space-y-2.5 rounded-lg border border-emerald-500/25 bg-[#0f172a] p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-400">
                            Answer:
                          </span>
                          <span className="text-gray-300">Option</span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 text-xs font-bold text-emerald-400">
                            {correctOpt || "—"}
                          </span>
                        </div>

                        <div>
                          <p className="font-bold text-emerald-400">
                            Explanation:
                          </p>
                          <p className="mt-1 whitespace-pre-line leading-relaxed text-gray-300">
                            {q.explanation || "No explanation provided for this question."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Optional Rough-Work Workspace */}
                    {openWorkspaces[qId] && (
                      <div className="rounded-lg border border-gray-700 bg-[#0f172a] p-3">
                        <textarea
                          rows={3}
                          value={workspaceNotes[qId] || ""}
                          onChange={(e) =>
                            setWorkspaceNotes((prev) => ({
                              ...prev,
                              [qId]: e.target.value,
                            }))
                          }
                          placeholder="Rough work / notes for this question..."
                          className="w-full resize-none bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-500"
                        />
                      </div>
                    )}

                    {/* IndiaBIX-style Action Icon Bar */}
                    <div className="flex items-center gap-2.5 border-t border-gray-700/70 pt-3">
                      {/* Open Book Icon -> View/Hide Explanation */}
                      <button
                        onClick={() => toggleExplanation(qId)}
                        title={
                          openExplanations[qId]
                            ? "Hide Answer & Explanation"
                            : "View Answer & Explanation"
                        }
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          openExplanations[qId]
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                            : "border-gray-600 bg-[#0f172a] text-gray-300 hover:border-emerald-500/60 hover:text-emerald-400"
                        }`}
                      >
                        <FiBookOpen size={16} />
                        <span>
                          {openExplanations[qId]
                            ? "Hide Explanation"
                            : "View Explanation"}
                        </span>
                      </button>

                      {/* Workspace / Scratchpad Icon */}
                      <button
                        onClick={() => toggleWorkspace(qId)}
                        title="Toggle Rough Workspace"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                          openWorkspaces[qId]
                            ? "border-cyan-500 bg-cyan-500/15 text-cyan-400"
                            : "border-gray-600 bg-[#0f172a] text-gray-400 hover:border-cyan-500/60 hover:text-cyan-400"
                        }`}
                      >
                        <FiEdit3 size={15} />
                      </button>

                      {/* Report Issue Icon */}
                      <button
                        onClick={() =>
                          alert(`Reported Question #${questionNumber} for review.`)
                        }
                        title="Report Question"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-600 bg-[#0f172a] text-gray-400 transition hover:border-amber-500/60 hover:text-amber-400"
                      >
                        <FiAlertTriangle size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination Footer */}
              <footer className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-lg border border-gray-700 bg-[#1e293b] px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page <strong className="text-white">{page + 1}</strong> of{" "}
                  <strong className="text-white">{totalPages}</strong>
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-lg border border-gray-700 bg-[#1e293b] px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </footer>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
};

export default PracticeSession;