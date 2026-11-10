import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser, FiLock, FiEye, FiEyeOff, FiMail, FiPhone,
  FiCompass, FiMap, FiBookOpen, FiUserPlus, FiCheckCircle,
} from "react-icons/fi";
import { registerUser } from "../services/auth";


const inputClass = "h-12 w-full rounded-lg border border-[#d6dce2] bg-white pl-11 pr-11 text-sm text-[#26384d] outline-none transition placeholder:text-[#9aa6b2] focus:border-[#0b3b60] focus:ring-2 focus:ring-[#0b3b60]/10";
const labelClass = "mb-2 block text-sm font-semibold text-[#26384d]";

function Signin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
  setError("Please enter a valid email address.");
  return;
}
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError("Use at least 8 characters, including uppercase, lowercase and a number.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms to create your account.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f1e9] p-3 sm:p-5">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl lg:min-h-[760px] lg:flex-row">
        <section className="relative min-h-[230px] overflow-hidden sm:min-h-[280px] lg:min-h-[760px] lg:w-1/2">
          <img src="/Mountain.png" alt="Mountain landscape" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-[#061f32]/85" />
          <div className="absolute left-1/2 top-7 z-10 w-full -translate-x-1/2 text-center sm:top-10">
            <img src="/logo.png" alt="CareerPilot" className="mx-auto h-auto w-40 sm:w-52" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <p className="mt-2 text-xs font-medium tracking-[0.2em] text-white/90 sm:text-sm">NAVIGATE YOUR CAREER</p>
          </div>
          <div className="absolute bottom-7 left-7 z-10 hidden space-y-4 text-white sm:block sm:bottom-9 sm:left-9">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0b5575]/80"><FiCompass size={18} /></span><p className="text-sm font-medium">Company Specific Preparation</p></div>
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0b5575]/80"><FiMap size={18} /></span><p className="text-sm font-medium">Mock Tests &amp; Performance Analysis</p></div>
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#0b5575]/80"><FiBookOpen size={18} /></span><p className="text-sm font-medium">Personalized Learning Recommendations</p></div>
          </div>
        </section>

        <section className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#faf8f2] px-5 py-8 sm:px-10 lg:w-1/2 lg:px-12">
          <div className="navigation-pattern absolute inset-0" />
          <div className="relative z-10 w-full max-w-md">
            <header className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#062f50] text-white shadow-md"><FiUserPlus size={22} /></div>
              <h1 className="text-3xl font-bold text-[#0b2440]">Create Account</h1>
              <p className="mt-2 text-sm text-[#526174]">Join CareerPilot and start your placement journey</p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="name" className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <div className="relative"><FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]" size={17} /><input id="name" name="name" type="text" autoComplete="name" value={form.name} onChange={updateField} placeholder="Enter your full name" className={inputClass} required maxLength={80} /></div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]" size={17} /><input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} placeholder="you@example.com" className={inputClass} required /></div>
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className={labelClass}>Phone Number <span className="font-normal text-gray-400">(optional)</span></label>
                <div className="relative"><FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]" size={17} /><input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={updateField} placeholder="Enter your phone number" className={inputClass} /></div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className={labelClass}>Password <span className="text-red-500">*</span></label>
                <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]" size={17} /><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={updateField} placeholder="Create a strong password" className={inputClass} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#536579] hover:text-[#0b3b60]">{showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}</button></div>
                <p className="mt-1 text-xs text-[#718096]">At least 8 characters, with uppercase, lowercase and a number.</p>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className={labelClass}>Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#536579]" size={17} /><input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={updateField} placeholder="Re-enter your password" className={inputClass} required /><button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#536579] hover:text-[#0b3b60]">{showConfirmPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}</button></div>
              </div>

              <label className="mb-4 flex cursor-pointer items-start gap-2 text-xs leading-5 text-[#526174]"><input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 h-4 w-4 accent-[#062f50]" /><span>I agree to the Terms of Use and understand this is a frontend demonstration account.</span></label>

              {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#062f50] font-semibold text-white transition hover:bg-[#041f36] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating account..." : <><FiCheckCircle size={17} /> Create Account <span className="text-lg">→</span></>}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/" className="ml-1 font-semibold text-blue-600 hover:underline">Log in</Link></p>
            <p className="mt-4 text-center text-[11px] leading-4 text-gray-400">Demo authentication only. For real accounts, use a Spring Boot backend with server-side password hashing and secure sessions.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Signin;
