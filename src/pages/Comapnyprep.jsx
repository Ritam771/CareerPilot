
import companies from "../data/companies.json";

const CompanyPrep = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Company Preparation
      </h1>

      <p className="mt-2 text-gray-500">
        Choose a company to practice its questions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition duration-200 hover:translate-y-1 hover:shadow-md"
          >
            {/* Company logo and name */}
            <div className="flex items-center gap-4">
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-14 w-14 object-contain"
              />

              <h2 className="text-lg font-bold">
                {company.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(`You selected ${company.name}`)
              }
             className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              View Questions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyPrep;
