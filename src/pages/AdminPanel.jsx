import React, { useState } from "react";
import { FiGrid, FiFileText, FiBriefcase, FiPlus } from "react-icons/fi";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [questionForm, setQuestionForm] = useState({
    category: "TECHNICAL",
    difficulty: "MEDIUM",
    questionText: "",
    correctAnswer: ""
  });

  const [companyForm, setCompanyForm] = useState({
    name: "",
    logoUrl: ""
  });

  // --- API Handlers ---
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");
    
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/api/admin/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(questionForm)
      });

      if (!response.ok) throw new Error("Failed to add question to the database.");
      
      setStatusMessage("✅ Question added successfully!");
      setQuestionForm({ ...questionForm, questionText: "", correctAnswer: "" }); // Clear text fields
    } catch (error) {
      setStatusMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/api/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(companyForm)
      });

      if (!response.ok) throw new Error("Failed to add company to the database.");
      
      setStatusMessage("✅ Company added successfully!");
      setCompanyForm({ name: "", logoUrl: "" }); // Reset form
    } catch (error) {
      setStatusMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans w-full">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col p-6 shrink-0">
        <h2 className="text-xl font-bold mb-8 text-teal-400 tracking-wide">Admin Portal</h2>
        
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition font-medium ${activeTab === "dashboard" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}
          >
            <FiGrid size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("questions")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition font-medium ${activeTab === "questions" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}
          >
            <FiFileText size={18} /> Add Questions
          </button>
          <button 
            onClick={() => setActiveTab("companies")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition font-medium ${activeTab === "companies" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}
          >
            <FiBriefcase size={18} /> Add Companies
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
        
        <div className="max-w-4xl mx-auto">
          {/* Status Message Alert */}
          {statusMessage && (
            <div className={`mb-6 p-4 rounded-lg border flex justify-between items-center animate-fade-in ${statusMessage.includes("❌") ? "bg-red-900/20 border-red-500/50 text-red-400" : "bg-teal-900/20 border-teal-500/50 text-teal-400"}`}>
              <span className="font-medium">{statusMessage}</span>
              <button onClick={() => setStatusMessage("")} className="hover:opacity-70 transition-opacity">✕</button>
            </div>
          )}

          {/* TAB 1: Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8">Platform Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 shadow-sm">
                  <p className="text-gray-400 text-sm mb-2 font-medium">Server Status</p>
                  <p className="text-3xl font-bold text-teal-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></span> Online
                  </p>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 shadow-sm">
                  <p className="text-gray-400 text-sm mb-2 font-medium">Total Users</p>
                  <p className="text-3xl font-bold">1,245</p>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 shadow-sm">
                  <p className="text-gray-400 text-sm mb-2 font-medium">Question Bank</p>
                  <p className="text-3xl font-bold">850</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Add Questions */}
          {activeTab === "questions" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8">Add New Question</h1>
              <form onSubmit={handleAddQuestion} className="bg-[#1e293b] p-8 rounded-xl border border-gray-800 shadow-sm space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                    <select 
                      value={questionForm.category}
                      onChange={(e) => setQuestionForm({...questionForm, category: e.target.value})}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    >
                      <option value="TECHNICAL">Technical</option>
                      <option value="APPTITUDE">Aptitude</option>
                      <option value="REASONING">Reasoning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                    <select 
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value})}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Question Text</label>
                  <textarea 
                    required
                    value={questionForm.questionText}
                    onChange={(e) => setQuestionForm({...questionForm, questionText: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white min-h-[120px] focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Type the question statement here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Correct Answer / Solution</label>
                  <input 
                    type="text"
                    required
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({...questionForm, correctAnswer: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Provide the exact correct answer..."
                  />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FiPlus /> {isSubmitting ? "Saving..." : "Save Question"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Add Companies */}
          {activeTab === "companies" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8">Add New Company</h1>
              <form onSubmit={handleAddCompany} className="bg-[#1e293b] p-8 rounded-xl border border-gray-800 shadow-sm space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                  <input 
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g., Google, Microsoft, TCS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Logo Image URL</label>
                  <input 
                    type="url"
                    required
                    value={companyForm.logoUrl}
                    onChange={(e) => setCompanyForm({...companyForm, logoUrl: e.target.value})}
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="https://example.com/company-logo.png"
                  />
                </div>

                {/* Logo Preview */}
                {companyForm.logoUrl && (
                  <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a] inline-block">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Logo Preview</p>
                    <img 
                      src={companyForm.logoUrl} 
                      alt="Preview" 
                      className="h-16 object-contain bg-white rounded p-1" 
                      onError={(e) => e.target.style.display = 'none'} 
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-gray-800">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FiPlus /> {isSubmitting ? "Adding..." : "Add Company"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default AdminPanel;