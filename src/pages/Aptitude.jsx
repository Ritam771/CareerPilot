import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const filters = ["All", "Easy", "Medium", "Hard"];
const ITEMS_PER_PAGE = 6;

const Aptitude = () => {
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Track selected option index and explanation visibility per card key
  const [selectedOptions, setSelectedOptions] = useState({});
  const [openExplanations, setOpenExplanations] = useState({});

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch Aptitude topics and Companies dynamically from Spring Boot
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const params = new URLSearchParams({ category: "APTITUDE" });
        const questionsUrl = `http://localhost:8080/api/question/get-questionbycategory?${params.toString()}`;

        const [topicsRes, compRes] = await Promise.all([
          fetch(questionsUrl, { headers }),
          fetch("http://localhost:8080/api/company/getallcompany", { headers }),
        ]);

        if (!topicsRes.ok) {
          throw new Error(`Failed to load aptitude questions (${topicsRes.status})`);
        }

        const topicsData = await topicsRes.json();
        const compData = compRes.ok ? await compRes.json() : [];

        const normalizedTopics = Array.isArray(topicsData?.content)
          ? topicsData.content
          : Array.isArray(topicsData)
            ? topicsData
            : [];

        const normalizedCompanies = Array.isArray(compData?.content)
          ? compData.content
          : Array.isArray(compData)
            ? compData
            : [];

        if (!ignore) {
          setTopics(normalizedTopics);
          setCompanies(normalizedCompanies);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to connect to the backend.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDifficultyChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setCurrentPage(1);
  };

  const handleSelectOption = (e, cardKey, optIndex) => {
    e.stopPropagation();
    setSelectedOptions((prev) => ({
      ...prev,
      [cardKey]: optIndex,
    }));
  };

  const handleToggleExplanation = (e, cardKey) => {
    e.stopPropagation();
    setOpenExplanations((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  // Helper for difficulty badge styling
  const getDifficultyColor = (difficulty) => {
    switch ((difficulty || "").toLowerCase()) {
      case "easy":
        return "bg-cyan-900/40 text-cyan-400 border-cyan-800";
      case "medium":
        return "bg-blue-900/40 text-blue-400 border-blue-800";
      case "hard":
        return "bg-red-900/40 text-red-400 border-red-800";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  // Filter topics by both difficulty and selected company
  const filteredTopics = topics.filter((topic) => {
    const matchesDifficulty =
      activeFilter === "All" ||
      (topic.difficulty || "").toLowerCase() === activeFilter.toLowerCase();

    const topicCompanies = Array.isArray(topic.companies)
      ? topic.companies
      : topic.company
      ? [topic.company]
      : [];

    const matchesCompany =
      selectedCompany === "ALL" ||
      topicCompanies.some(
        (c) =>
          String(typeof c === "string" ? c : c.name).toLowerCase() ===
          selectedCompany.toLowerCase()
      );

    return matchesDifficulty && matchesCompany;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTopics = filteredTopics.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.max(1, totalPages)) return;
    setCurrentPage(page);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Direct card click navigation to PracticeSession
  const handleCardClick = (topic) => {
    const diffParam = (topic.difficulty || "MEDIUM").toUpperCase();
    const companyParam =
      selectedCompany !== "ALL"
        ? `&company=${encodeURIComponent(selectedCompany)}`
        : "";

    navigate(
      `/practice?category=APTITUDE&difficulty=${diffParam}&topicId=${topic.id ?? topic.questionId}${companyParam}`
    );
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex h-screen bg-[#0f172a] text-white p-6 font-sans overflow-y-auto w-full custom-scrollbar"
    >
      {/* Main Content (Full Width) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Aptitude MCQ Practice</h1>
          <p className="text-gray-400">
            Master quantitative and mathematical problem solving for placement tests.
          </p>
        </div>

        {/* Filters + Company Dropdown Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-4">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => handleDifficultyChange(filter)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Company Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="aptitude-company-filter"
              className="text-sm text-gray-400"
            >
              Company:
            </label>
            <select
              id="aptitude-company-filter"
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="rounded-lg border border-gray-700 bg-[#1e293b] px-3 py-1.5 text-sm text-white outline-none transition focus:border-cyan-500"
            >
              <option value="ALL">All Companies</option>
              {companies.map((comp) => {
                const name = typeof comp === "string" ? comp : comp.name;
                return (
                  <option key={comp.companyId || comp.id || name} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div className="rounded-xl border border-gray-800 bg-[#1e293b] p-8 text-center text-sm text-gray-400">
            Loading aptitude topics...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-6 text-sm text-red-400">
            {error}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-[#1e293b] p-8 text-center text-sm text-gray-400">
            No aptitude topics found for the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
            {paginatedTopics.map((topic, index) => {
              const cardKey = topic.id ?? topic.questionId ?? index;
              const options = Array.isArray(topic.options) ? topic.options : [];
              const selectedIdx = selectedOptions[cardKey];
              const isExplanationOpen = Boolean(openExplanations[cardKey]);

              const askedIn = Array.isArray(topic.companies)
                ? topic.companies.map((c) =>
                    typeof c === "string" ? c : c.name
                  )
                : topic.company
                ? [topic.company]
                : [];

              return (
                <div
                  key={cardKey}
                  onClick={() => handleCardClick(topic)}
                  className="cursor-pointer bg-[#1e293b] rounded-xl p-6 border border-gray-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all flex flex-col shadow-sm"
                >
                  {/* Card Header (Type & Difficulty) */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                      <span className="text-xs font-semibold text-cyan-400 mb-1 block uppercase tracking-wider">
                        {topic.category || topic.type || "APTITUDE"}
                      </span>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {topic.question || topic.title || topic.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md border shrink-0 ${getDifficultyColor(
                        topic.difficulty
                      )} font-medium`}
                    >
                      {topic.difficulty || "Medium"}
                    </span>
                  </div>

                  {/* Options List */}
                  {options.length > 0 && (
                    <div className="my-3 space-y-2">
                      {options.map((opt, optIdx) => {
                        const label = String.fromCharCode(65 + optIdx);
                        const optionText =
                          typeof opt === "string"
                            ? opt
                            : opt.option ?? opt.optionText ?? opt.text ?? "";
                        const isSelected = selectedIdx === optIdx;

                        return (
                          <button
                            key={opt.id ?? `${cardKey}-opt-${optIdx}`}
                            type="button"
                            onClick={(e) =>
                              handleSelectOption(e, cardKey, optIdx)
                            }
                            className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition flex items-start gap-2 ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                                : "border-slate-700 bg-[#0f172a] text-gray-300 hover:border-slate-500"
                            }`}
                          >
                            <span className="font-semibold text-cyan-400 shrink-0">
                              {label}.
                            </span>
                            <span>{optionText}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Companies where these questions were asked */}
                  {askedIn.length > 0 && (
                    <div className="mt-2 mb-3 flex flex-wrap items-center gap-2 border-t border-gray-800 pt-3">
                      <span className="text-xs text-gray-400">Asked in:</span>
                      {askedIn.map((comp) => (
                        <span
                          key={comp}
                          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Explanation Toggle Button & Hidden Explanation */}
                  {topic.explanation && (
                    <div className="mt-auto pt-2">
                      <button
                        type="button"
                        onClick={(e) => handleToggleExplanation(e, cardKey)}
                        className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                      >
                        {isExplanationOpen
                          ? "Hide Explanation"
                          : "Show Explanation"}
                      </button>

                      {isExplanationOpen && (
                        <div className="mt-3 rounded-lg border border-slate-700 bg-[#0f172a] p-3 text-xs leading-relaxed text-gray-300">
                          <span className="font-semibold text-cyan-400 block mb-1">
                            Explanation:
                          </span>
                          {topic.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER PAGINATION (Always visible) */}
        <footer className="mt-auto mb-6 flex items-center justify-center gap-2 border-t border-gray-800 pt-6">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-700 bg-[#1e293b] px-3.5 py-2 text-sm text-gray-300 transition hover:border-cyan-500 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
                  currentPage === page
                    ? "border-cyan-500 bg-cyan-600/25 text-cyan-300"
                    : "border-gray-700 bg-[#1e293b] text-gray-300 hover:border-cyan-500 hover:text-cyan-300"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= Math.max(1, totalPages)}
            className="rounded-lg border border-gray-700 bg-[#1e293b] px-3.5 py-2 text-sm text-gray-300 transition hover:border-cyan-500 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </footer>
      </div>

      {/* Basic Scrollbar Styling */}
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

export default Aptitude;