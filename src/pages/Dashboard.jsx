
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { getCurrentUser, logoutUser } from "../services/auth";
import { useTheme } from "../context/ThemeContext";

import {
  FiSun,
  FiMoon,
  FiSearch,
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();

  const { darkMode, toggleDarkMode } = useTheme();

  const [user, setUser] = useState(null);

  // Get currently logged-in user
  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/", { replace: true });
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  // Generate profile initials dynamically
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return null;
  }

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

          {/* Greeting */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {user.name || "User"}!
            </h1>

            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Here's what's happening with your account today.
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

              {/* Notification Indicator */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Settings */}
            <NavLink
              to="/settings"
              title="Settings"
              aria-label="Settings"
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
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun size={20} />
              ) : (
                <FiMoon size={20} />
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2">

              {/* Profile Initials */}
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {getInitials(user.name)}
              </div>

              {/* User Details */}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">
                  {user.name || "User"}
                </p>

                <p
                  className={`text-xs ${
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              <FiLogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        </header>

        {/* Dashboard Content */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Welcome Card */}
          <div className="p-6 rounded-2xl bg-indigo-600 text-white shadow">
            <p className="text-sm opacity-80">Welcome</p>

            <h2 className="text-2xl font-bold mt-2">
              {user.name || "User"}
            </h2>

            <p className="text-sm mt-2 opacity-80">
              Your dashboard is ready.
            </p>
          </div>

          {/* Account Status */}
          <div
            className={`p-6 rounded-2xl shadow ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-500">
              Account
            </p>

            <h2 className="text-xl font-bold mt-2">
              Active
            </h2>

            <p className="text-sm mt-2 text-gray-500">
              You are successfully logged in.
            </p>
          </div>

          {/* Email Address */}
          <div
            className={`p-6 rounded-2xl shadow ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-500">
              Email Address
            </p>

            <h2 className="text-lg font-bold mt-2 break-all">
              {user.email || "Not available"}
            </h2>

            <p className="text-sm mt-2 text-gray-500">
              Your registered email.
            </p>
          </div>

        </section>

      </main>
    </div>
  );
};

export default Dashboard;
