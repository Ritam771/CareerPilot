const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "jwtToken";
const SESSION_KEY = "careerPilotSession";

function saveAuthResponse(data, fallbackEmail = "") {
  if (data?.jwtToken) {
    localStorage.setItem(TOKEN_KEY, data.jwtToken);
  }

  const session = {
    name: data?.name || data?.user?.name || "",
    email: data?.email || data?.user?.email || fallbackEmail,
    roles: Array.isArray(data?.roles) ? data.roles : [],
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
export async function registerUser(form) {
  const payload = {
    name: form.name?.trim(),
    email: form.email?.trim().toLowerCase(),
    phoneNumber: form.phone?.trim() || "",
    password: form.password,
  };

  const response = await fetch(`${API_BASE_URL}/api/auth/register-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Unable to create your account.";
    try {
      const errBody = await response.json();
      if (errBody?.message) message = errBody.message;
    } catch {
      // Non-JSON response
    }
    throw new Error(message);
  }

  const data = await response.json().catch(() => ({}));
  if (data?.jwtToken) {
    saveAuthResponse(data, payload.email);
  }
  return data;
}

export async function loginUser(email, password) {
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanEmail || !password) {
    throw new Error("Please enter your email and password.");
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: cleanEmail, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }

  const data = await response.json();
  if (!data?.jwtToken) {
    throw new Error("Login succeeded, but jwtToken was missing.");
  }

  return saveAuthResponse(data, cleanEmail);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");

    if (!token || !session || !session.email) {
      return null;
    }

    return {
      ...session,
      name: session.name?.trim() || null,
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken()) && getCurrentUser() !== null;
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}