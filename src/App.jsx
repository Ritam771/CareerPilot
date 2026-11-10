import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

<<<<<<< HEAD
/* Authentication */
import Login from "./pages/Login";
import Signin from "./pages/Signin";

/* Services */
import { isAuthenticated } from "./services/auth";
import { ThemeProvider } from "./context/ThemeContext";

/* Main Pages */
import Dashboard from "./pages/Dashboard";
import Aptitude from "./pages/Aptitude";
import Reasoning from "./pages/Reasoning";
import Technical from "./pages/Technical";
import Coding from "./pages/Coding";
import Companyprep from "./pages/Companyprep";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Only logged-in users can open these pages.
// useLocation() makes the check run again on every navigation,
// so the dashboard opens right after login.
const ProtectedRoute = ({ children }) => {
  useLocation();
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

// Login / signup pages: logged-in users go straight to the dashboard.
const PublicRoute = ({ children }) => {
  useLocation();
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};
=======
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

>>>>>>> 6ecb1e16527ca8d674c684bcf2682f3d3539b9bd

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <Routes>
<<<<<<< HEAD
        {/* Authentication */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Practice Modules */}
        <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
        <Route path="/reasoning" element={<ProtectedRoute><Reasoning /></ProtectedRoute>} />
        <Route path="/technical" element={<ProtectedRoute><Technical /></ProtectedRoute>} />
        <Route path="/coding" element={<ProtectedRoute><Coding /></ProtectedRoute>} />
        <Route path="/company-prep" element={<ProtectedRoute><Companyprep /></ProtectedRoute>} />

        {/* User Settings */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
=======
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
>>>>>>> 6ecb1e16527ca8d674c684bcf2682f3d3539b9bd
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
