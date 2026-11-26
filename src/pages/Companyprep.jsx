import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const CATEGORIES = [
  { value: "TECHNICAL", label: "Technical" },
  { value: "APTITUDE", label: "Aptitude" },
  { value: "REASONING", label: "Reasoning" },
  { value: "HR", label: "HR" },
];

const DEFAULT_CATEGORY = CATEGORIES[0].value;
const COMPANY_PAGE_SIZE = 5;
const QUESTION_PAGE_SIZE = 5;

const getCategoryLabel = (value) =>
  CATEGORIES.find((cat) => cat.value === value)?.label || value;

const CompanyPrep = () => {
  // Company state
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected category per company card
  const [selectedCategories, setSelectedCategories] = useState({});

  // Second-request state: selected company + paged questions
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Company pagination state (Spring Boot Page<T>)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);

  // Question pagination state (Spring Boot Page<T>)
  const [qPage, setQPage] = useState(0);
  const [qTotalPages, setQTotalPages] = useState(0);
  const [qIsFirst, setQIsFirst] = useState(true);
  const [qIsLast, setQIsLast] = useState(true);

  // Request 1: Fetch companies from database
  useEffect(() => {
    let cancelled = false;

    const loadCompanies = async () => {
      try {
        const token = localStorage.getItem("jwtToken");

        const response = await axios.get("http://localhost:8080/api/company/getallcompany", {
          params: {
            page,
            pageSize: COMPANY_PAGE_SIZE,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (cancelled) return;

        const pageData = response.data;
        const companyList = Array.isArray(pageData)
          ? pageData
          : Array.isArray(pageData?.content)
          ? pageData.content
          : [];

        setCompanies(companyList);
        setTotalPages(pageData?.totalPages ?? (companyList.length > 0 ? 1 : 0));
        setIsFirst(pageData?.first ?? page === 0);
        setIsLast(pageData?.last ?? true);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please check your backend connection or login session.");
        setCompanies([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadCompanies();

    return () => {
      cancelled = true;
    };
  }, [page]);

  // Request 2: Fetch paged questions asked in the chosen company (and category)
  const fetchQuestionsForCompany = useCallback(
    async (companyId, categoryOverride, pageOverride = 0) => {
      const category =
        categoryOverride || selectedCategories[companyId] || DEFAULT_CATEGORY;

      setSelectedCompanyId(companyId);
      setQPage(pageOverride);
      setError(null);
      setIsLoadingQuestions(true);

      try {
        const token = localStorage.getItem("jwtToken");

        const response = await axios.get(
          `http://localhost:8080/api/question/getbycompaniesspecific/${companyId}`,
          {
            params: {
              category,
              page: pageOverride,
              size: QUESTION_PAGE_SIZE,
              pageSize: QUESTION_PAGE_SIZE,
            },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        const pageData = response.data;
        const questionList = Array.isArray(pageData)
          ? pageData
          : Array.isArray(pageData?.content)
          ? pageData.content
          : [];

        setQuestions(questionList);
        setQTotalPages(
          pageData?.totalPages ?? (questionList.length > 0 ? 1 : 0)
        );
        setQIsFirst(pageData?.first ?? pageOverride === 0);
        setQIsLast(
          pageData?.last ??
            (pageData?.totalPages ? pageOverride >= pageData.totalPages - 1 : true)
        );
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions for the selected company.");
        setQuestions([]);
        setQTotalPages(0);
        setQIsFirst(true);
        setQIsLast(true);
      } finally {
        setIsLoadingQuestions(false);
      }
    },
    [selectedCategories]
  );

  // Handle dropdown changes for a specific company
  const handleCategoryChange = (companyId, value) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [companyId]: value,
    }));

    if (selectedCompanyId === companyId) {
      fetchQuestionsForCompany(companyId, value, 0);
    }
  };

  const handleQuestionPageChange = (nextPage) => {
    if (!selectedCompanyId || nextPage < 0) return;
    if (qTotalPages > 0 && nextPage >= qTotalPages) return;
    fetchQuestionsForCompany(selectedCompanyId, activeCategoryValue, nextPage);
  };

  const selectedCompany = companies.find((c) => c.companyId === selectedCompanyId);
  const activeCategoryValue = selectedCompanyId
    ? selectedCategories[selectedCompanyId] || DEFAULT_CATEGORY
    : DEFAULT_CATEGORY;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Company Preparation
        </h1>

        <p className="mt-2 text-gray-500">
          Choose a company and topic to fetch and practice its specific questions.
        </p>

        {/* Error Message Banner */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : companies.length === 0 ? (
          /* Empty State */
          <div className="mt-10 text-center text-gray-500 py-12 bg-white rounded-xl border border-slate-200">
            No companies available right now.
          </div>
        ) : (
          <>
            {/* Company Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {companies.map((company) => {
                const currentCategory =
                  selectedCategories[company.companyId] || DEFAULT_CATEGORY;
                const isSelected = selectedCompanyId === company.companyId;

                return (
                  <div
                    key={company.companyId}
                    className={`bg-white p-5 rounded-xl border shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    {/* Company Logo (or Initials Fallback) + Name */}
                    <div className="flex items-center gap-4 mb-4">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={`${company.name} logo`}
                          className="h-14 w-14 object-contain rounded-md bg-slate-50 p-1"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shrink-0">
                          {company.name?.charAt(0).toUpperCase() || "C"}
                        </div>
                      )}

                      <h2 className="text-lg font-bold text-slate-900">
                        {company.name}
                      </h2>
                    </div>

                    {/* Dropdown Selection */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                        Select Topic
                      </label>
                      <select
                        value={currentCategory}
                        onChange={(e) =>
                          handleCategoryChange(company.companyId, e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Second Request Trigger */}
                    <button
                      type="button"
                      onClick={() =>
                        fetchQuestionsForCompany(
                          company.companyId,
                          currentCategory,
                          0
                        )
                      }
                      className="mt-auto w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Practice {getCategoryLabel(currentCategory)}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Company Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => {
                    setIsLoading(true);
                    setPage((prev) => Math.max(prev - 1, 0));
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-slate-600">
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => {
                    setIsLoading(true);
                    setPage((prev) => prev + 1);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* Questions Fetched for Selected Company */}
            {selectedCompanyId && (
              <div className="mt-10 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedCompany?.name || "Company"} —{" "}
                    {getCategoryLabel(activeCategoryValue)} Questions
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedCompanyId(null)}
                    className="text-sm text-slate-500 hover:text-slate-800"
                  >
                    Close
                  </button>
                </div>

                {isLoadingQuestions ? (
                  <p className="py-6 text-sm text-slate-500">
                    Loading questions...
                  </p>
                ) : questions.length === 0 ? (
                  <p className="py-6 text-sm text-slate-500">
                    No questions found for this company and category.
                  </p>
                ) : (
                  <>
                    <ul className="mt-4 space-y-4">
                      {questions.map((q, index) => {
                        const questionText =
                          q.question || q.questionText || q.title || "Question";
                        const optionList = Array.isArray(q.options)
                          ? q.options
                          : [];
                        const displayNumber =
                          qPage * QUESTION_PAGE_SIZE + index + 1;

                        return (
                          <li
                            key={q.questionId ?? q.id ?? index}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <p className="font-medium text-slate-900">
                                {displayNumber}. {questionText}
                              </p>
                              {q.difficulty && (
                                <span className="shrink-0 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                                  {q.difficulty}
                                </span>
                              )}
                            </div>

                            {optionList.length > 0 && (
                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {optionList.map((opt, optIdx) => {
                                  const label =
                                    typeof opt === "string"
                                      ? opt
                                      : opt.option ??
                                        opt.optionText ??
                                        opt.text ??
                                        opt.label ??
                                        "";
                                  const letter = String.fromCharCode(
                                    65 + optIdx
                                  );

                                  return (
                                    <div
                                      key={opt.id ?? opt.optionId ?? optIdx}
                                      className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700"
                                    >
                                      <span className="font-semibold text-slate-900 mr-2">
                                        {letter}.
                                      </span>
                                      {label}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {q.explanation && (
                              <details className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                                <summary className="cursor-pointer font-semibold text-slate-700">
                                  Show Explanation & Answer
                                </summary>
                                <p className="mt-2 leading-relaxed">
                                  {q.explanation}
                                </p>
                              </details>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Questions Pagination Controls at Bottom */}
                    {qTotalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          disabled={qIsFirst || isLoadingQuestions}
                          onClick={() => handleQuestionPageChange(qPage - 1)}
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <span className="text-sm font-medium text-slate-600">
                          Page {qPage + 1} of {qTotalPages}
                        </span>

                        <button
                          type="button"
                          disabled={qIsLast || isLoadingQuestions}
                          onClick={() => handleQuestionPageChange(qPage + 1)}
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyPrep;