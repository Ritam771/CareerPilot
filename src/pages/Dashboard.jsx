import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";
import { getCurrentUser, logoutUser } from "../services/auth";
import { useTheme } from "../context/ThemeContext";

import {
  FiSun,
  FiMoon,
  FiSearch,
  FiBell,
  FiLogOut,
  FiSettings,
  FiAward,
  FiTrendingUp,
  FiBriefcase
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  
  // State for dynamic dashboard metrics
  const [profileStats, setProfileStats] = useState({
    course: "Not specified",
    skillsCount: 0,
    internshipsCount: 0,
  });

  // Get currently logged-in user and their profile stats
  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/", { replace: true });
      return;
    }

    setUser(currentUser);

    // Fetch dynamic stats from the local profile data
    try {
      const savedProfile = localStorage.getItem("careerPilotProfile");
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setProfileStats({
          course: data.currentCourse || "Not specified",
          skillsCount: data.skills ? data.skills.length : 0,
          internshipsCount: data.internships ? data.internships.length : 0,
        });
      }
    } catch (error) {
      console.error("Could not load profile stats", error);
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  // Dynamic time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!user) {
    return null;
  }

  const userRole = localStorage.getItem("userRole") || "USER";

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        darkMode
        ? "bg-gray-950 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar darkMode={darkMode} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">

          {/* Dynamic Greeting */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {getGreeting()}, {user.name || "User"}!
            </h1>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Here's your CareerPilot progress for today.
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <button
              type="button"
              className="p-3 rounded-xl hover:bg-gray-500/10"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiBell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Settings */}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-900"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <FiSettings size={19} />
            </NavLink>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-3 rounded-xl hover:bg-gray-500/10"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 ml-2">
              <Avatar 
                seed={user.name || "User"} 
                size="w-10 h-10" 
                className="border-2 border-indigo-500/50 shadow-sm" 
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold truncate max-w-[150px]">
                  {user.name || "User"}
                </p>
                <p
                  className={`text-xs truncate max-w-[150px] ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.email || ""}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 ml-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
            >
              <FiLogOut size={18} />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>

          </div>
        </header>

        {/* Dynamic Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Card 1: Identity & Role */}
          <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-200 mb-2">
                <FiAward size={18} />
                <span className="text-sm font-semibold tracking-wide uppercase">{userRole} ACCOUNT</span>
              </div>
              <h2 className="text-2xl font-bold mt-1 truncate">
                {user.name || "User"}
              </h2>
              <p className="text-sm mt-2 text-indigo-100">
                {profileStats.course}
              </p>
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          </div>

          {/* Card 2: Technical Skills */}
          <div
            className={`p-6 rounded-2xl shadow-md border flex flex-col justify-between ${
              darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <FiTrendingUp size={18} />
                <span className="text-sm font-semibold tracking-wide uppercase">Skill Stack</span>
              </div>
              <h2 className={`text-3xl font-bold mt-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {profileStats.skillsCount}
              </h2>
            </div>
            <p className={`text-sm mt-3 font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Registered technical skills
            </p>
          </div>

          {/* Card 3: Experience */}
          <div
            className={`p-6 rounded-2xl shadow-md border flex flex-col justify-between ${
              darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <FiBriefcase size={18} />
                <span className="text-sm font-semibold tracking-wide uppercase">Experience</span>
              </div>
              <h2 className={`text-3xl font-bold mt-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {profileStats.internshipsCount}
              </h2>
            </div>
            <p className={`text-sm mt-3 font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Internships added to profile
            </p>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Dashboard;