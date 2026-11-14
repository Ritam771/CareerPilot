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
  { icon: FiTarget, title: "Company-specific prep", text: "Practice the questions each recruiter actually asks." },
  { icon: FiBarChart2, title: "Mock tests with analysis", text: "See exactly which topics cost you marks." },
  { icon: FiCompass, title: "A plan that adapts", text: "Recommendations change as your scores improve." },
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
      await loginUser(identifier, password);
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
      <section className="relative hidden w-[52%] overflow-hidden bg-[#0A1B2E] lg:flex">
        <img
          src="/Mountain.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1B2E] via-[#0A1B2E]/70 to-[#0A1B2E]/30" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <img
            src="/logo.png"
            alt="CareerPilot"
            className="h-10 w-auto self-start"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          <div>
            <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
              Your next offer starts with today’s practice.
            </h2>

            <ul className="mt-10 max-w-md space-y-5">
              {highlights.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300 ring-1 ring-white/15 backdrop-blur">
                    <Icon size={19} />
                  </span>
                  <div>
                    <p className="font-medium text-white">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-300">{text}</p>
                  </div>
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
            <Link to="/signin" className="ml-1 font-semibold text-teal-700 hover:underline">
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
