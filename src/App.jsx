import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // verify exact folder & export style
import Signin from "./pages/Signin"
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Aptitude from "./pages/Aptitude";
import Reasoning from "./pages/Reasoning";
import Technical from "./pages/Technical";
import Coding from "./pages/Coding";
import Companyprep from "./pages/Companyprep";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import MockTests from "./pages/MockTests";
import AIResumeAnalyzer from "./pages/AIResumeAnalyzer";
import AdminPanel from "./pages/AdminPanel"; 
import Signin from "./pages/Signin"; 

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/aptitude" element={<Aptitude />} />
          <Route path="/reasoning" element={<Reasoning />} />
          <Route path="/technical" element={<Technical />} />
          <Route path="/coding" element={<Coding />} />
          <Route path="/company-prep" element={<Companyprep />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/mock-tests" element={<MockTests />} />
          <Route path="/ai-resume-analyzer" element={<AIResumeAnalyzer />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/signup" element={<Signin />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );

}

export default App;