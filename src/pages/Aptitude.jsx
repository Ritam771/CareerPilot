import { useState } from "react"
import { useNavigate } from "react-router-dom" // ADD THIS IMPORT

const categories = [
  // ... (keep your existing categories data)
  {
    id: 1,
    name: "Number System and Simplification",
    group: "Number Skills",
    description: "Practice numbers, divisibility, factors and simplification.",
    icon: "🔢",
    difficulty: "Mixed",
    totalQuestions: 40,
    accuracy: 65
  },
  // ... other categories
]

const filters = [
  "All",
  "Number Skills",
  "Arithmetic",
  "Time & Work",
  "Advanced",
  "Data Interpretation"
]

const Aptitude = () => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const navigate = useNavigate(); // INITIALIZE NAVIGATE

  const filteredCategories = categories.filter((category) => {
    return activeCategory === "All" || category.group === activeCategory
  })

  const startPractice = () => {
    // If no category is selected, default to MEDIUM. Otherwise, use the selected category's difficulty.
    const selectedDiff = selectedCategory 
      ? categories.find(c => c.id === selectedCategory)?.difficulty || "MEDIUM" 
      : "MEDIUM";
    
    // Convert difficulty to upper case to match the backend expectation
    const diffParam = selectedDiff === "Mixed" ? "MEDIUM" : selectedDiff.toUpperCase();

    // ROUTE TO THE DYNAMIC BACKEND PRACTICE PAGE
    navigate(`/practice?category=APPTITUDE&difficulty=${diffParam}`);
  }

  // DASHBOARD SCREEN ONLY (Removed the hardcoded quiz screen)
  return (
    <div className="min-h-screen bg-slate-950 p-5 text-white lg:p-7">
      {/* PAGE HEADER */}
      <div className="mb-7">
        <h1 className="text-3xl font-bold">Aptitude Practice</h1>
        <p className="mt-2 text-sm text-gray-400">Master quantitative and mathematical problem solving.</p>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* LEFT SECTION */}
        <div className="xl:col-span-3">
          {/* CATEGORY FILTERS */}
          <div className="mb-6 flex flex-wrap gap-2">
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

          {/* CATEGORY CARDS */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`cursor-pointer rounded-xl border p-5 transition hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 ${
                  selectedCategory === category.id
                    ? "border-cyan-400 bg-cyan-500/10"
                    : "border-slate-700 bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-500/20 text-2xl text-cyan-400">
                    {category.icon}
                  </span>
                  <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {category.difficulty}
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{category.name}</h2>
                <div className="mt-4 flex gap-6">
                  <div>
                    <p className="text-xl font-bold">{category.accuracy}%</p>
                    <p className="text-xs text-gray-400">Accuracy</p>
                  </div>
                  <div className="border-l border-slate-700 pl-5">
                    <p className="text-xl font-bold">{category.totalQuestions}</p>
                    <p className="text-xs text-gray-400">Questions</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-gray-400">{category.description}</p>
                <p className="mt-4 text-xs text-cyan-400">
                  {selectedCategory === category.id ? "Selected ✓" : "Click to select"}
                </p>
              </div>
            ))}
          </div>

          {/* START PRACTICE BUTTON */}
          <div className="mt-7 flex justify-center">
            <button
              onClick={startPractice}
              className="rounded-xl bg-cyan-500 px-9 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600"
            >
              ◎ Start Practice
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR (Keep existing) */}
        <div className="space-y-5">
          {/* ... (Keep existing Progress and Daily Streak cards exactly as they were) ... */}
        </div>
      </div>
    </div>
  )
}

export default Aptitude