import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const filters = ["All", "Easy", "Medium", "Hard"];
const ITEMS_PER_PAGE = 6;

const Technical = () => {
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch Technical topics and Companies dynamically from Spring Boot
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const params = new URLSearchParams({ category: "TECHNICAL" });
        const topicsUrl = `http://localhost:8080/api/question/get-questionbycategory?${params.toString()}`;

        const [topicsRes, compRes] = await Promise.all([
          fetch(topicsUrl, { headers }),
          fetch("http://localhost:8080/api/companies", { headers }),
        ]);

        if (!topicsRes.ok) {
          throw new Error(`Failed to load technical topics (${topicsRes.status})`);
        }

        const topicsData = await topicsRes.json();
        const compData = compRes.ok ? await compRes.json() : [];

        if (!ignore) {
          setTopics(Array.isArray(topicsData) ? topicsData : []);
          if (compRes.ok) {
            setCompanies(Array.isArray(compData) ? compData : []);
          }
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

  // Helper for difficulty badge styling
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-900/40 text-emerald-400 border-emerald-800";
      case "Medium":
        return "bg-blue-900/40 text-blue-400 border-blue-800";
      case "Hard":
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
        (c) => c.toLowerCase() === selectedCompany.toLowerCase()
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
      `/practice?category=TECHNICAL&difficulty=${diffParam}&topicId=${topic.id}${companyParam}`
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
          <h1 className="text-3xl font-bold mb-2">Technical MCQ Practice</h1>
          <p className="text-gray-400">
            Master core computer science subjects and fundamental concepts for technical rounds.
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
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
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
              htmlFor="technical-company-filter"
              className="text-sm text-gray-400"
            >
              Company:
            </label>
            <select
              id="technical-company-filter"
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="rounded-lg border border-gray-700 bg-[#1e293b] px-3 py-1.5 text-sm text-white outline-none transition focus:border-emerald-500"
            >
              <option value="ALL">All Companies</option>
              {companies.map((comp) => {
                const name = typeof comp === "string" ? comp : comp.name;
                return (
                  <option key={comp.id || name} value={name}>
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
            Loading technical topics...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-6 text-sm text-red-400">
            {error}
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-[#1e293b] p-8 text-center text-sm text-gray-400">
            No technical topics found for the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
            {paginatedTopics.map((topic) => {
              const completed = topic.completed ?? 0;
              const total = topic.totalQuestions ?? 0;
              const progressPercent = total > 0 ? (completed / total) * 100 : 0;
              const askedIn = Array.isArray(topic.companies)
                ? topic.companies
                : topic.company
                ? [topic.company]
                : [];

              return (
                <div
                  key={topic.id}
                  onClick={() => handleCardClick(topic)}
                  className="cursor-pointer bg-[#1e293b] rounded-xl p-6 border border-gray-700 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex flex-col shadow-sm"
                >
                  {/* Card Header (Type & Difficulty) */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 mb-1 block uppercase tracking-wider">
                        {topic.type || "Core CS"}
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        {topic.title || topic.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md border ${getDifficultyColor(
                        topic.difficulty
                      )} font-medium`}
                    >
                      {topic.difficulty || "Medium"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-5 flex-1">
                    {topic.description}
                  </p>

                  {/* Companies where these questions were asked */}
                  {askedIn.length > 0 && (
                    <div className="mb-4 flex flex-wrap items-center gap-2 border-t border-gray-800 pt-3">
                      <span className="text-xs text-gray-400">Asked in:</span>
                      {askedIn.map((comp) => (
                        <span
                          key={comp}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                      <span>Progress</span>
                      <span>
                        {completed} / {total} Solved
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-medium text-emerald-400">
                    Click to start practice →
                  </p>
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
            className="rounded-lg border border-gray-700 bg-[#1e293b] px-3.5 py-2 text-sm text-gray-300 transition hover:border-emerald-500 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
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
                    ? "border-emerald-500 bg-emerald-600/25 text-emerald-300"
                    : "border-gray-700 bg-[#1e293b] text-gray-300 hover:border-emerald-500 hover:text-emerald-300"
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
            className="rounded-lg border border-gray-700 bg-[#1e293b] px-3.5 py-2 text-sm text-gray-300 transition hover:border-emerald-500 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
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

export default Technical;