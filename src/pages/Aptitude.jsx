
import { useState } from "react"

const categories = [
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
  {
    id: 2,
    name: "HCF and LCM",
    group: "Number Skills",
    description: "Solve problems involving highest common factor and least common multiple.",
    icon: "🧮",
    difficulty: "Mixed",
    totalQuestions: 35,
    accuracy: 70
  },
  {
    id: 3,
    name: "Percentage",
    group: "Arithmetic",
    description: "Practice percentage calculations and applications.",
    icon: "％",
    difficulty: "Mixed",
    totalQuestions: 45,
    accuracy: 75
  },
  {
    id: 4,
    name: "Profit, Loss and Discount",
    group: "Arithmetic",
    description: "Learn selling price, cost price, profit, loss and discount.",
    icon: "💰",
    difficulty: "Mixed",
    totalQuestions: 40,
    accuracy: 60
  },
  {
    id: 5,
    name: "Ratio and Proportion",
    group: "Arithmetic",
    description: "Solve ratio, proportion and comparison problems.",
    icon: "⚖️",
    difficulty: "Mixed",
    totalQuestions: 35,
    accuracy: 68
  },
  {
    id: 6,
    name: "Average",
    group: "Arithmetic",
    description: "Practice average, weighted average and related problems.",
    icon: "📊",
    difficulty: "Mixed",
    totalQuestions: 30,
    accuracy: 80
  },
  {
    id: 7,
    name: "Simple and Compound Interest",
    group: "Arithmetic",
    description: "Calculate interest, principal and amount.",
    icon: "🏦",
    difficulty: "Mixed",
    totalQuestions: 35,
    accuracy: 55
  },
  {
    id: 8,
    name: "Time and Work",
    group: "Time & Work",
    description: "Solve work efficiency, combined work and time problems.",
    icon: "⏱️",
    difficulty: "Mixed",
    totalQuestions: 40,
    accuracy: 72
  },
  {
    id: 9,
    name: "Time, Speed and Distance",
    group: "Time & Work",
    description: "Practice speed, distance, trains and relative motion.",
    icon: "🚗",
    difficulty: "Mixed",
    totalQuestions: 40,
    accuracy: 66
  },
  {
    id: 10,
    name: "Permutation and Combination",
    group: "Advanced",
    description: "Solve arrangement and selection problems.",
    icon: "🔀",
    difficulty: "Mixed",
    totalQuestions: 30,
    accuracy: 50
  },
  {
    id: 11,
    name: "Probability",
    group: "Advanced",
    description: "Practice probability and related problems.",
    icon: "🎲",
    difficulty: "Mixed",
    totalQuestions: 30,
    accuracy: 58
  },
  {
    id: 12,
    name: "Data Interpretation",
    group: "Data Interpretation",
    description: "Practice charts, tables and graphs.",
    icon: "📈",
    difficulty: "Mixed",
    totalQuestions: 35,
    accuracy: 74
  }
]

const questions = [
  {
    id: 101,
    categoryId: 3,
    question: "A number is increased by 20%. If the original number is 250, what is the new number?",
    options: ["280", "290", "300", "320"],
    correctAnswer: "300"
  },
  {
    id: 102,
    categoryId: 4,
    question: "A shopkeeper buys an article for ₹800 and sells it for ₹960. What is the profit percentage?",
    options: ["15%", "20%", "25%", "30%"],
    correctAnswer: "20%"
  },
  {
    id: 103,
    categoryId: 6,
    question: "The average of 10, 20, 30, 40 and 50 is:",
    options: ["25", "30", "35", "40"],
    correctAnswer: "30"
  },
  {
    id: 104,
    categoryId: 7,
    question: "What is the simple interest on ₹5000 at 8% per annum for 2 years?",
    options: ["₹400", "₹600", "₹800", "₹1000"],
    correctAnswer: "₹800"
  },
  {
    id: 105,
    categoryId: 1,
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "2"
  },
  {
    id: 106,
    categoryId: 2,
    question: "What is the HCF of 12 and 18?",
    options: ["3", "6", "9", "12"],
    correctAnswer: "6"
  },
  {
    id: 107,
    categoryId: 5,
    question: "If the ratio of two numbers is 2:3 and their sum is 25, what is the smaller number?",
    options: ["5", "10", "15", "20"],
    correctAnswer: "10"
  },
  {
    id: 108,
    categoryId: 8,
    question: "If A can complete a work in 10 days, how much work can A complete in one day?",
    options: ["1/5", "1/10", "1/15", "1/20"],
    correctAnswer: "1/10"
  },
  {
    id: 109,
    categoryId: 9,
    question: "A car travels 120 km in 2 hours. What is its speed?",
    options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"],
    correctAnswer: "60 km/h"
  },
  {
    id: 110,
    categoryId: 10,
    question: "In how many ways can 2 people be selected from 4 people?",
    options: ["4", "6", "8", "12"],
    correctAnswer: "6"
  },
  {
    id: 111,
    categoryId: 11,
    question: "What is the probability of getting a head when a fair coin is tossed?",
    options: ["1/4", "1/2", "1/3", "1"],
    correctAnswer: "1/2"
  },
  {
    id: 112,
    categoryId: 12,
    question: "A table shows sales of 20, 30 and 50 units. What is the total sales?",
    options: ["80", "90", "100", "110"],
    correctAnswer: "100"
  }
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
  const [showQuiz, setShowQuiz] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const filteredCategories = categories.filter((category) => {
    return activeCategory === "All" || category.group === activeCategory
  })

  const startPractice = () => {
    const selectedQuestions = selectedCategory
      ? questions.filter(
          (question) => question.categoryId === selectedCategory
        )
      : questions

    if (selectedQuestions.length === 0) {
      alert("No questions available for this category yet.")
      return
    }

    setQuizQuestions(selectedQuestions)
    setShowQuiz(true)
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
  }

  const handleNextQuestion = () => {
    let updatedScore = score

    if (
      selectedOption === quizQuestions[currentQuestion].correctAnswer
    ) {
      updatedScore = score + 1
      setScore(updatedScore)
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((previousQuestion) => previousQuestion + 1)
      setSelectedOption(null)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setShowQuiz(false)
    setShowResult(false)
    setSelectedOption(null)
    setCurrentQuestion(0)
    setScore(0)
  }

  // QUIZ SCREEN
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">

        <button
          onClick={resetQuiz}
          className="mb-8 rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
        >
          ← Back to Dashboard
        </button>

        {showResult ? (

          <div className="mx-auto max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">

            <h1 className="text-3xl font-bold">
              Practice Completed!
            </h1>

            <p className="mt-5 text-5xl font-bold text-cyan-400">
              {score} / {quizQuestions.length}
            </p>

            <p className="mt-3 text-gray-400">
              You answered {score} questions correctly.
            </p>

            <button
              onClick={startPractice}
              className="mt-8 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-600"
            >
              Try Again
            </button>

          </div>

        ) : (

          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-7 shadow-xl">

            <p className="mb-3 text-sm text-cyan-400">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{
                  width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`
                }}
              />
            </div>

            <h2 className="text-xl font-semibold leading-relaxed">
              {quizQuestions[currentQuestion].question}
            </h2>

            <div className="mt-7 space-y-3">

              {quizQuestions[currentQuestion].options.map((option) => (

                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    selectedOption === option
                      ? "border-cyan-400 bg-cyan-500/20"
                      : "border-slate-700 bg-slate-800 hover:border-cyan-400"
                  }`}
                >
                  {option}
                </button>

              ))}

            </div>

            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="mt-7 rounded-lg bg-cyan-500 px-7 py-3 font-semibold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {currentQuestion === quizQuestions.length - 1
                ? "Finish Practice"
                : "Next Question"}
            </button>

          </div>

        )}

      </div>
    )
  }

  // DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-slate-950 p-5 text-white lg:p-7">

      {/* PAGE HEADER */}

      <div className="mb-7">
        <h1 className="text-3xl font-bold">
          Aptitude Practice
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Master quantitative and mathematical problem solving.
        </p>
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

                <h2 className="mt-5 text-lg font-semibold">
                  {category.name}
                </h2>

                <div className="mt-4 flex gap-6">

                  <div>
                    <p className="text-xl font-bold">
                      {category.accuracy}%
                    </p>
                    <p className="text-xs text-gray-400">
                      Accuracy
                    </p>
                  </div>

                  <div className="border-l border-slate-700 pl-5">
                    <p className="text-xl font-bold">
                      {category.totalQuestions}
                    </p>
                    <p className="text-xs text-gray-400">
                      Questions
                    </p>
                  </div>

                </div>

                <p className="mt-5 text-sm leading-relaxed text-gray-400">
                  {category.description}
                </p>

                <p className="mt-4 text-xs text-cyan-400">
                  {selectedCategory === category.id
                    ? "Selected ✓"
                    : "Click to select"}
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

        {/* RIGHT SIDEBAR */}

        <div className="space-y-5">

          {/* PROGRESS CARD */}

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">

            <h2 className="font-semibold">
              Progress
            </h2>

            <div className="mt-6 flex justify-center">

              <div
                className="flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background: "conic-gradient(#22d3ee 0% 40%, #334155 40% 100%)"
                }}
              >

                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-slate-900">

                  <p className="text-2xl font-bold">
                    320 <span className="text-sm font-normal text-gray-400">/ 800</span>
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Questions Solved
                  </p>

                </div>

              </div>

            </div>

            <hr className="my-6 border-slate-700" />

            <h3 className="font-semibold">
              Strengths & Weaknesses
            </h3>

            <p className="mb-4 mt-4 text-sm text-gray-400">
              Strengths
            </p>

            <div className="mb-2 flex justify-between text-sm">
              <span>Percentage</span>
              <span className="text-cyan-400">75%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-700">
              <div className="h-2 w-3/4 rounded-full bg-cyan-400" />
            </div>

            <p className="mb-2 mt-5 text-sm text-gray-400">
              Weaknesses
            </p>

            <div className="mb-2 flex justify-between text-sm">
              <span>Time and Work</span>
              <span className="text-gray-400">55%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-700">
              <div className="h-2 w-1/2 rounded-full bg-gray-400" />
            </div>

          </div>

          {/* DAILY STREAK CARD */}

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">

            <h2 className="font-semibold">
              Daily Streak
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Your weekly practice activity
            </p>

            <div className="mt-5 grid grid-cols-5 gap-2">

              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (

                <div key={day} className="text-center">

                  <div
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-sm ${
                      index === 0
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                        : "border-slate-700 bg-slate-800 text-gray-400"
                    }`}
                  >
                    {index === 0 ? "✓" : index + 1}
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {day}
                  </p>

                </div>

              ))}

            </div>

            <p className="mt-5 text-sm text-cyan-400">
              Keep practising every day!
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Aptitude
