import { BrowserRouter, Routes, Route} from "react-router-dom" 

import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import Aptitude from "./pages/Aptitude"
import Reasoning from "./pages/Reasoning"
import Technical from "./pages/Technical"
import Coding from "./pages/Coding"
import Companyprep from "./pages/Comapnyprep"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import MockTests from "./pages/MockTests"
import Performance from "./pages/Performance"
import AIInterview from "./pages/AIInterview"
import Bookmarks from "./pages/Bookmarks"
import Roadmap from "./pages/Roadmap"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aptitude" element={<Aptitude />} />
        <Route path="/reasoning" element={<Reasoning />} />
        <Route path="/technical" element={<Technical />} />
        <Route path="/coding" element={<Coding />} />
        <Route path="/company-prep" element={<Companyprep />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/mock-tests" element={<MockTests/>} />
        <Route path="/performance" element={<Performance/>} />
        <Route path="/ai-interview" element={<AIInterview/>} />
        <Route path="/bookmarks" element={<Bookmarks/>} />
        <Route path="/roadmap" element={<Roadmap/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App