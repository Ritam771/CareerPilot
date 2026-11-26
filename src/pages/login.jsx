
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

      const roleList = Array.isArray(data?.roles)
        ? data.roles.map((r) => String(r).toUpperCase())
        : data?.role
          ? [String(data.role).toUpperCase()]
          : ["ROLE_USER"];

      const primaryRole =
        roleList.includes("ROLE_ADMIN") || roleList.includes("ADMIN")
          ? "ROLE_ADMIN"
          : roleList[0] || "ROLE_USER";

      localStorage.setItem("userRole", primaryRole);

      navigate("/dashboard", { replace: true });

    } catch (error) {
      setNotice(error.message || "Login failed. Please try again.");

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

  // Transparent glass input styling
  const inputClass =
    "peer h-12 w-full rounded-xl border border-white/25 bg-white/10 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl transition placeholder:text-white/55 hover:border-white/50 focus:border-teal-300 focus:bg-white/15 focus:ring-4 focus:ring-teal-300/15";

  const iconClass =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/65 transition peer-focus:text-teal-200";

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#07182a]">

      {/* Full-page mountain background */}
      <img
        src="/Mountain.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overall dark transparent overlay */}
      <div className="absolute inset-0 bg-slate-950/35" />

      {/* LEFT SIDE */}
      <section className="relative hidden w-[52%] flex-col overflow-hidden lg:flex">

        {/* Left-side background overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between px-10 pb-10 pt-2 xl:px-14 xl:pb-14 xl:pt-3">

          {/* Logo */}
          <div className="flex w-full justify-center">
            <img
              src="/logo.png"
              alt="CareerPilot"
              className="h-24 w-auto object-contain drop-shadow-2xl xl:h-28"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>

          {/* Highlights */}
          <div className="pb-4">
            <ul className="max-w-md space-y-3.5">
              {highlights.map(({ icon: Icon, title }) => (
                <li
                  key={title}
                  className="flex items-center gap-3.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-teal-300/30 bg-teal-900/40 text-teal-100 shadow-lg backdrop-blur-xl">
                    <Icon size={18} />
                  </span>

                  <p className="text-sm font-medium tracking-wide text-white/95 drop-shadow-md xl:text-base">
                    {title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE - TRANSPARENT BACKGROUND */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-white/[0.03] px-5 py-10 sm:px-10">

        {/* Subtle glass lighting effects */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-16 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* GLASS LOGIN CARD */}
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/25 bg-slate-900/25 p-7 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-10">

          <div className="mb-8">

            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-teal-200 backdrop-blur-xl lg:hidden">
              <FiCompass size={20} />
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Log in to pick up where you left off.
            </p>

          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* EMAIL */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-white/90"
              >
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

            {/* PASSWORD */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/90"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-teal-200 hover:text-teal-100 hover:underline"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/65 transition hover:text-teal-200"
                >
                  {showPassword ? (
                    <FiEyeOff size={17} />
                  ) : (
                    <FiEye size={17} />
                  )}
                </button>

              </div>
            </div>

            {/* ERROR / INFO MESSAGE */}
            {message && (
              <div
                role="alert"
                aria-live="polite"
                className={`flex gap-2 rounded-xl border px-3.5 py-3 text-sm backdrop-blur-xl ${
                  messageType === "info"
                    ? "border-sky-300/50 bg-sky-400/15 text-sky-100"
                    : "border-red-300/50 bg-red-400/15 text-red-100"
                }`}
              >
                <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{message}</span>
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-teal-300/30 bg-teal-600/85 font-semibold text-white shadow-lg shadow-teal-900/30 backdrop-blur-xl transition hover:bg-teal-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Logging in…" : "Log in"}

              {!isLoading && (
                <FiArrowRight
                  className="transition group-hover:translate-x-0.5"
                  size={18}
                />
              )}
            </button>

          </form>

          {/* SIGNUP */}
          <p className="mt-8 text-center text-sm text-white/80">
            New to CareerPilot?

            <Link
              to="/signup"
              className="ml-1 font-semibold text-teal-200 hover:text-teal-100 hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs leading-5 text-white/60">
            Frontend demo: accounts are saved only in this browser.
            Connect Spring Boot before using real student accounts.
          </p>

        </div>
      </section>
    </div>
  );
}

export default Login;
