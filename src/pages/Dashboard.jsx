import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

import {
  FiSun,
  FiMoon,
  FiSearch,
  FiBell,
} from 'react-icons/fi'


const Dashboard = () => {

  // Night mode state
  const [darkMode, setDarkMode] = useState(false)


  return (

    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >

      {/* ================= SIDEBAR ================= */}

      <Sidebar darkMode={darkMode} />


      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1">


        {/* ================= TOP HEADER ================= */}

        <header
          className={`h-20 px-6 flex items-center justify-between border-b transition-colors duration-300 ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >


          {/* ================= WELCOME MESSAGE ================= */}

          <div>

            <h1
              className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Welcome back, Ritam! 👋
            </h1>

            <p
              className={`text-xs mt-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Let's continue your placement preparation.
            </p>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center gap-4">


            {/* ================= SEARCH ================= */}

            <div className="relative hidden md:block">

              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />

              <input
                type="text"
                placeholder="Search anything..."
                className={`w-52 h-10 rounded-lg border pl-9 pr-3 text-xs outline-none transition ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500'
                    : 'bg-white border-gray-200 text-gray-700 focus:border-gray-400'
                }`}
              />

            </div>


            {/* ================= NIGHT MODE ================= */}

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                darkMode
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={
                darkMode
                  ? 'Switch to light mode'
                  : 'Switch to night mode'
              }
            >

              {darkMode ? (
                <FiSun size={18} />
              ) : (
                <FiMoon size={18} />
              )}

            </button>


            {/* ================= NOTIFICATION ================= */}

            <button
              type="button"
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >

              <FiBell size={19} />

              {/* Notification Dot */}

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>

            </button>


            {/* ================= ACCOUNT ================= */}

            <div className="flex items-center gap-3">


              {/* Profile Initials */}

              <div className="w-10 h-10 rounded-full bg-[#312e81] text-white flex items-center justify-center font-semibold text-sm">

                RM

              </div>


              {/* Account Information */}

              <div className="hidden sm:block">

                <p
                  className={`text-xs font-semibold ${
                    darkMode
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}
                >
                  Ritam Majumdar
                </p>

                <p
                  className={`text-[10px] mt-0.5 ${
                    darkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  MCA 3rd Sem
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* ================= DASHBOARD CONTENT ================= */}

        <div className="p-6">


          {/* ================= PAGE TITLE ================= */}

          <div className="mb-6">

            <h2
              className={`text-2xl font-bold ${
                darkMode
                  ? 'text-white'
                  : 'text-gray-800'
              }`}
            >
              Your Preparation
            </h2>

            <p
              className={`mt-1 text-sm ${
                darkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              Track your progress and keep improving.
            </p>

          </div>


          {/* ================= STAT CARDS ================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


            {/* ================= QUESTIONS SOLVED ================= */}

            <div
              className={`rounded-xl border p-5 shadow-sm ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >

              <p
                className={`text-sm ${
                  darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Questions Solved
              </p>

              <h3
                className={`text-2xl font-bold mt-2 ${
                  darkMode
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
              >
                128
              </h3>

            </div>


            {/* ================= ACCURACY ================= */}

            <div
              className={`rounded-xl border p-5 shadow-sm ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >

              <p
                className={`text-sm ${
                  darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Accuracy
              </p>

              <h3
                className={`text-2xl font-bold mt-2 ${
                  darkMode
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
              >
                85%
              </h3>

            </div>


            {/* ================= MOCK TESTS ================= */}

            <div
              className={`rounded-xl border p-5 shadow-sm ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >

              <p
                className={`text-sm ${
                  darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Mock Tests
              </p>

              <h3
                className={`text-2xl font-bold mt-2 ${
                  darkMode
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
              >
                5
              </h3>

            </div>


            {/* ================= STUDY TIME ================= */}

            <div
              className={`rounded-xl border p-5 shadow-sm ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >

              <p
                className={`text-sm ${
                  darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                Study Time
              </p>

              <h3
                className={`text-2xl font-bold mt-2 ${
                  darkMode
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
              >
                12 hrs
              </h3>

            </div>

          </div>


          {/* ================= OVERALL PREPARATION ================= */}

          <div
            className={`mt-6 rounded-xl border p-6 shadow-sm ${
              darkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >


            {/* ================= HEADING ================= */}

            <div className="flex items-center justify-between">

              <div>

                <h3
                  className={`text-lg font-semibold ${
                    darkMode
                      ? 'text-white'
                      : 'text-gray-800'
                  }`}
                >
                  Overall Preparation
                </h3>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  Track your overall placement preparation.
                </p>

              </div>


              {/* ================= PERCENTAGE ================= */}

              <div
                className={`text-2xl font-bold ${
                  darkMode
                    ? 'text-white'
                    : 'text-[#312e81]'
                }`}
              >
                72%
              </div>

            </div>


            {/* ================= PROGRESS BAR ================= */}

            <div className="mt-5">

              {/* Background of progress bar */}

              <div
                className={`w-full h-3 rounded-full ${
                  darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                }`}
              >

                {/* Actual progress */}

                <div
                  className="h-3 rounded-full bg-[#312e81]"
                  style={{ width: '72%' }}
                ></div>

              </div>

            </div>


            {/* ================= PROGRESS MESSAGE ================= */}

            <p
              className={`mt-3 text-sm ${
                darkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              You're making good progress. Keep practicing and
              improving your skills!
            </p>

          </div>


        </div>


      </main>

    </div>

  )
}


export default Dashboard