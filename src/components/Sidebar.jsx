import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth";
import { useTheme } from "../context/ThemeContext";
import Avatar from "./Avatar"; // Imported the new Avatar component

import {
  FiCompass,
  FiMap,
  FiUser,
  FiBookOpen,
  FiHelpCircle,
  FiCode,
  FiBriefcase,
  FiClipboard,
  FiBarChart2,
  FiBookmark,
  FiLogOut,
  FiFileText, 
  FiShield, 
} from "react-icons/fi";

const Sidebar = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Retrieve the role dynamically from local storage
  const userRole = localStorage.getItem("userRole") || "USER";

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  // Navigation styling
  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
      isActive
        ? "bg-blue-900 text-white"
        : darkMode
        ? "text-gray-300 hover:bg-gray-700"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div
      className={`w-48 min-h-screen px-3 py-5 transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } border-r`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-6">
        <FiCompass
          className={`text-xl ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
        />

        <h1
          className={`text-sm font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          CAREERPILOT
        </h1>
      </div>

      {/* Navigation */}
      <ul className="space-y-1">

        {/* Dashboard */}
        <li>
          <NavLink to="/dashboard" className={navLinkStyles}>
            <FiCompass />
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Profile */}
        <li>
          <NavLink to="/profile" className={navLinkStyles}>
            <FiUser />
            <span>Profile</span>
          </NavLink>
        </li>

        {/* Aptitude */}
        <li>
          <NavLink to="/aptitude" className={navLinkStyles}>
            <FiBookOpen />
            <span>Aptitude</span>
          </NavLink>
        </li>

        {/* Reasoning */}
        <li>
          <NavLink to="/reasoning" className={navLinkStyles}>
            <FiHelpCircle />
            <span>Reasoning</span>
          </NavLink>
        </li>

        {/* Technical */}
        <li>
          <NavLink to="/technical" className={navLinkStyles}>
            <FiCode />
            <span>Technical</span>
          </NavLink>
        </li>

        {/* Coding */}
        <li>
          <NavLink to="/coding" className={navLinkStyles}>
            <FiCode />
            <span>Coding</span>
          </NavLink>
        </li>

        {/* Company Prep */}
        <li>
          <NavLink to="/company-prep" className={navLinkStyles}>
            <FiBriefcase />
            <span>Company Prep</span>
          </NavLink>
        </li>

        {/* AI Resume Analyzer */}
        <li>
          <NavLink to="/ai-resume-analyzer" className={navLinkStyles}>
            <FiFileText
              className={
                darkMode ? "text-teal-400" : "text-teal-600"
              }
            />
            <span>AI Resume Analyzer</span>
          </NavLink>
        </li>

        {/* Mock Tests */}
        <li>
          <NavLink to="/mock-tests" className={navLinkStyles}>
            <FiClipboard />
            <span>Mock Tests</span>
          </NavLink>
        </li>

        {/* Progress */}
        <li>
          <NavLink to="/progress" className={navLinkStyles}>
            <FiBarChart2 />
            <span>Progress</span>
          </NavLink>
        </li>

        {/* Bookmarks */}
        <li>
          <NavLink to="/bookmarks" className={navLinkStyles}>
            <FiBookmark />
            <span>Bookmarks</span>
          </NavLink>
        </li>

        {/* Roadmap */}
        <li>
          <NavLink to="/roadmap" className={navLinkStyles}>
            <FiMap />
            <span>Roadmap</span>
          </NavLink>
        </li>
      </ul>

      {/* Bottom Navigation */}
      <div
        className={`border-t mt-5 pt-3 flex flex-col gap-2 ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {/* User Mini-Profile with Adventurer Avatar */}
        <div className="flex items-center gap-3 px-3 mb-2 mt-2">
          <Avatar seed="Ritam Majumdar" size="w-9 h-9" />
          <div className="flex flex-col">
            <span className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
              Ritam Majumdar
            </span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
              {userRole}
            </span>
          </div>
        </div>

        {/* DYNAMIC ADMIN LINK: Only renders if userRole is "ADMIN" */}
        {userRole === "ADMIN" && (
          <div>
            <NavLink to="/admin" className={navLinkStyles}>
              <FiShield className={darkMode ? "text-purple-400" : "text-purple-600"} />
              <span className="font-bold">Admin Portal</span>
            </NavLink>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-red-400 hover:bg-red-950"
              : "text-red-500 hover:bg-red-50"
          }`}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;