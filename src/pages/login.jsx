import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiMail,
  FiTarget,
  FiBarChart2,
  FiCompass,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

const highlights = [
  { icon: FiTarget, title: "Company Specific Preparation" },
  { icon: FiBarChart2, title: "Mock Tests & Performance Analysis" },
  { icon: FiCompass, title: "Personalized Learning Recommendations" },
];

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!identifier.trim() || !password) {
      setNotice("Enter your email or phone number and your password.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await loginUser(identifier, password);
      
      if (data && data.role) {
        localStorage.setItem("userRole", data.role.toUpperCase());
      } else {
        localStorage.setItem("userRole", "ADMIN");
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setNotice(error.message || "Login failed. Check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setNotice(
      "Password reset needs an email service or backend. For this frontend demo, create a new account instead.",
      "info"
    );
  };

  const inputClass =
    "peer h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/15";
  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition peer-focus:text-teal-600";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left: brand panel */}
      <section className="relative hidden w-[52%] overflow-hidden bg-[#0A1B2E] lg:flex flex-col">
        {/* Background Image: object-top keeps the upper sky visible and pushes the peak lower */}
        <img
          src="/Mountain.png" 
          alt="Mountain Sunrise"
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        {/* Soft gradient to keep the bottom-left text crisp while preserving the sunrise */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between px-10 pb-10 pt-2 xl:px-14 xl:pb-14 xl:pt-3">
          
          {/* Logo: High up at the top of the sky above the mountain peak */}
          <div className="flex w-full justify-center">
            <img
              src="/logo.png"
              alt="CareerPilot"
              className="h-24 xl:h-28 w-auto object-contain drop-shadow-2xl"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          {/* Highlights: Top 3 features tucked cleanly in Bottom Left */}
          <div className="pb-4">
            <ul className="max-w-md space-y-3.5">
              {highlights.map(({ icon: Icon, title }) => (
                <li key={title} className="flex items-center gap-3.5">
                  {/* Hazy frosted teal circle */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-teal-300/25 bg-teal-900/50 text-teal-100 backdrop-blur-md shadow-lg">
                    <Icon size={18} />
                  </span>
                  <p className="text-sm xl:text-base font-medium text-white/95 drop-shadow-md tracking-wide">
                    {title}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Right: form */}
      <section className="flex flex-1 items-center justify-center bg-slate-50 px-5 py-10 sm:px-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-10">
          <div className="mb-8">
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white lg:hidden">
              <FiCompass size={20} />
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">Log in to pick up where you left off.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="identifier" className="mb-2 block text-sm font-medium text-slate-700">
                Email or phone number
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
                <FiMail className={iconClass} size={17} />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-teal-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                />
                <FiLock className={iconClass} size={17} />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-teal-700"
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            {message && (
              <div
                role="alert"
                aria-live="polite"
                className={`flex gap-2 rounded-xl border px-3.5 py-3 text-sm ${
                  messageType === "info"
                    ? "border-sky-200 bg-sky-50 text-sky-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Logging in…" : "Log in"}
              {!isLoading && <FiArrowRight className="transition group-hover:translate-x-0.5" size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New to CareerPilot?
            <Link to="/signup" className="ml-1 font-semibold text-teal-700 hover:underline">
              Create an account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Frontend demo: accounts are saved only in this browser. Connect Spring Boot before using real student accounts.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;