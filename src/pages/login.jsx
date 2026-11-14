import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCompass,
  FiMap,
  FiBookOpen,
  FiMail,
} from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);

  const setNotice = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  // Handle Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!identifier.trim() || !password) {
      setNotice("Please enter your email/phone and password.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Capture the response data from your auth service
      const data = await loginUser(identifier, password);
      
      // 2. Save the role dynamically for the Admin Panel routing
      // If the backend doesn't return a role yet, default to "USER"
      if (data && data.role) {
        localStorage.setItem("userRole", data.role.toUpperCase());
      } else {
        localStorage.setItem("userRole", "ADMIN");
      }

      // 3. Redirect to dashboard on success
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setNotice(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password
  const handleForgotPassword = () => {
    setNotice(
      "Password reset needs an email service or backend. For this frontend demo, create a new account if needed.",
      "info"
    );
  };

  const inputClass =
    "h-12 w-full rounded-lg border border-[#d6dce2] bg-white pl-11 pr-4 text-sm text-[#26384d] outline-none transition placeholder:text-[#9aa6b2] focus:border-[#0b3b60] focus:ring-2 focus:ring-[#0b3b60]/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#26384d]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1e9] p-3 sm:p-5">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl lg:min-h-[720px] lg:flex-row">

        {/* Left Visual Panel */}
        <section className="relative min-h-[260px] overflow-hidden sm:min-h-[320px] lg:min-h-[720px] lg:w-1/2">
          <img
            src="/Mountain.png"
            alt="Mountain landscape"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-[#061f32]/85" />

          <div className="absolute left-1/2 top-7 z-10 w-full -translate-x-1/2 text-center sm:top-10">
            <img
              src="/logo.png"
              alt="CareerPilot"
              className="mx-auto h-auto w-40 sm:w-52"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <p className="mt-2 text-xs font-medium tracking-[0.2em] text-white/90 sm:text-sm">
              NAVIGATE YOUR CAREER
            </p>
          </div>

          <div className="absolute bottom-6 left-6 z-10 hidden space-y-4 text-white sm:block sm:bottom-9 sm:left-9">

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0b5575]/80">
                <FiCompass size={18} />
              </span>
              <p className="text-sm font-medium">
                Company Specific Preparation
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0b5575]/80">
                <FiMap size={18} />
              </span>
              <p className="text-sm font-medium">
                Mock Tests &amp; Performance Analysis
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0b5575]/80">
                <FiBookOpen size={18} />
              </span>
              <p className="text-sm font-medium">
                Personalized Learning Recommendations
              </p>
            </div>

          </div>
        </section>

        {/* Right Form Panel */}
        <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#faf8f2] px-5 py-9 sm:px-10 lg:w-1/2 lg:px-12">

          <div className="navigation-pattern absolute inset-0" />

          <div className="relative z-10 w-full max-w-md">

            <header className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#062f50] text-white shadow-md">
                <FiCompass size={22} />
              </div>

              <h1 className="text-3xl font-bold text-[#0b2440]">
                Welcome Back!
              </h1>

              <p className="mt-2 text-sm text-[#526174]">
                Login to continue your placement journey
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate>

              {/* Email / Phone */}
              <div className="mb-5">
                <label htmlFor="identifier" className={labelClass}>
                  Email / Phone
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]" size={17} />

                  <input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Enter your email or phone number"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]" size={17} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#536579] hover:text-[#0b3b60]"
                  >
                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Messages */}
              {message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`mb-5 rounded-lg border px-3 py-3 text-sm ${
                    messageType === "info"
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#062f50] font-semibold text-white transition hover:bg-[#041f36] focus:outline-none focus:ring-2 focus:ring-[#0b3b60] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {isLoading ? "Logging in..." : "Login"}
                </span>

                <span className="text-lg" aria-hidden="true">
                  →
                </span>
              </button>

            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?

              <Link
                to="/signin"
                className="ml-1 font-semibold text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-[#7b8794]">
              Frontend demo: accounts are saved only in this browser.
              Connect Spring Boot before using real student accounts.
            </p>

          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;