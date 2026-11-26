import { useState, useEffect, useCallback } from "react";
import { FiGrid, FiFileText, FiBriefcase, FiPlus, FiCode } from "react-icons/fi";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companies, setCompanies] = useState([]);

  const [questionForm, setQuestionForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "NONE",
    explanation: "",
    difficulty: "MEDIUM",
    category: "APTITUDE",
    companyIds: [],
  });

  const [companyForm, setCompanyForm] = useState({
    name: "",
    logoUrl: "",
  });

  const [codingForm, setCodingForm] = useState({
    number: "",
    title: "",
    difficulty: "Easy",
    leetcodeUrl: "",
    description: "",
  });

  const fetchCompanies = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/api/company/getallcompany", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch companies (${response.status})`);
      }

      const data = await response.json();
      const list = Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data)
          ? data
          : [];

      setCompanies(list);
    } catch (error) {
      console.error("Error fetching companies:", error.message);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadCompanies = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch("http://localhost:8080/api/company/getallcompany", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch companies (${response.status})`);
        }

        const data = await response.json();
        const list = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
            ? data
            : [];

        if (!ignore) {
          setCompanies(list);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error fetching companies:", error.message);
        }
      }
    };

    loadCompanies();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (questionForm.correctOption === "NONE") {
      setStatusMessage("❌ Error: Please select the correct answer option.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    const payload = {
      question: questionForm.question.trim(),
      options: [
        {
          option: questionForm.optionA.trim(),
          isCorrect: questionForm.correctOption === "A",
        },
        {
          option: questionForm.optionB.trim(),
          isCorrect: questionForm.correctOption === "B",
        },
        {
          option: questionForm.optionC.trim(),
          isCorrect: questionForm.correctOption === "C",
        },
        {
          option: questionForm.optionD.trim(),
          isCorrect: questionForm.correctOption === "D",
        },
      ],
      explanation: questionForm.explanation.trim(),
      difficulty: questionForm.difficulty,
      category: questionForm.category,
      companyIds: questionForm.companyIds,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/api/question/create-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to add question (${response.status}).`);
      }

      setStatusMessage("✅ Question added successfully!");
      setQuestionForm((prev) => ({
        ...prev,
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "NONE",
        explanation: "",
      }));
    } catch (error) {
      setStatusMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCodingQuestion = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const token = localStorage.getItem("jwtToken");

      const payload = {
        number: codingForm.number.trim(),
        questionName: codingForm.title.trim(),
        url: codingForm.leetcodeUrl.trim(),
        difficultyLevel: codingForm.difficulty.toUpperCase(),
        description: codingForm.description.trim(),
      };

      const response = await fetch(
        "http://localhost:8080/api/coding/register-codingquestion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to add coding question (${response.status}).`
        );
      }

      setStatusMessage("✅ Coding question added successfully!");
      setCodingForm({
        number: "",
        title: "",
        difficulty: "Easy",
        leetcodeUrl: "",
        description: "",
      });
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
      const response = await fetch("http://localhost:8080/api/company/addcompany", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(companyForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to add company (${response.status}).`);
      }

      setStatusMessage("✅ Company added successfully!");
      setCompanyForm({ name: "", logoUrl: "" });
      await fetchCompanies();
    } catch (error) {
      setStatusMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white font-sans w-full">
      <div className="w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col p-6 shrink-0">
        <h2 className="text-xl font-bold mb-8 text-teal-400 tracking-wide">
          Admin Portal
        </h2>

        <nav className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition font-medium ${
              activeTab === "dashboard"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <FiGrid size={18} /> Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("questions")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition font-medium ${
              activeTab === "questions"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <FiFileText size={18} /> Add Questions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("coding")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition font-medium ${
              activeTab === "coding"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <FiCode size={18} /> Add Coding
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("companies")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition font-medium ${
              activeTab === "companies"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            <FiBriefcase size={18} /> Add Companies
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {statusMessage && (
            <div
              className={`mb-6 p-4 rounded-lg border flex justify-between items-center animate-fade-in ${
                statusMessage.includes("❌")
                  ? "bg-red-900/20 border-red-500/50 text-red-400"
                  : "bg-teal-900/20 border-teal-500/50 text-teal-400"
              }`}
            >
              <span className="font-medium">{statusMessage}</span>
              <button
                type="button"
                onClick={() => setStatusMessage("")}
                className="hover:opacity-70 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8">Platform Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 shadow-sm">
                  <p className="text-gray-400 text-sm mb-2 font-medium">
                    Server Status
                  </p>
                  <p className="text-3xl font-bold text-teal-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse"></span>{" "}
                    Online
                  </p>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 shadow-sm">
                  <p className="text-gray-400 text-sm mb-2 font-medium">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold">1,245</p>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 shadow-sm">
                  <p className="text-gray-400 text-sm mb-2 font-medium">
                    Question Bank
                  </p>
                  <p className="text-3xl font-bold">850</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8">Add New Question</h1>
              <form
                onSubmit={handleAddQuestion}
                className="bg-[#1e293b] p-8 rounded-xl border border-gray-800 shadow-sm space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Category
                    </label>
                    <select
                      value={questionForm.category}
                      onChange={(e) =>
                        setQuestionForm({ ...questionForm, category: e.target.value })
                      }
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    >
                      <option value="TECHNICAL">Technical</option>
                      <option value="APTITUDE">Aptitude</option>
                      <option value="REASONING">Reasoning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={questionForm.difficulty}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Company
                    </label>
                    <select
                      value={questionForm.companyIds[0] ?? "NONE"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestionForm({
                          ...questionForm,
                          companyIds: val === "NONE" ? [] : [Number(val)],
                        });
                      }}
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    >
                      <option value="NONE">None</option>
                      {companies.map((comp) => (
                        <option key={comp.companyId} value={comp.companyId}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Question Text
                  </label>
                  <textarea
                    required
                    value={questionForm.question}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question: e.target.value,
                      })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white min-h-[120px] focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Type the question statement here..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["A", "B", "C", "D"].map((opt) => (
                    <div key={opt}>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Option {opt}
                      </label>
                      <input
                        type="text"
                        required
                        value={questionForm[`option${opt}`]}
                        onChange={(e) =>
                          setQuestionForm({
                            ...questionForm,
                            [`option${opt}`]: e.target.value,
                          })
                        }
                        className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                        placeholder={`Enter Option ${opt}...`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Correct Answer Option
                  </label>
                  <select
                    value={questionForm.correctOption}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        correctOption: e.target.value,
                      })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="NONE">None</option>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Explanation
                  </label>
                  <textarea
                    required
                    value={questionForm.explanation}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        explanation: e.target.value,
                      })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white min-h-[90px] focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Explain the solution or reasoning..."
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

          {activeTab === "coding" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8">Add Coding Question</h1>
              <form
                onSubmit={handleAddCodingQuestion}
                className="bg-[#1e293b] p-8 rounded-xl border border-gray-800 shadow-sm space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      LeetCode Question Number
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={codingForm.number}
                      onChange={(e) =>
                        setCodingForm({ ...codingForm, number: e.target.value })
                      }
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="e.g., 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={codingForm.difficulty}
                      onChange={(e) =>
                        setCodingForm({
                          ...codingForm,
                          difficulty: e.target.value,
                        })
                      }
                      className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Question Name
                  </label>
                  <input
                    type="text"
                    required
                    value={codingForm.title}
                    onChange={(e) =>
                      setCodingForm({ ...codingForm, title: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g., Two Sum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    LeetCode Link
                  </label>
                  <input
                    type="url"
                    required
                    value={codingForm.leetcodeUrl}
                    onChange={(e) =>
                      setCodingForm({
                        ...codingForm,
                        leetcodeUrl: e.target.value,
                      })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="https://leetcode.com/problems/two-sum/"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Short Description (Optional)
                  </label>
                  <textarea
                    value={codingForm.description}
                    onChange={(e) =>
                      setCodingForm({
                        ...codingForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white min-h-[90px] focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Briefly describe the problem..."
                  />
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FiPlus /> {isSubmitting ? "Saving..." : "Save Coding Question"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "companies" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold mb-8">Add New Company</h1>
              <form
                onSubmit={handleAddCompany}
                className="bg-[#1e293b] p-8 rounded-xl border border-gray-800 shadow-sm space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, name: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g., TCS, Wipro, Capgemini, Deloitte"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={companyForm.logoUrl}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, logoUrl: e.target.value })
                    }
                    className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="https://example.com/company-logo.png"
                  />
                </div>

                {companyForm.logoUrl && (
                  <div className="p-4 border border-gray-700 rounded-lg bg-[#0f172a] inline-block">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">
                      Logo Preview
                    </p>
                    <img
                      src={companyForm.logoUrl}
                      alt="Preview"
                      className="h-16 object-contain bg-white rounded p-1"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
};

export default AdminPanel;