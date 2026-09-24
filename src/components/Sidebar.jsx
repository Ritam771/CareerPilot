import React from "react"
import { NavLink } from "react-router-dom"

import {
  FiCompass,
  FiMap,
  FiUser,
  FiBookOpen,
  FiHelpCircle,
  FiCode,
  FiBriefcase,
  FiClipboard,
  FiSettings,
  FiBarChart2,
  FiBookmark,
  FiLogOut,
} from "react-icons/fi"


const Sidebar = ({ darkMode }) => {

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

        <li className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-900 text-white text-xs cursor-pointer">

          <FiCompass />

          <span>
            Dashboard
          </span>

        </li>


        {/* Profile */}

        <li
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiUser />

          <span>
            Profile
          </span>

        </li>


        {/* Aptitude */}

        <li>

          <NavLink
            to="/aptitude"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >

            <FiBookOpen />

            <span>
              Aptitude
            </span>

          </NavLink>

        </li>


        {/* Reasoning */}

        <li>

          <NavLink
            to="/reasoning"
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >

            <FiHelpCircle />

            <span>
              Reasoning
            </span>

          </NavLink>

        </li>


        {/* Technical */}

        <li
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiCode />

          <span>
            Technical
          </span>

        </li>


        {/* Company Prep */}

        <li
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiBriefcase />

          <span>
            Company Prep
          </span>

        </li>


        {/* Mock Tests */}

        <li
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiClipboard />

          <span>
            Mock Tests
          </span>

        </li>


        {/* Performance */}

        <li
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiBarChart2 />

          <span>
            Performance
          </span>

        </li>


        {/* Bookmarks */}

        <li
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiBookmark />

          <span>
            Bookmarks
          </span>

        </li>


        {/* Roadmap */}

        <li
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiMap />

          <span>
            Roadmap
          </span>

        </li>

      </ul>


      {/* Bottom Navigation */}

      <div
        className={`border-t mt-5 pt-3 ${
          darkMode
            ? "border-gray-700"
            : "border-gray-200"
        }`}
      >


        {/* Settings */}

        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >

          <FiSettings />

          <span>
            Settings
          </span>

        </div>


        {/* Logout */}

        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs cursor-pointer transition ${
            darkMode
              ? "text-red-400 hover:bg-red-950"
              : "text-red-500 hover:bg-red-50"
          }`}
        >

          <FiLogOut />

          <span>
            Logout
          </span>

        </div>

      </div>

    </div>

  )
}

export default Sidebar