import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const PracticeSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract parameters from the URL (defaulting to APPTITUDE and MEDIUM if missing)
  const category = searchParams.get("category") || "APPTITUDE";
  const difficulty = searchParams.get("difficulty") || "MEDIUM";
  
  // State for fetching data
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPracticeQuestions = async () => {
      setIsLoading(true);
      try {
        // Construct the exact URL from your Postman screenshot
        const queryParams = new URLSearchParams({
          difficulty: difficulty.toUpperCase(),
          category: category.toUpperCase(),
          page: 0,
          pageSize: 10
        });

        const apiUrl = `http://localhost:8080/api/question/get-questionbycategoryanddifficulty?${queryParams.toString()}`;

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error("Failed to fetch questions from the server.");
        }

        const data = await response.json();
        
        // Handle both raw arrays or Spring Boot paginated objects (data.content)
        setQuestions(data.content || data); 
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPracticeQuestions();
  }, [category, difficulty]);

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 font-sans w-full overflow-hidden">
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
        
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors border border-gray-700"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold capitalize">{category.toLowerCase()} Practice</h1>
              <p className="text-sm text-gray-400">
                Difficulty: <span className="text-teal-400 font-medium">{difficulty}</span> | Page: 0
              </p>
            </div>
          </div>
          <div className="bg-[#1e293b] px-4 py-2 rounded-lg border border-gray-700 text-sm">
            Total Questions: <span className="font-bold text-white">{questions.length}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-xl">
              {error}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-[#1e293b] rounded-xl border border-gray-700">
              No questions found for {category} ({difficulty}). Check back later!
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={index} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-200">
                      Question {index + 1}
                    </h3>
                  </div>
                  
                  {/* Map your backend question text variable here (e.g., q.questionText) */}
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed whitespace-pre-wrap">
                    {q.questionText || "Question text from backend..."}
                  </p>
                  
                  {/* Options (If your backend returns options, map them here. Otherwise, leave the View Solution button) */}
                  <div className="border-t border-gray-700 pt-4 mt-4 flex justify-end">
                    <button className="text-teal-400 font-semibold text-sm hover:text-teal-300 flex items-center gap-2">
                      <FiCheckCircle /> View Solution
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default PracticeSession;