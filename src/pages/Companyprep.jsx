import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyPrep = () => {
  const navigate = useNavigate();

  // State Management
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State matching Spring Boot's Page<T> response
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        // Verify this URL matches your CompanyController @GetMapping path
        const response = await axios.get("http://localhost:8080/api/company/getallcompany", {
          params: {
            page: page,
            pageSize: pageSize,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Extract the array safely from Spring Boot's Page object (.content)
        const pageData = response.data;
        const companyList = Array.isArray(pageData)
          ? pageData
          : Array.isArray(pageData?.content)
          ? pageData.content
          : [];

        setCompanies(companyList);
        setTotalPages(pageData?.totalPages || 0);
        setIsFirst(pageData?.first ?? true);
        setIsLast(pageData?.last ?? true);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please check your backend connection or login session.");
        setCompanies([]); // Guarantee companies stays an array even on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Company Preparation
        </h1>

        <p className="mt-2 text-gray-500">
          Choose a company to practice its questions.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {Array.isArray(companies) &&
                companies.map((company) => (
                  <div
                    key={company.companyId}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                  >
                    {/* Company Logo (or Initials Fallback) + Name */}
                    <div className="flex items-center gap-4 mb-2">
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

                    {/* View Questions Button */}
                    <button
                      type="button"
                      onClick={() => navigate(`/company-prep/${company.companyId}`)}
                      className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      View Questions
                    </button>
                  </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
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
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyPrep;