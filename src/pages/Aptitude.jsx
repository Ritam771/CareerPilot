import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const Aptitude = () => {
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch both aptitude categories and companies from Spring Boot backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        };

        const [catRes, compRes] = await Promise.all([
          fetch("http://localhost:8080/api/aptitude/categories", { headers }),
          fetch("http://localhost:8080/api/companies", { headers }),
        ]);

        if (!catRes.ok) {
          throw new Error(`Failed to load categories (${catRes.status})`);
        }

        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : []);

        if (compRes.ok) {
          const compData = await compRes.json();
          setCompanies(Array.isArray(compData) ? compData : []);
        }
      } catch (err) {
        setError(err.message || "Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedCompany]);

  // Dynamically generate filter buttons from backend data
  const filters = [
    "All",
    ...new Set(categories.map((cat) => cat.group).filter(Boolean)),
  ];

  // Filter by both topic group and selected company
  const filteredCategories = categories.filter((category) => {
    const matchesGroup =
      activeCategory === "All" || category.group === activeCategory;

    const categoryCompanies = Array.isArray(category.companies)
      ? category.companies
      : category.company
      ? [category.company]
      : [];

    const matchesCompany =
      selectedCompany === "ALL" ||
      categoryCompanies.some(
        (c) => c.toLowerCase() === selectedCompany.toLowerCase()
      );

    return matchesGroup && matchesCompany;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.max(1, totalPages)) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate directly to practice when a card is clicked
  const handleCardClick = (category) => {
    const selectedDiff = category.difficulty || "MEDIUM";
    const diffParam =
      selectedDiff === "Mixed" ? "MEDIUM" : selectedDiff.toUpperCase();
    const companyParam =
      selectedCompany !== "ALL"
        ? `&company=${encodeURIComponent(selectedCompany)}`
        : "";

    navigate(
      `/practice?category=APPTITUDE&difficulty=${diffParam}&topicId=${category.id}${companyParam}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 p-5 text-white lg:p-7">
      {/* PAGE HEADER */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold">Aptitude Practice</h1>
        <p className="mt-2 text-sm text-gray-400">
          Master quantitative and mathematical problem solving.
        </p>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className="grid flex-1 grid-cols-1 gap-6 xl:grid-cols-4">
        {/* LEFT SECTION */}
        <div className="flex flex-col xl:col-span-3">
          {/* CATEGORY FILTERS + COMPANY DROPDOWN */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveCategory(filter)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    activeCategory === filter
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : "border-slate-700 bg-slate-900 text-gray-300 hover:border-cyan-400"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Company Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="company-filter"
                className="text-sm text-gray-400"
              >
                Company:
              </label>
              <select
                id="company-filter"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
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

          {/* CATEGORY CARDS */}
          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-gray-400">
              Loading aptitude topics...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-6 text-sm text-red-400">
              {error}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-sm text-gray-400">
              No aptitude topics found for the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {paginatedCategories.map((category) => {
                const askedIn = Array.isArray(category.companies)
                  ? category.companies
                  : category.company
                  ? [category.company]
                  : [];

                return (
                  <div
                    key={category.id}
                    onClick={() => handleCardClick(category)}
                    className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900 p-5 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500/20 text-2xl text-cyan-400">
                        {category.icon || "📘"}
                      </span>
                      <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-cyan-300">
                        {category.difficulty || "Mixed"}
                      </span>
                    </div>

                    <h2 className="mt-5 text-lg font-semibold">
                      {category.name}
                    </h2>

                    <div className="mt-4 flex gap-6">
                      <div>
                        <p className="text-xl font-bold">
                          {category.accuracy ?? 0}%
                        </p>
                        <p className="text-xs text-gray-400">Accuracy</p>
                      </div>
                      <div className="border-l border-slate-700 pl-5">
                        <p className="text-xl font-bold">
                          {category.totalQuestions ?? 0}
                        </p>
                        <p className="text-xs text-gray-400">Questions</p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-gray-400">
                      {category.description}
                    </p>

                    {/* Companies where these questions were asked */}
                    {askedIn.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3">
                        <span className="text-xs text-gray-400">
                          Asked in:
                        </span>
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

                    <p className="mt-4 text-xs font-medium text-cyan-400">
                      Click to start practice →
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* FOOTER PAGINATION (Always visible) */}
          <footer className="mt-auto mb-4 flex items-center justify-center gap-2 border-t border-slate-800 pt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`h-9 w-9 rounded-lg border text-sm font-semibold transition ${
                    currentPage === page
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : "border-slate-700 bg-slate-900 text-gray-300 hover:border-cyan-400 hover:text-cyan-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.max(1, totalPages)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </footer>
        </div>

        {/* RIGHT SIDEBAR (Keep existing) */}
        <div className="space-y-5">
          {/* ... (Keep existing Progress and Daily Streak cards exactly as they were) ... */}
        </div>
      </div>
    </div>
  );
};

export default Aptitude;