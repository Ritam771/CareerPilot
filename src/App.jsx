import { BrowserRouter, Routes, Route} from "react-router-dom" 

import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import Aptitude from "./pages/Aptitude"
import Reasoning from "./pages/Reasoning"
import Technical from "./pages/Technical"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aptitude" element={<Aptitude />} />
        <Route path="/reasoning" element={<Reasoning />} />
        <Route path="/technical" element={<Technical />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App