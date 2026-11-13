import React, { useState, useRef } from 'react';
import { 
  FiUploadCloud, FiFileText, FiCheckCircle, 
  FiXCircle, FiMessageSquare, FiEdit3, FiInfo, FiTarget, FiBriefcase
} from 'react-icons/fi';

const AIResumeAnalyzer = () => {
  // --- STATE FOR BACKEND INTEGRATION ---
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const fileInputRef = useRef(null);

  // --- MOCK DATA (To be replaced by Backend API) ---
  const mockBackendResponse = {
    candidateName: "John Doe",
    detectedSkills: "React, Node.js, Python, AWS",
    status: "Parsed Successfully",
    targetedRole: "Software Engineer",
    atsScore: 84,
    scoreLabel: "Good Match",
    strengths: [
      "Strong technical keyword presence",
      "Clear experience hierarchy",
      "Excellent formatting for ATS parsers"
    ],
    improvements: [
      "Quantitative impact missing in bullet points",
      "Include more system design terminology"
    ],
    jdMatch: {
      matchedKeywords: ["React", "Node.js", "Python", "AWS", "REST APIs", "Git"],
      missingKeywords: ["GraphQL", "Docker", "CI/CD", "Agile", "TypeScript"]
    },
    skillMatches: [
      { label: "Overall JD Match", percent: 78, color: "bg-indigo-500" },
      { label: "Technical Requirements", percent: 85, color: "bg-teal-400" },
      { label: "Soft Skills & Leadership", percent: 60, color: "bg-blue-500" }
    ]
  };

  // --- HANDLERS ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setAnalysisResults(null);
      setScanProgress(0);
    }
  };

  const handleStartAnalysis = () => {
    if (!resumeFile) return;
    setIsAnalyzing(true);
    setScanProgress(0);

    // TODO (Backend): Form Data Payload for API
    // const formData = new FormData();
    // formData.append('resume', resumeFile);
    // formData.append('jobDescription', jobDescription);
    // await axios.post('/api/analyze-resume', formData);
    
    // Simulate backend processing
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisResults(mockBackendResponse);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const resetAnalyzer = () => {
    setResumeFile(null);
    setJobDescription("");
    setAnalysisResults(null);
    setScanProgress(0);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans w-full overflow-hidden">
      
      {/* ================= LEFT COLUMN: UPLOAD & FORM ================= */}
      <div className="w-1/3 flex flex-col gap-5 shrink-0 h-full overflow-y-auto pb-6 pr-2 custom-scrollbar">
        
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Resume Analyzer</h1>
          <p className="text-gray-400 text-sm">
            Optimize your resume for ATS and get tailored keyword insights against your target role.
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-2xl border border-gray-700/60 p-6 flex flex-col relative overflow-hidden shadow-lg">
          
          {/* Section 1: Resume Upload */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FiFileText className="text-teal-400" /> Step 1: Upload Resume
            </h3>
            
            <div 
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
                isAnalyzing ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-70' :
                resumeFile ? 'border-teal-500/50 bg-teal-900/10 cursor-pointer hover:bg-teal-900/20' : 
                'border-gray-600 bg-[#0f172a] cursor-pointer hover:border-teal-400/50 hover:bg-[#162137]'
              }`}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
              
              {resumeFile ? (
                <>
                  <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mb-3">
                    <FiCheckCircle size={24} />
                  </div>
                  <p className="text-sm font-bold text-teal-300 truncate max-w-full px-4">{resumeFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <FiUploadCloud size={36} className="text-gray-500 mb-3" />
                  <p className="text-sm font-medium text-gray-300">Click or drag file to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PDF or DOCX (Max 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Job Description */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FiBriefcase className="text-blue-400" /> Step 2: Target Job (Optional)
            </h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isAnalyzing}
              placeholder="Paste the job description here for a tailored JD Match score and keyword gap analysis..."
              className="w-full bg-[#0f172a] border border-gray-600/60 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:border-blue-500 h-32 resize-none transition-colors placeholder-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Section 3: Submit Action */}
          <div className="mt-auto">
            {isAnalyzing ? (
              <div className="w-full p-4 bg-[#0f172a] rounded-xl border border-gray-700">
                <div className="flex justify-between text-xs font-medium text-teal-400 mb-2">
                  <span className="animate-pulse">Scanning Document...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-full rounded-full transition-all duration-200" style={{ width: `${scanProgress}%` }}></div>
                </div>
              </div>
            ) : (
              <button 
                disabled={!resumeFile}
                onClick={handleStartAnalysis}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  resumeFile 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                <FiTarget size={18} />
                Submit & Analyze
              </button>
            )}
          </div>
          
        </div>
      </div>

      {/* ================= RIGHT COLUMN: DASHBOARD RESULTS ================= */}
      <div className="flex-1 flex flex-col h-full bg-[#1e293b] rounded-2xl border border-gray-700/60 overflow-hidden shadow-xl relative">
        
        {!analysisResults ? (
          /* Empty / Waiting State */
          <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/50 to-[#1e293b]">
             <div className="w-24 h-24 bg-[#0f172a] rounded-2xl border border-gray-700 flex items-center justify-center mb-6 shadow-inner">
               <FiFileText size={40} className="text-gray-600" />
             </div>
             <h2 className="text-xl font-bold text-gray-200 mb-2">Awaiting Submission</h2>
             <p className="text-sm text-gray-500 max-w-md leading-relaxed">
               Upload your resume and paste a job description on the left. Our AI will extract your skills, score your formatting, and identify missing keywords to help you beat the ATS.
             </p>
          </div>
        ) : (
          /* Results Dashboard */
          <div className="h-full overflow-y-auto p-8 animate-fade-in custom-scrollbar">
            
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
              <button onClick={resetAnalyzer} className="text-sm text-gray-400 hover:text-white transition-colors border border-gray-600 px-4 py-1.5 rounded-lg">
                Start New Analysis
              </button>
            </div>

            {/* Parsed Meta Data Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Candidate Name</p>
                <p className="text-sm font-semibold text-gray-200 truncate">{analysisResults.candidateName}</p>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Targeted Role</p>
                <p className="text-sm font-semibold text-gray-200 truncate">{analysisResults.targetedRole}</p>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Parsing Status</p>
                <p className="text-sm font-semibold text-teal-400 truncate flex items-center gap-1">
                  <FiCheckCircle size={14} /> {analysisResults.status}
                </p>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Top Skills</p>
                <p className="text-sm font-semibold text-gray-200 truncate" title={analysisResults.detectedSkills}>
                  {analysisResults.detectedSkills}
                </p>
              </div>
            </div>

            {/* Main Score & Feedback Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* ATS Gauge */}
              <div className="bg-[#0f172a] rounded-2xl border border-gray-700/50 p-6 flex flex-col items-center justify-center relative col-span-1 shadow-lg">
                <div className="absolute top-4 left-5 font-semibold text-sm text-gray-300">Overall Match</div>
                <FiInfo className="absolute top-4 right-5 text-gray-500" />
                
                <div className="relative w-48 h-28 mt-8 flex justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 100">
                    <path d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
                    <path 
                      d="M 20 90 A 70 70 0 0 1 180 90" 
                      fill="none" 
                      stroke="url(#gradient)" 
                      strokeWidth="16" 
                      strokeLinecap="round" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * (analysisResults.atsScore / 100))} 
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2dd4bf" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-0 flex flex-col items-center">
                    <span className="text-4xl font-bold text-white tracking-tight">{analysisResults.atsScore}<span className="text-lg text-gray-500 font-normal">%</span></span>
                    <span className="text-sm text-teal-400 font-medium mt-1 bg-teal-900/30 px-3 py-0.5 rounded-full">{analysisResults.scoreLabel}</span>
                  </div>
                </div>
              </div>

              {/* Feedback Lists */}
              <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                <div className="bg-[#0f172a] p-5 rounded-2xl border border-gray-700/50 flex-1">
                  <h3 className="font-semibold text-sm mb-3 text-gray-200">Strengths</h3>
                  <ul className="space-y-2">
                    {analysisResults.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" /> {str}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#0f172a] p-5 rounded-2xl border border-gray-700/50 flex-1">
                  <h3 className="font-semibold text-sm mb-3 text-gray-200">Areas to Improve</h3>
                  <ul className="space-y-2">
                    {analysisResults.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <FiXCircle className="text-red-400 mt-0.5 shrink-0" /> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Keyword Analysis (JD Match) Section */}
            <div className="bg-[#0f172a] rounded-2xl border border-gray-700/50 p-6 mb-8 shadow-lg">
              <h3 className="font-semibold text-sm mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                <FiTarget className="text-blue-400" /> Keyword Gap Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Present in Resume</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.jdMatch.matchedKeywords.map((kw, i) => (
                      <span key={i} className="bg-emerald-900/20 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm">
                        <FiCheckCircle size={12} /> {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Missing from Resume</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.jdMatch.missingKeywords.map((kw, i) => (
                      <span key={i} className="bg-red-900/10 text-red-400 border border-red-900/30 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm">
                        <FiXCircle size={12} /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Competency Breakdown */}
            <div className="bg-[#0f172a] rounded-2xl border border-gray-700/50 p-6 mb-8 shadow-lg">
              <h3 className="font-semibold text-sm mb-6 border-b border-gray-800 pb-3 text-gray-200">Competency Breakdown</h3>
              <div className="space-y-5">
                {analysisResults.skillMatches.map((skill, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-40 text-sm text-gray-400 font-medium">{skill.label}</span>
                    <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className={`${skill.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${skill.percent}%` }}></div>
                    </div>
                    <span className="w-10 text-right text-sm text-white font-bold">{skill.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button className="flex-[3] bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg">
                <FiMessageSquare size={18} />
                Generate Tailored Interview Questions
              </button>
              
              <button className="flex-[2] bg-[#1e293b] border border-gray-600 hover:bg-gray-700 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <FiEdit3 size={18} className="text-teal-400" />
                Open AI Resume Builder
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Global Component Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AIResumeAnalyzer;