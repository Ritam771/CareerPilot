const API_BASE_URL = "http://localhost:8080/api/auth";
const SESSION_KEY = "careerPilotSession";

function createSession(user) {
  const session = {
    id: user.id,
    name: user.name,
    email: user.email || user.identifier || "",
    phone: user.phone || "",
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function registerUser(form) {
  const name = form.name?.trim();
  const email = form.email?.trim().toLowerCase();
  const phone = form.phone?.trim() || "";
  const password = form.password;

  if (!name || !email || !password) {
    throw new Error("Please fill in all required fields.");
  }

  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to create account.");
  }

  if (data.token) {
    localStorage.setItem("jwtToken", data.token);
  }
  if (data.role) {
    localStorage.setItem("userRole", data.role);
  }

  const user = data.user || {
    id: data.id || `user-${Date.now()}`,
    name: data.name || name,
    email: data.email || email,
    phone: data.phone || phone,
  };

  return createSession(user);
}

export async function loginUser(identifier, password) {
  const cleanIdentifier = identifier?.trim().toLowerCase();

  if (!cleanIdentifier || !password) {
    throw new Error("Please enter your email/phone and password.");
  }

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: cleanIdentifier,
      password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Invalid email/phone or password.");
  }

  if (data.token) {
    localStorage.setItem("jwtToken", data.token);
  }
  if (data.role) {
    localStorage.setItem("userRole", data.role);
  }

  const user = data.user || {
    id: data.id || `user-${Date.now()}`,
    name: data.name || "User",
    email: data.email || cleanIdentifier,
    phone: data.phone || "",
  };

  return createSession(user);
}

export function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");

    if (!session || !session.id || !session.name) {
      return null;
    }

    return session;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userRole");
}