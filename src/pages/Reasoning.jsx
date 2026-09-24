import { useState } from "react"

const questions = [
  {
    id: 201,
    question: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    correctAnswer: "42"
  },

  {
    id: 202,
    question: "If CAT is coded as DBU, how is DOG coded?",
    options: ["EPH", "EOH", "FPH", "DPG"],
    correctAnswer: "EPH"
  },

  {
    id: 203,
    question: "Pointing to a man, Ravi said, He is the son of my mother's only son. How is the man related to Ravi?",
    options: ["Brother", "Son", "Father", "Uncle"],
    correctAnswer: "Son"
  },
]

const Reasoning = () => {

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
  }

  const handleNextQuestion = () => {

    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800">
        Reasoning
      </h1>

      <p className="mt-2 text-gray-600">
        Test your reasoning skills.
      </p>

      {/* Question Card */}

      <div className="mt-8 max-w-2xl bg-white p-6 rounded-lg shadow">

        <p className="text-sm text-gray-500 mb-3">
          Question {currentQuestion + 1} of {questions.length}
        </p>

        <h2 className="text-xl font-semibold text-gray-800">
          {questions[currentQuestion].question}
        </h2>

        {/* Options */}

        <div className="mt-6 space-y-3">

          {questions[currentQuestion].options.map((option) => (

            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-md border transition ${
                selectedOption === option
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {option}
            </button>

          ))}

        </div>

        {/* Next Button */}

        <button
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
          className="mt-6 px-6 py-2 bg-blue-900 text-white rounded-md disabled:bg-gray-400"
        >
          Next
        </button>

      </div>

    </div>
  )
}

export default Reasoning