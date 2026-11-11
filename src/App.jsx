
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Authentication
import Login from "./pages/login";
import Signin from "./pages/Signin";

// Services and Context
import { isAuthenticated } from "./services/auth";
import { ThemeProvider } from "./context/ThemeContext";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Aptitude from "./pages/Aptitude";
import Reasoning from "./pages/Reasoning";
import Technical from "./pages/Technical";
import Coding from "./pages/Coding";
import Companyprep from "./pages/Companyprep";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Additional CareerPilot Features
import MockTests from "./pages/MockTests";
import Performance from "./pages/Performance";
import AIResumeAnalyzer from "./pages/AIResumeAnalyzer";
import Bookmarks from "./pages/Bookmarks";
import Roadmap from "./pages/Roadmap";

// Protect pages that require authentication
const ProtectedRoute = ({ children }) => {
  useLocation();

  return isAuthenticated()
    ? children
    : <Navigate to="/" replace />;
};

// Redirect authenticated users away from login/signup
const PublicRoute = ({ children }) => {
  useLocation();

  return isAuthenticated()
    ? <Navigate to="/dashboard" replace />
    : children;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>

          {/* Authentication */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signin"
            element={
              <PublicRoute>
                <Signin />
              </PublicRoute>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Practice Modules */}
          <Route
            path="/aptitude"
            element={<ProtectedRoute><Aptitude /></ProtectedRoute>}
          />

          <Route
            path="/reasoning"
            element={<ProtectedRoute><Reasoning /></ProtectedRoute>}
          />

          <Route
            path="/technical"
            element={<ProtectedRoute><Technical /></ProtectedRoute>}
          />

          <Route
            path="/coding"
            element={<ProtectedRoute><Coding /></ProtectedRoute>}
          />

          <Route
            path="/company-prep"
            element={<ProtectedRoute><Companyprep /></ProtectedRoute>}
          />

          {/* User Pages */}
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />

          <Route
            path="/settings"
            element={<ProtectedRoute><Settings /></ProtectedRoute>}
          />

          {/* Additional CareerPilot Features */}
          <Route
            path="/mock-tests"
            element={<ProtectedRoute><MockTests /></ProtectedRoute>}
          />

          <Route
            path="/performance"
            element={<ProtectedRoute><Performance /></ProtectedRoute>}
          />

          <Route
            path="/ai-resume-analyzer"
            element={<ProtectedRoute><AIResumeAnalyzer /></ProtectedRoute>}
          />

          <Route
            path="/bookmarks"
            element={<ProtectedRoute><Bookmarks /></ProtectedRoute>}
          />

          <Route
            path="/roadmap"
            element={<ProtectedRoute><Roadmap /></ProtectedRoute>}
          />

          {/* Unknown Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
