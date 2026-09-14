import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCompass,
  FiMap,
  FiBookOpen,
} from "react-icons/fi"


function Login() {

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f1e9] flex items-center justify-center p-4">

      {/* ================= MAIN CARD ================= */}

      <div className="w-full max-w-6xl min-h-[720px] rounded-2xl overflow-hidden shadow-xl flex bg-white">


        {/* ================= LEFT SIDE ================= */}

        <div className="w-1/2 min-h-[720px] relative overflow-hidden">

          {/* Mountain Background */}

          <img
            src="/Mountain.png"
            alt="Mountain landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />


          {/* Dark Overlay */}

          <div className="absolute inset-0 bg-black/20"></div>


          {/* ================= LOGO ================= */}

          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">

            <img
              src="/logo.png"
              alt="CareerPilot Logo"
              className="w-56 h-auto"
            />

          </div>


          {/* ================= FEATURES ================= */}

          <div className="absolute bottom-10 left-8 z-20 space-y-4 text-white">


            {/* Feature 1 */}

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-[#0b5575]/80 border border-white/30 flex items-center justify-center">

                <FiCompass size={18} />

              </div>

              <p className="text-sm font-medium">
                Company Specific Preparation
              </p>

            </div>


            {/* Feature 2 */}

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-[#0b5575]/80 border border-white/30 flex items-center justify-center">

                <FiMap size={18} />

              </div>

              <p className="text-sm font-medium">
                Mock Tests & Performance Analysis
              </p>

            </div>


            {/* Feature 3 */}

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-[#0b5575]/80 border border-white/30 flex items-center justify-center">

                <FiBookOpen size={18} />

              </div>

              <p className="text-sm font-medium">
                Personalized Learning Recommendations
              </p>

            </div>

          </div>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <div className="w-1/2 min-h-[720px] relative bg-[#faf8f2] overflow-hidden">


          {/* Navigation Pattern */}

          <div className="absolute inset-0 navigation-pattern"></div>


          {/* ================= LOGIN FORM ================= */}

          <div className="relative z-10 min-h-[720px] flex items-center justify-center px-10 py-10">

            <div className="w-full max-w-md">


              {/* ================= HEADING ================= */}

              <div className="text-center mb-8">

                <h1 className="text-3xl font-bold text-[#0b2440]">
                  Welcome Back!
                </h1>

                <p className="mt-2 text-sm text-[#526174]">
                  Login to continue your placement journey
                </p>

              </div>


              {/* ================= EMAIL ================= */}

              <div className="mb-5">

                <label className="block text-sm font-semibold text-[#26384d] mb-2">
                  Email / Phone
                </label>

                <div className="relative">

                  <FiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]"
                    size={17}
                  />

                  <input
                    type="text"
                    placeholder="Enter your email or phone number"
                    className="w-full h-12 rounded-lg border border-[#d6dce2] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#0b3b60] focus:ring-2 focus:ring-[#0b3b60]/10"
                  />

                </div>

              </div>


              {/* ================= PASSWORD ================= */}

              <div className="mb-2">

                <label className="block text-sm font-semibold text-[#26384d] mb-2">
                  Password
                </label>

                <div className="relative">


                  {/* Lock Icon */}

                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]"
                    size={17}
                  />


                  {/* Password Input */}

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-12 rounded-lg border border-[#d6dce2] bg-white pl-11 pr-11 text-sm outline-none focus:border-[#0b3b60] focus:ring-2 focus:ring-[#0b3b60]/10"
                  />


                  {/* Show / Hide Password */}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#536579] hover:text-[#0b3b60] cursor-pointer"
                  >

                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}

                  </button>

                </div>

              </div>


              {/* ================= FORGOT PASSWORD ================= */}

              <div className="flex justify-end mb-6">

                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>

              </div>


              {/* ================= LOGIN BUTTON ================= */}

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full h-12 rounded-lg bg-[#062f50] text-white font-semibold hover:bg-[#041f36] transition flex items-center justify-center gap-2"
              >

                <span>
                  Login
                </span>

                <span className="text-lg">
                  →
                </span>

              </button>


              {/* ================= SIGN UP ================= */}

              <p className="text-center text-sm text-gray-500 mt-10">

                Don't have an account?

                <button
                  type="button"
                  className="ml-1 font-semibold text-blue-600 hover:underline"
                >
                  Sign up
                </button>

              </p>


            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login