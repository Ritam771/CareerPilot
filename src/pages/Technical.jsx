import React, { useState } from "react";
import axios from "axios"; // ADDED AXIOS FOR BACKEND FETCHING

// 1. Mock Data for Topics (You can also fetch this from backend if needed)
const technicalTopics = [
  { id: 1, title: "Object Oriented Programming", difficulty: "Easy", completed: 40, totalQuestions: 50, description: "Core concepts: Inheritance, Polymorphism, Encapsulation, and Abstraction.", type: "Core CS" },
  { id: 2, title: "Database Management Systems", difficulty: "Medium", completed: 25, totalQuestions: 60, description: "SQL queries, Normalization, ACID properties, and Transactions.", type: "Databases" },
  { id: 3, title: "Operating Systems", difficulty: "Medium", completed: 15, totalQuestions: 40, description: "Process scheduling, Deadlocks, Memory management, and Concurrency.", type: "Core CS" },
  { id: 4, title: "Computer Networks", difficulty: "Hard", completed: 10, totalQuestions: 30, description: "OSI model, TCP/IP, Routing algorithms, and Network security.", type: "Networking" },
  { id: 5, title: "Data Structures", difficulty: "Medium", completed: 45, totalQuestions: 80, description: "Arrays, Linked Lists, Trees, Graphs, and Hash Tables.", type: "DSA" },
  { id: 6, title: "System Design Basics", difficulty: "Hard", completed: 5, totalQuestions: 20, description: "Load balancing, Caching, Microservices, and Scalability.", type: "Architecture" },
];

const filters = ["All", "Easy", "Medium", "Hard"];

const Technical = () => {
  // Page States
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Dynamic Quiz States
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper for difficulty badge styling
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-900/40 text-emerald-400 border-emerald-800';
      case 'Medium': return 'bg-blue-900/40 text-blue-400 border-blue-800';
      case 'Hard': return 'bg-red-900/40 text-red-400 border-red-800';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const filteredTopics = activeFilter === "All" 
    ? technicalTopics 
    : technicalTopics.filter(t => t.difficulty === activeFilter);

  // DYNAMIC FETCHING: Handle opening a quiz and fetching questions
  const handleStartQuiz = async (topic) => {
    setActiveTopic(topic);
    setUserAnswers({});
    setIsSubmitted(false);
    setIsLoadingQuestions(true);
    setQuestionsError(null);
    setCurrentQuestions([]);

    try {
      const token = localStorage.getItem("jwtToken"); // Matches CompanyPrep config

      // Modify this URL to match your exact Spring Boot endpoint
      const response = await axios.get("http://localhost:8080/api/questions/get", {
        params: {
          category: "TECHNICAL",
          difficulty: topic.difficulty.toUpperCase()
        },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const rawData = response.data?.content || response.data || [];

      // Map backend entity structure to our UI structure
      // Adapts whether your backend uses an array for options or separate fields (optionA, optionB...)
      const formattedQuestions = rawData.map(q => ({
        id: q.id || q.questionId,
        text: q.questionText || q.text || q.question,
        options: q.options || [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
        correct: q.correctAnswer || q.correct
      }));

      setCurrentQuestions(formattedQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setQuestionsError("Failed to load questions from the server. Please ensure the backend is running.");
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Handle closing a quiz
  const handleBackToTopics = () => {
    setActiveTopic(null);
    setCurrentQuestions([]);
    setUserAnswers({});
    setIsSubmitted(false);
  };

  // Handle selecting an option
  const handleOptionSelect = (questionId, option) => {
    if (!isSubmitted) {
      setUserAnswers(prev => ({ ...prev, [questionId]: option }));
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans overflow-y-auto w-full custom-scrollbar">
      
      {/* Left Column: Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {!activeTopic ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Technical MCQ Practice</h1>
              <p className="text-gray-400">Master core computer science subjects and fundamental concepts for technical rounds.</p>
            </div>

            <div className="flex gap-3 mb-8 border-b border-gray-800 pb-4">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${
                    activeFilter === filter 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-8">
              {filteredTopics.map((topic) => (
                <div 
                  key={topic.id} 
                  className="group relative bg-[#1e293b] rounded-xl p-6 border border-gray-700 hover:border-emerald-500 transition-all overflow-hidden flex flex-col shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 mb-1 block uppercase tracking-wider">{topic.type}</span>
                      <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-md border ${getDifficultyColor(topic.difficulty)} font-medium`}>
                      {topic.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 flex-1">{topic.description}</p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                      <span>Progress</span>
                      <span>{topic.completed} / {topic.totalQuestions} Solved</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div 
                        className="bg-emerald-500 h-1.5 rounded-full" 
                        style={{ width: `${(topic.completed / topic.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[#0f172a]/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 rounded-xl">
                    <button 
                      onClick={() => handleStartQuiz(topic)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/40 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* === QUIZ INTERFACE === */
          <div className="flex flex-col h-full">
            <div className="mb-6 flex items-center gap-4 border-b border-gray-800 pb-6">
              <button 
                onClick={handleBackToTopics}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold">{activeTopic.title} Quiz</h2>
                <p className="text-gray-400 text-sm mt-1">Select the best answer for each question below.</p>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingQuestions && (
              <div className="flex flex-col items-center justify-center flex-1 py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-gray-400">Loading questions from server...</p>
              </div>
            )}

            {/* Error State */}
            {questionsError && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
                {questionsError}
              </div>
            )}

            {/* Empty State */}
            {!isLoadingQuestions && !questionsError && currentQuestions.length === 0 && (
              <div className="text-center py-12 bg-[#1e293b] rounded-xl border border-gray-700 text-gray-400">
                No questions found for this topic in the database.
              </div>
            )}

            {/* Questions List */}
            {!isLoadingQuestions && currentQuestions.length > 0 && (
              <>
                <div className="flex-1 space-y-8 pb-8">
                  {currentQuestions.map((q, index) => (
                    <div key={q.id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-sm">
                      <h4 className="text-lg font-semibold mb-4 text-white">
                        <span className="text-emerald-400 mr-2">Q{index + 1}.</span> 
                        {q.text}
                      </h4>
                      
                      <div className="space-y-3">
                        {q.options.map((opt, i) => {
                          const isSelected = userAnswers[q.id] === opt;
                          const isCorrect = q.correct === opt;
                          
                          let optionStyle = "border-gray-700 bg-[#0f172a] hover:border-emerald-500 text-gray-300";
                          
                          if (isSubmitted) {
                            if (isCorrect) {
                              optionStyle = "border-emerald-500 bg-emerald-900/20 text-emerald-400";
                            } else if (isSelected && !isCorrect) {
                              optionStyle = "border-red-500 bg-red-900/20 text-red-400"; 
                            } else {
                              optionStyle = "border-gray-700 bg-[#0f172a] opacity-50"; 
                            }
                          } else if (isSelected) {
                            optionStyle = "border-emerald-500 bg-emerald-900/20 text-white"; 
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handleOptionSelect(q.id, opt)}
                              disabled={isSubmitted}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex justify-between items-center ${optionStyle} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <span className="font-medium">{opt}</span>
                              
                              {isSubmitted && isCorrect && (
                                <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              {isSubmitted && isSelected && !isCorrect && (
                                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {!isSubmitted && (
                  <div className="sticky bottom-0 pt-4 pb-6 bg-[#0f172a] border-t border-gray-800 flex justify-end">
                    <button
                      onClick={() => setIsSubmitted(true)}
                      disabled={Object.keys(userAnswers).length !== currentQuestions.length}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-400 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      Submit Answers
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Sidebar Stats */}
      <div className="w-80 hidden lg:flex flex-col gap-6 shrink-0">
        
        {/* Progress Widget */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-gray-700 shadow-sm">
          <h3 className="font-bold text-lg mb-6 border-b border-gray-800 pb-3">Your Progress</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Overall Accuracy</span>
                <span className="text-white font-bold">82%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Questions Solved</span>
                <span className="text-white font-bold">140 / 280</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Widget */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-gray-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4 border-b border-gray-800 pb-3">Technical Tips</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5 font-bold">1.</span>
              Always review the ACID properties and normal forms for DBMS interviews.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5 font-bold">2.</span>
              For OOPs, be prepared to explain real-world examples of Polymorphism and Encapsulation.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5 font-bold">3.</span>
              In OS, focus heavily on deadlocks, virtual memory, and process scheduling algorithms.
            </li>
          </ul>
        </div>
      </div>

      {/* Basic Scrollbar Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Technical;