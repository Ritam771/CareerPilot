import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUploadCloud, FiMic, FiMicOff, FiVideo, FiVideoOff, 
  FiMonitor, FiLogOut, FiFileText
} from 'react-icons/fi';

const AIInterview = () => {
  // --- STATE FOR BACKEND INTEGRATION ---
  const [resumeFile, setResumeFile] = useState(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [transcript, setTranscript] = useState([
    { sender: 'AI', text: "Welcome! I've reviewed your resume. Let's dive into your experience. Can you explain how you handled state management in your last project?" }
  ]);
  
  // --- MEDIA STATE ---
  const [mediaStream, setMediaStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  const userVideoRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll transcript to bottom when new messages arrive
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  // Handle Camera/Mic initialization when interview starts
  useEffect(() => {
    if (isInterviewActive) {
      const startMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setMediaStream(stream);
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
          // TODO (Backend): Initialize WebSocket connection here to start streaming audio to your AI
          // e.g., const ws = new WebSocket('ws://your-backend/ai-interview');
        } catch (err) {
          console.error("Error accessing media devices:", err);
          alert("Please allow camera and microphone access to start the interview.");
        }
      };
      startMedia();
    } else {
      // Cleanup media tracks when interview ends
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
    
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInterviewActive]);

  // --- HANDLERS ---

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const startInterview = async () => {
    if (!resumeFile) return;
    
    // TODO (Backend): Send `resumeFile` to your server here to initialize the AI context
    // const formData = new FormData();
    // formData.append('resume', resumeFile);
    // await axios.post('/api/upload-resume', formData);
    
    setIsInterviewActive(true);
  };

  const toggleMic = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
        // TODO (Backend): If WebSocket is open, you might want to pause sending audio chunks here
      }
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const endInterview = () => {
    if(window.confirm("Are you sure you want to end the interview?")) {
      setIsInterviewActive(false);
      setResumeFile(null);
      setTranscript([{ sender: 'AI', text: "Welcome! I've reviewed your resume..." }]); // reset
      // TODO (Backend): Send API call to end session, generate report, and close WebSockets
    }
  };


  // ==========================================
  // UI: PHASE 1 - RESUME UPLOAD
  // ==========================================
  if (!isInterviewActive) {
    return (
      <div className="flex h-screen bg-[#0f172a] text-white p-6 justify-center items-center font-sans overflow-y-auto w-full">
        <div className="max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-2">Setup Your AI Mock Interview</h1>
          <p className="text-gray-400 mb-8">
            Upload your resume so our AI Recruiter can tailor the technical questions to your specific experience and tech stack.
          </p>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`bg-[#1e293b] border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
              resumeFile ? 'border-teal-500 bg-teal-900/10' : 'border-gray-600 hover:border-teal-400 hover:bg-[#233147]'
            }`}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
            
            {resumeFile ? (
              <div className="flex flex-col items-center">
                <FiFileText className="text-6xl text-teal-400 mb-4" />
                <h3 className="text-xl font-semibold text-teal-300 mb-1">{resumeFile.name}</h3>
                <p className="text-gray-400 text-sm">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className="text-teal-500 text-sm mt-4 font-medium hover:underline">Click to change file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FiUploadCloud className="text-6xl text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Drag & Drop or Click to Upload</h3>
                <p className="text-gray-500 text-sm">Supported formats: PDF, DOCX (Max 5MB)</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              disabled={!resumeFile}
              onClick={startInterview}
              className={`px-8 py-3 rounded-lg text-lg font-bold transition-colors ${
                resumeFile 
                  ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI: PHASE 2 - ACTIVE INTERVIEW
  // ==========================================
  return (
    <div className="flex h-screen bg-[#0f172a] text-white p-6 font-sans flex-col w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">Technical Interview - Software Engineer</h1>
          <div className="flex items-center gap-6 mt-1">
            <span className="text-teal-400 text-sm border-b-2 border-teal-400 pb-1">Interview Session</span>
            <span className="text-gray-500 text-sm pb-1">Current Feed</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-950 text-red-400 px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-red-900/50">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            REC
          </div>
          <div className="text-gray-400 text-sm font-mono">14:32</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex gap-4 mb-4 min-h-0">
        
        {/* Left: AI Avatar (Main Screen) */}
        <div className="flex-[2] bg-[#1e293b] rounded-xl border border-gray-700 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
           
           {/* Abstract glowing background effect */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-[#1e293b] to-[#1e293b]"></div>

           {/* AI Avatar */}
           <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-48 h-48 bg-gradient-to-br from-teal-400/20 to-blue-600/20 rounded-full flex items-center justify-center border border-teal-500/30 shadow-[0_0_50px_rgba(20,184,166,0.15)] relative">
                {/* Simulated sound waves wrapper */}
                <div className="absolute inset-0 rounded-full border border-teal-400/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-[-20px] rounded-full border border-teal-400/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                
                {/* Robot/AI Icon (Using text as placeholder, replace with SVG if desired) */}
                <span className="text-6xl">🤖</span>
              </div>
           </div>
           
           {/* Current AI Speech Subtitle */}
           {/* TODO (Backend): Map this to the latest transcript message where sender === 'AI' */}
           <div className="absolute bottom-6 w-full px-12 flex justify-center z-10">
             <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 inline-block px-6 py-3 rounded-lg text-center shadow-xl max-w-2xl">
               <span className="text-teal-400 font-bold mr-2">Alex (AI Recruiter):</span>
               <span className="text-gray-200">
                 {transcript.filter(m => m.sender === 'AI').pop()?.text || "..."}
               </span>
             </div>
           </div>
        </div>

        {/* Right Sidebar: Camera & Transcript */}
        <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
          
          {/* User Camera */}
          <div className="h-1/3 bg-black rounded-xl border border-gray-700 relative overflow-hidden flex items-center justify-center">
            {isVideoOn ? (
               <video 
                  ref={userVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }} // Mirror the local video
               />
            ) : (
               <div className="flex flex-col items-center text-gray-500">
                 <FiVideoOff size={32} className="mb-2" />
                 <span>Camera Disabled</span>
               </div>
            )}
            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs flex items-center gap-2">
              <FiVideo className="text-gray-300" />
            </div>
          </div>

          {/* Transcript Box */}
          <div className="flex-1 bg-[#1e293b] rounded-xl border border-gray-700 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-[#233147]">
              <h3 className="font-semibold text-sm">Live Transcript</h3>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">Recent</span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {transcript.map((msg, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.sender === 'AI' ? 'bg-teal-900/50 text-teal-400' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {msg.sender === 'AI' ? 'AI' : 'You'}
                  </div>
                  <div className="pt-1">
                    <p className={`text-sm ${msg.sender === 'AI' ? 'text-gray-300' : 'text-gray-400'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-[#1e293b] py-4 rounded-xl border border-gray-700 flex justify-center items-center gap-4">
        
        {/* Toggle Mic */}
        <button 
          onClick={toggleMic}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors border ${
            isMicOn ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-white' : 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20'
          }`}
        >
          {isMicOn ? <FiMic size={18} /> : <FiMicOff size={18} />}
          <span className="text-sm font-medium">Mic</span>
        </button>

        {/* Toggle Video */}
        <button 
          onClick={toggleVideo}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors border ${
            isVideoOn ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-white' : 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20'
          }`}
        >
          {isVideoOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
          <span className="text-sm font-medium">Camera</span>
        </button>

        {/* Screen Share (Visual Placeholder) */}
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white transition-colors">
          <FiMonitor size={18} />
          <span className="text-sm font-medium">Share Screen</span>
        </button>

        {/* End Interview */}
        <button 
          onClick={endInterview}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium ml-8 transition-colors shadow-lg shadow-red-600/20"
        >
          <FiLogOut size={18} />
          <span>End Interview</span>
        </button>
      </div>

    </div>
  );
};

export default AIInterview;