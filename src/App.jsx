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
import Progress from "./pages/Progress";
import AIResumeAnalyzer from "./pages/AIResumeAnalyzer";
import Bookmarks from "./pages/Bookmarks";
import Roadmap from "./pages/Roadmap";
import PracticeSession from "./pages/PracticeSession";

// NEW IMPORT: Admin Panel
import AdminPanel from "./pages/AdminPanel";

// Protect pages that require authentication (Any logged-in user)
const ProtectedRoute = ({ children }) => {
  useLocation();

  return isAuthenticated()
    ? children
    : <Navigate to="/" replace />;
};

// Strict protection (Requires an ADMIN user specifically)
const AdminRoute = ({ children }) => {
  useLocation();
  const isAuth = isAuthenticated();
  
  // Retrieve the role stored during login
  const userRole = localStorage.getItem("userRole");

  // If not logged in, kick to login screen
  if (!isAuth) return <Navigate to="/" replace />;
  
  // If logged in but NOT an admin, kick to standard dashboard
  if (userRole !== "ADMIN") return <Navigate to="/dashboard" replace />;
  
  return children;
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
          
          {/* Master Practice Session */}
          <Route
            path="/practice"
            element={<ProtectedRoute><PracticeSession /></ProtectedRoute>}
          />

          {/* SECURE ADMIN ROUTE */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
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
            path="/progress"
            element={<ProtectedRoute><Progress /></ProtectedRoute>}
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