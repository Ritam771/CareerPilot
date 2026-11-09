
import { useState } from "react";
import questions from "../data/questions.json";

const correctAnswers = {
  1: 101,
  2: 202,
  3: 302,
  4: 402,
  5: 503,
};

const Technical = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  if (questions.length === 0) {
    return <div className="p-6">No questions available.</div>;
  }

  const currentQuestion = questions[currentIndex];
  const selectedOption = selectedAnswers[currentQuestion.id];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const score = questions.filter(
    (question) =>
      selectedAnswers[question.id] === correctAnswers[question.id]
  ).length;

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Technical
      </h1>

      <p className="mt-2 text-base text-gray-600">
        Test your technical skills
      </p>

      <div className="mt-8 max-w-5xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {isFinished ? (
          <div className="py-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Test Completed!
            </h2>

            <p className="mt-3 text-base text-gray-600">
              Your score: {score} out of {questions.length}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Accuracy: {Math.round((score / questions.length) * 100)}%
            </p>

            <button
              onClick={handleRestart}
              className="mt-5 rounded-lg bg-indigo-900 px-5 py-2.5 text-white hover:bg-indigo-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-base text-gray-500">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <p className="text-sm font-medium text-indigo-900">
                {Math.round(progress)}% completed
              </p>
            </div>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-indigo-900 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <h2 className="mb-6 text-xl font-medium leading-relaxed text-gray-900">
              {currentQuestion.question.trim()}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [currentQuestion.id]: option.id,
                    })
                  }
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-base transition ${
                    selectedOption === option.id
                      ? "border-indigo-800 bg-indigo-50 ring-1 ring-indigo-800"
                      : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium ${
                      selectedOption === option.id
                        ? "border-indigo-800 bg-indigo-800 text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option.text}</span>
                </button>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={selectedOption === undefined}
                className="rounded-lg bg-indigo-900 px-6 py-2.5 text-sm text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {currentIndex === questions.length - 1
                  ? "Finish Test"
                  : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Technical;
