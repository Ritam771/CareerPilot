import React, { useState, useRef } from 'react';
import { 
  FiUploadCloud, FiFileText, FiCheckCircle, 
  FiXCircle, FiMessageSquare, FiEdit3, FiInfo, FiTarget
} from 'react-icons/fi';

const AIResumeAnalyzer = () => {
  // --- STATE FOR BACKEND INTEGRATION ---
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const fileInputRef = useRef(null);

  // --- MOCK DATA (To be replaced by Backend AI Response) ---
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

  const startAnalysis = () => {
    if (!resumeFile) return;
    setIsAnalyzing(true);
    setScanProgress(0);

    // TODO (Backend): Send `resumeFile` AND `jobDescription` to your server
    // const formData = new FormData();
    // formData.append('resume', resumeFile);
    // formData.append('jobDescription', jobDescription);
    // await axios.post('/api/analyze-resume', formData);
    
    // Simulating backend processing time
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

  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 gap-6 font-sans w-full overflow-hidden">
      
      {/* ================= LEFT COLUMN: UPLOAD & PARSED DETAILS ================= */}
      <div className="w-1/3 flex flex-col gap-6 shrink-0 h-full overflow-y-auto pb-6 pr-2 custom-scrollbar">
        
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Resume Analyser</h1>
          <p className="text-gray-400 text-sm">
            Optimize your resume for applicant tracking systems (ATS) and compare it against your target Job Description.
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6 flex flex-col relative overflow-hidden">
          
          {/* File Upload Box */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded border border-gray-600 transition-colors"
            >
              <FiUploadCloud size={16} />
              Upload Resume
            </button>
            <span className="text-sm text-gray-400 truncate max-w-[150px]">
              {resumeFile ? resumeFile.name : "No file selected"}
            </span>
          </div>

          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />

          {/* Job Description Textarea */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiTarget className="text-teal-400" />
              Target Job Description <span className="text-gray-500 text-xs font-normal">(Optional but recommended)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get a tailored JD match score and keyword analysis..."
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-teal-500 h-32 resize-none transition-colors placeholder-gray-600"
            />
          </div>

          {/* Document Graphic / Scanning Area (Only show if analyzing or no results yet) */}
          {!analysisResults && (
            <div className="relative w-full aspect-[4/3] bg-[#0f172a] rounded-lg border border-gray-800 flex items-center justify-center mb-6 overflow-hidden">
               <div className="w-2/3 h-4/5 bg-gray-800 rounded shadow-2xl p-4 flex flex-col gap-3 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-gray-600 mb-2"></div>
                  <div className="w-3/4 h-2 bg-gray-600 rounded"></div>
                  <div className="w-1/2 h-2 bg-gray-600 rounded"></div>
                  <div className="w-full h-2 bg-gray-700 rounded mt-4"></div>
                  <div className="w-5/6 h-2 bg-gray-700 rounded"></div>
                  <div className="w-full h-2 bg-gray-700 rounded mt-4"></div>
               </div>

               {isAnalyzing && (
                 <>
                   <div className="absolute top-0 left-0 w-full h-1 bg-teal-400 shadow-[0_0_15px_#2dd4bf] animate-[scan_2s_ease-in-out_infinite]" style={{ transformOrigin: 'top' }}></div>
                   <div className="absolute inset-0 bg-teal-900/20 animate-pulse"></div>
                 </>
               )}
            </div>
          )}

          {/* Action Button & Progress */}
          {!analysisResults && (
            <div className="text-center">
              {isAnalyzing ? (
                <div className="w-full">
                  <div className="flex justify-between text-xs text-teal-400 mb-2">
                    <span>Analysis in progress...</span>
                    <span>{scanProgress}% Completed</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full transition-all duration-200" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                </div>
              ) : (
                <button 
                  disabled={!resumeFile}
                  onClick={startAnalysis}
                  className={`w-full py-3 rounded-lg font-bold transition-colors ${
                    resumeFile ? 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Analyze Resume against JD
                </button>
              )}
            </div>
          )}

          {/* Parsed Details (Shows after analysis) */}
          {analysisResults && (
            <div className="border-t border-gray-700 pt-4 animate-fade-in">
              <h3 className="font-semibold text-sm mb-4 text-white">Key Parsed Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-32">Candidate Name:</span>
                  <span className="text-gray-300 font-medium">{analysisResults.candidateName}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Detected Skills:</span>
                  <span className="text-gray-300 font-medium">{analysisResults.detectedSkills}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Status:</span>
                  <span className="text-teal-400 font-medium">{analysisResults.status}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Targeted Role:</span>
                  <span className="text-gray-300 font-medium">{analysisResults.targetedRole}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setAnalysisResults(null)}
                className="mt-6 w-full py-2.5 rounded-lg text-sm font-medium border border-gray-600 hover:bg-gray-800 transition-colors"
              >
                Start New Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: REVIEW & SCORING ================= */}
      <div className="flex-1 flex flex-col h-full">
        {analysisResults ? (
          <div className="bg-[#1e293b] rounded-xl border border-gray-700 p-6 flex flex-col h-full overflow-y-auto animate-fade-in custom-scrollbar">
            
            <h2 className="text-xl font-bold mb-6">Review and Scoring</h2>

            {/* Top Row: Score & Feedback */}
            <div className="flex flex-col xl:flex-row gap-6 mb-8">
              
              {/* ATS Score Radial */}
              <div className="bg-[#0f172a] rounded-xl border border-gray-800 p-6 flex-1 flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-4 font-semibold text-sm">Overall JD Match</div>
                <FiInfo className="absolute top-4 right-4 text-gray-500" />
                
                {/* SVG Semi-Circle Gauge */}
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
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-0 flex flex-col items-center">
                    <span className="text-4xl font-bold text-white">{analysisResults.atsScore}<span className="text-lg text-gray-500">%</span></span>
                    <span className="text-sm text-teal-400 font-medium mt-1">{analysisResults.scoreLabel}</span>
                  </div>
                </div>
              </div>

              {/* Feedback Lists */}
              <div className="flex-[2] flex flex-col gap-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3">Feedback & Strengths</h3>
                  <ul className="space-y-2">
                    {analysisResults.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <FiCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-3">Areas to Improve</h3>
                  <ul className="space-y-2">
                    {analysisResults.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <FiXCircle className="text-red-400 mt-0.5 shrink-0" />
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Keyword Analysis (JD Match) Section */}
            <div className="bg-[#0f172a] rounded-xl border border-gray-800 p-6 mb-8">
              <h3 className="font-semibold text-sm mb-4 border-b border-gray-800 pb-3">JD Keyword Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Keywords */}
                <div>
                  <p className="text-xs text-gray-400 mb-3">Matched Keywords Found in Resume</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.jdMatch.matchedKeywords.map((kw, i) => (
                      <span key={i} className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <FiCheckCircle size={10} /> {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div>
                  <p className="text-xs text-gray-400 mb-3">Missing Keywords from JD</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.jdMatch.missingKeywords.map((kw, i) => (
                      <span key={i} className="bg-red-900/20 text-red-400 border border-red-800/40 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <FiXCircle size={10} /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Match Progress Bars */}
            <div className="bg-[#0f172a] rounded-xl border border-gray-800 p-6 mb-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 className="font-semibold text-sm">Competency Breakdown</h3>
              </div>
              
              <div className="space-y-5">
                {analysisResults.skillMatches.map((skill, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-40 text-sm text-gray-400">{skill.label}</span>
                    <div className="flex-1 bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`${skill.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${skill.percent}%` }}></div>
                    </div>
                    <span className="w-10 text-right text-sm text-white font-medium">{skill.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="mt-auto flex gap-4 pt-4">
              <button className="flex-1 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-slate-900 font-bold py-4 rounded-xl flex items-center justify-between px-6 transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                <div className="flex items-center gap-3">
                  <FiMessageSquare size={20} />
                  <span>Generate JD-Tailored Interview Questions</span>
                </div>
                <span className="bg-slate-900/20 p-1 rounded-full">❯</span>
              </button>
              
              <button className="flex-1 bg-[#0f172a] border border-gray-700 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors">
                <FiEdit3 size={20} className="text-teal-400" />
                <span>Fix Missing Keywords in AI Builder</span>
              </button>
            </div>

          </div>
        ) : (
          /* Empty State Before Analysis */
          <div className="h-full border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 p-6 text-center bg-[#1e293b]/50">
            <FiFileText size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Awaiting Resume & Job Description</h3>
            <p className="max-w-sm text-sm">Upload your resume, paste a target job description, and click analyze to uncover your ATS match rate, missing keywords, and tailored feedback.</p>
          </div>
        )}
      </div>

      {/* Add Custom Keyframe styles inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        /* Hide scrollbar for a cleaner look but keep functionality */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default AIResumeAnalyzer;