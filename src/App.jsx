import { BrowserRouter, Routes, Route} from "react-router-dom" 

import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import Aptitude from "./pages/Aptitude"
import Reasoning from "./pages/Reasoning"
import Technical from "./pages/Technical"
import Coding from "./pages/Coding"
import Companyprep from "./pages/Comapnyprep"

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
      </Routes>
    </BrowserRouter>
  )
}

export default App