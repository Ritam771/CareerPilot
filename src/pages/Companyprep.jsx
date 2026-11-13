import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CompanyPrep = () => {
  // State to hold the dynamic data from the backend
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Pointing to your Spring Boot backend port (8080)
        const response = await fetch("http://localhost:8080/api/companies");
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Company Preparation
      </h1>

      <p className="mt-2 text-gray-500">
        Choose a company to practice its questions.
      </p>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        /* Dynamic Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition duration-200 hover:translate-y-1 hover:shadow-md flex flex-col justify-between"
            >
              {/* Company logo and name */}
              <div className="flex items-center gap-4 mb-2">
                <img
                  src={company.logo_url || company.logo} // Ensures compatibility with your DB column name
                  alt={`${company.name} logo`}
                  className="h-14 w-14 object-contain"
                  onError={(e) => {
                    e.target.src = "/fallback-company-icon.png"; // Fallback image if URL breaks
                  }}
                />

                <h2 className="text-lg font-bold text-slate-900">
                  {company.name}
                </h2>
              </div>

              {/* Action Button routing to dynamic ID */}
              <button
                type="button"
                onClick={() => navigate(`/company-prep/${company.id}`)}
                className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                View Questions
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyPrep;