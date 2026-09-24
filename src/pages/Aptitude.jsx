import { useState } from "react"

const questions = [
  {
    id: 101,
    question: "A number is increased by 20%. If the original number is 250, what is the new number?",
    options: ["280", "290", "300", "320"],
    correctAnswer: "300"
  },

  {
    id: 102,
    question: "A shopkeeper buys an article for ₹800 and sells it for ₹960. What is the profit percentage?",
    options: ["15%", "20%", "25%", "30%"],
    correctAnswer: "20%"
  },

  {
    id: 103,
    question: "The average of 10, 20, 30, 40 and 50 is:",
    options: ["25", "30", "35", "40"],
    correctAnswer: "30"
  },

  {
    id:104,
    question: "What is the simple interest on ₹5000 at 8% per annum for 2 years?",
    options: ["₹400", "₹600", "₹800", "₹1000"],
    correctAnswer: "₹800"
  },
]


const Aptitude = () => {

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
        Aptitude
      </h1>

      <p className="mt-2 text-gray-600">
        Test your aptitude skills
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

export default Aptitude